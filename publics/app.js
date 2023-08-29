"use strict"

// check out login status
function checkoutLoginStatus() {
    if(localStorage.getItem('acess_token') && localStorage.getItem('userId') && localStorage.getItem('name')) {
        if(document.getElementById('logout-button').classList.contains('hidden')) {
            document.getElementById('username').innerText = localStorage.getItem('name');
            document.getElementById('signup-button').classList.toggle('hidden');
            document.getElementById('login-button').classList.toggle('hidden');
            document.getElementById('logout-button').classList.toggle('hidden');
    }
    } else {
        if(!document.getElementById('logout-button').classList.contains('hidden')) {
            document.getElementById('username').innerText = '';
            document.getElementById('signup-button').classList.toggle('hidden');
            document.getElementById('login-button').classList.toggle('hidden');
            document.getElementById('logout-button').classList.toggle('hidden');
        }
    }
};

// checkoutLoginStatus();

document.addEventListener("DOMContentLoaded", checkoutLoginStatus);
// fetchNews();
document.addEventListener("DOMContentLoaded", fetchNews);

// fetch new content to site
function fetchNews() {
    document.getElementsByClassName('main-column')[1].innerHTML= "";
    let posts = [];
    console.log('into fetchnew')
    fetch('/all-blogs')
        .then(res => res.json())
        .then((data) => {
            posts = data;
            console.log(posts);
            addPosts(posts);
            checkPostCondition();
            checkLikePost();
        })
        .catch(err => console.log(err));
    };

// Update timeline column function


// Add posts elements to html function
function addPosts(posts) {
   
    for (let post of posts) {
        const main_column = document.getElementsByClassName('main-column')[1];
        const post_dom = document.createElement('div');

        post_dom.classList.add('post-wrapper');
        post_dom.setAttribute('data-id', post._id)
        // post.file!== undefined? post.file = post.file.replace('"',''):'';
        // if (post.file!== undefined) {
        // post.file = JSON.stringify(post.file);
        // post.file = JSON.parse(post.file);
        
        // post.file = JSON.parse(post.file);
        // }
        console.log(post.file, ': typeof :', typeof post.file);
        
        post_dom.innerHTML = 
            `
            <div class="post">
            <div class="posts-person">
            ${post.title}
            </div>
            <div class="post-head">${post.name}
            </div>
            
            <div class="post-snippet">
            <i>
            ${moment(post.createdAt).format("HH:mm DD/MM/YYYY ")}
            </i>
            </div>
            <div class="post-body">${post.file[0]?.url? (post.file[0].resource_type=='image'? //post.file[0].url.split('.').pop()=='mp4'? 
            `<img src=${(post.file[0].url)} class="post-img" width="100%" height="100%">`
            :`<video src=${(post.file[0].url)} class="post-img" width="100%" height="100%" controls autoplay="autoplay" muted></video>`)
            :''}${post.body}</div>
            <div class = "react-band">
            <div class = "react" data-like="0"><i class="fa-regular fa-heart"></i></div>
            <div class = "more-button" data-id="${post._id}" data-user-id = "${post.personID}"><i class="fa-solid fa-ellipsis-vertical"></i></div>
            </div>
            <div class="number-like">${post.like.length} person likes</div>
            </div>

            <div class="comment-button">
                <button class="button-8" ${post.comments.length==0?"":`data-number-comment=${post.comments.length}`}>Comment</button>
            </div>
           
            <div class="comment-content">
                <div >
                    <form class="write-comment">
                        <div class="send-wrapper" data-comments="${post.comments.length}" data-id="${post._id}">
                            <i class="fa-regular fa-paper-plane"></i>
                        </div>
                        <input placeholder="Write comment: " id="write-comment" type="text" required></input>
                    </form>
                </div>
                <div class="comment-body" data-id="${post._id}">
                </div>
            </div>
            
            `;           
        
        const cmt = post_dom.querySelector('.comment-body');
        post_dom.querySelector('form').addEventListener('submit', (e) => {
            e.preventDefault();
            post_dom.querySelector('.send-wrapper').click()
        })
        


        post_dom.querySelector('.comment-button').onclick = () => {
            post_dom.querySelector('.comment-content').classList.toggle('display');
            }
        addComment(post.comments, cmt);
        addDeleteEvent([post_dom.querySelector('.more-button')]);
        addLikeEvent([post_dom.querySelector('.react')]);
        addCommentEvent([post_dom.querySelector('.send-wrapper')])
        main_column.insertBefore(post_dom, main_column.firstChild);
        
     }; //replace(/\n/g, "\\n")     
        
};
//
function addCommentEvent(sendButtons) {
    sendButtons.forEach((ele) => {
        ele.addEventListener('click', () => {
        const id = ele.getAttribute('data-id');
        const cmts = ele.getAttribute('data-comments');
        const value = ele.parentElement.querySelector('#write-comment').value;
        if(value) {
                fetch(`/comment/${id}`, {
                    method: 'post',
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(
                        {
                            token: localStorage.getItem('acess_token'),
                            userId: localStorage.getItem('userId'),
                            comment: value
                        }
                        )
                    })
                    .then(res => res.json())
                    .then(data => {console.log(data);
                        addComment([data], document.querySelector(`.comment-body[data-id="${id}"]`));
                        fetchNews();
                    })
                    .catch(err => console.log(err))
                
    }})
}
    )}
//
function addComment(comments, commentBodyDom) {
    comments.forEach((e) => {
        const div = document.createElement('div');
        div.setAttribute('data-cm-id', e._id);
        
        div.setAttribute('data-user-id', e.userId);
        div.classList.add('comment-wrapper');
        div.innerHTML = `
        <p class="comment-user">${e.name?e.name:""}</p>
        <div class="comment-line"><p>${e.comment}</p><div class="delete-comment"><i class="fa-solid fa-xmark"></i></div></div>
        `;
        localStorage.getItem('userId') == e.userId || localStorage.getItem('userId')=='64e0eee99c007c207682e49a'? div.querySelector('.delete-comment').style.visibility = 'visible' : 
        div.querySelector('.delete-comment').style.visibility = 'hidden';
        
        div.querySelector('.delete-comment').addEventListener('click', () => {
            fetch(`comment/${e._id}`,{
                method: 'delete',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(
                    {
                        token: localStorage.getItem('acess_token'),
                        userId: localStorage.getItem('userId'),
                        cmId: e.userId
                    }
                    )
                })
                .then(res => {if(res.ok) {
                    document.querySelector(`.comment-wrapper[data-cm-id="${e._id}"]`).classList.add('opacity0');
                    setTimeout(() => document.querySelector(`.comment-wrapper[data-cm-id="${e._id}"]`).remove(), 500);
                }
                })
            
                .catch(err => console.log(err))
        
            });
        
        commentBodyDom.insertBefore( div, commentBodyDom.firstChild);
        }
    );
    ;
    // return commentBodyDom;
}
//check like post
function checkLikePost() {
    let moreButtons = document.querySelectorAll('.more-button');    
    var userLikes;
    fetch(`/userlike`, {
        method: 'post',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(
            {
                token: localStorage.getItem('acess_token'),
                userId: localStorage.getItem('userId')
            }
            )
            
            })

        .then(res => res.json())

        .then((data) => { userLikes = data;
            for (let moreButton of moreButtons) {
                moreButton.parentElement.querySelector('.react').setAttribute('data-like', 0);
                moreButton.parentElement.querySelector('.react').innerHTML = '<i class="fa-regular fa-heart"></i>';
            }
            userLikes = userLikes.map((ele) => ele.postId);
            // console.log(userLikes);
            moreButtons = [...moreButtons];
            // console.log(moreButtons);
            const moreButtonsLikes = moreButtons.filter((moreButton) => {
                return userLikes.includes(moreButton.getAttribute('data-id'));
                    }) 
            for (let moreButtonsLike of moreButtonsLikes) {
                moreButtonsLike.parentElement.querySelector('.react').setAttribute('data-like', 1);
                moreButtonsLike.parentElement.querySelector('.react').innerHTML = '<i class="fa-solid fa-heart"></i>';
            }
        })

        .catch(err => {console.log(err);
            for(let moreButton of moreButtons) {
                moreButton.parentElement.querySelector('.react').setAttribute('data-like', 0);
                moreButton.parentElement.querySelector('.react').innerHTML = '<i class="fa-regular fa-heart"></i>';
            }
        }
            )
}
// delete post
function addLikeEvent (likeButtons) {
    likeButtons.forEach((ele) => {
        let postId = ele.parentElement.querySelector('.more-button').getAttribute('data-id');
        ele.addEventListener('click', () => {
            ele.getAttribute('data-like') == 0? 
            ele.innerHTML = '<i class="fa-solid fa-heart"></i>' : ele.innerHTML = '<i class="fa-regular fa-heart"></i>';
          
            fetch(`/like/${postId}`, {
                method: 'post',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(
                    {
                        token: localStorage.getItem('acess_token'),
                        userId: localStorage.getItem('userId')
                    }
                    )
                })
                .then(res => {
                    if(!res.ok) {
                        ele.innerHTML = '<i class="fa-regular fa-heart"></i>';
                    } 
                    return res.json();
                })
                .then(data => {
                    ele.parentElement.parentElement.querySelector('.number-like').innerHTML = `${data[2].like.length} person likes`
                    if(ele.getAttribute('data-like') == 0) {
                        ele.innerHTML = '<i class="fa-solid fa-heart"></i>';
                        
                        // const a = ele.parentElement.parentElement.querySelector('.number-like');
                        // a.innerHTML = parseInt(a.innerHTML,10) + 1 + 'person likes';
                        ele.setAttribute('data-like', 1);
                    } else {
                        ele.innerHTML = '<i class="fa-regular fa-heart"></i>';
                        ele.setAttribute('data-like', 0);
                        // const a = ele.parentElement.parentElement.querySelector('.number-like');
                        // a.innerHTML = parseInt(a.innerHTML,10) - 1 + 'person likes';
                        }
                }
            )     
            .catch(err => {console.log(err);
                
            }
                )
        })
    })
}

 //checkPostCondition to display delete sign
 function checkPostCondition() {
    
        const moreButton = document.querySelectorAll('.more-button');    
        moreButton.forEach((ele) => {
        console.log(ele.getAttribute('data-user-id'));
        if (ele.getAttribute('data-user-id') == localStorage.getItem('userId') || localStorage.getItem('userId')=='64e0eee99c007c207682e49a') {
            
            ele.style.visibility = 'visible';
        } else {
            ele.style.visibility = 'hidden';
        }
    })
}

function addDeleteEvent(posts) {
        
        posts.forEach((ele) => {
        ele.addEventListener('click', () => {
            const postId = ele.getAttribute("data-id");
            fetch(`/blogs/${postId}`, {
                method: 'delete',
                body: JSON.stringify(
                    {   
                        post_id: postId,
                        token: localStorage.getItem('acess_token')
                    }
                    ),
                headers: {
                    'Content-Type' : 'application/json'
                    }
                })
            .then(res =>{
                if(res.ok) {
                
                    document.querySelector(`[data-id="${postId}"]`).classList.toggle("smallerize");
                    
                    setTimeout(() => {
                        document.querySelector(`[data-id="${postId}"]`).remove();
                        // fetchNews()
                    }, 800);
                    
                }
            })
            .catch(err => console.log(err));    
            })
        })
    }
   
// document.getElementsByClassName('more-button').forEach((ele, index) => {
//     ele.addEventListener
// })
// Handle post create submit
document.getElementById('create-post').addEventListener("submit", handlePostSubmit);
document.getElementById('signup-form').addEventListener("submit", handleSignupSubmit);
document.getElementById('login-form').addEventListener("submit", handleLoginSubmit);
document.getElementById('logout-button').addEventListener("click", handleLogoutButton);
;

function handlePostSubmit(e) {
        document.getElementsByClassName('create-post')[0].classList.toggle('display');
        document.querySelector('body').setAttribute("style", "overflow: auto");
        console.log('into former')
        e.preventDefault();
        let title = document.getElementById('title').value;
        // let tag = document.getElementById('tag').value;
        let body = document.getElementById('create-post-body').value;
        let file_url = document.getElementById('file').value;
        console.log(file_url);
        const form = document.getElementsByTagName('form')[0];
        const submiter = document.getElementById('submit');
        const formData = new FormData(form, submiter);
        formData.append('token', localStorage.getItem('acess_token'));
        for (const [key, value] of formData) {
            console.log(key, ': ', value);
        }
        fetch('/add-blog', {
            method: 'POST',
            // body: JSON.stringify(
            //     {
            //         title: title,
            //         // tag: tag,
            //         body: body,
            //         file_url: file_url,
            //         token: localStorage.getItem('acess_token')
            //     }
            // ),
            body: formData,
            headers: {
                'Authorization': 'Bearer'
            }
            })  
            .then(res => {
                if(!res.ok) {throw new Error("Error")};
                return res.json();
            })
            .then ( res => {
                console.log ("res: ", res); 
                
                addPosts([res]);
                
            })
            .catch( (err) => {
                console.log('err: ', err);
                
                document.getElementsByClassName('post-noti')[0].classList.toggle('hidden');
                setTimeout(() => {
                    document.getElementsByClassName('post-noti')[0].classList.toggle('hidden');
                }, 1000)

            }

             )
};
function handleSignupSubmit(e) {
    console.log('into sign in form');
    let id = document.getElementsByName('id')[0].value;
    let password = document.getElementsByName('password')[0].value;
    let email = document.getElementsByName('email')[0].value;
    let name = document.getElementsByName('name')[0].value;
    e.preventDefault();
    fetch('/sign-up', {
            method: 'post',
            body: JSON.stringify(
                {
                    id: id,
                    // tag: tag,
                    password: password,
                    email: email,
                    name: name,
                    credentials: 'include'
                }
            ),
            headers: {
                'Content-Type' : 'application/json'
            }
            })  
    .then( res => res.json() )
    .then ( res => {
        console.log (res); 
        // var cre = new PasswordCredential(e.target);
        // navigator.credentials.store(cre);
        // console.log(cre);
        localStorage.setItem('acess_token', `${res[1]}`);
        localStorage.setItem('userId', `${res[2]}`);
        localStorage.setItem('name', `${res[3]}`);
        document.getElementsByClassName('create-post')[1].classList.toggle('display');
        document.querySelector('body').setAttribute("style", "overflow: auto");
        checkoutLoginStatus();

    })
    .catch( (err) => {
        console.log(err); 
        document.getElementsByClassName('post-noti')[1].classList.toggle('hidden');
                setTimeout(() => {
                    document.getElementsByClassName('post-noti')[1].classList.toggle('hidden');
                },1000)
    });
}
function handleLoginSubmit(e) {
    
    console.log('into log in form');
    let id = document.getElementsByName('id')[1].value;
    let password = document.getElementsByName('password')[1].value;
    e.preventDefault();
    fetch('/log-in', {
            method: 'post',
            body: JSON.stringify(
                {
                    id: id,
                    // tag: tag,
                    password: password,
                }
            ),
            headers: {
                'Content-Type' : 'application/json'
            }
            })  
    .then( res => res.json() )
    .then ( res => {
        console.log (res); 
        // var cre = new PasswordCredential(e.target);
        // navigator.credentials.store(cre);
        // console.log(cre);
        localStorage.setItem('acess_token', `${res[1]}`);
        localStorage.setItem('userId', `${res[2]}`);
        localStorage.setItem('name', `${res[3]}`);
        document.getElementsByClassName('create-post')[2].classList.toggle('display');
        document.querySelector('body').setAttribute("style", "overflow: auto");
    })
    .then(() => {
        checkoutLoginStatus();
        // checkPostCondition();
        // checkLikePost();
        // console.log(cre)
        fetchNews();
    })
    .catch( (err) => {
        console.log(err);
        document.getElementsByClassName('post-noti')[2].classList.toggle('hidden');
                setTimeout(() => {
                    document.getElementsByClassName('post-noti')[2].classList.toggle('hidden');
                },1000)
    });
}

// Handle logoout
function handleLogoutButton() {
    localStorage.removeItem('acess_token');
    localStorage.removeItem('userId');
    checkoutLoginStatus();
    checkPostCondition();
    checkLikePost();
    // fetchNews();
}


// Handle modal open and closed
let button_modal = [
    document.getElementById('create-a-post'),
    document.getElementsByClassName('login-button')[0],
    document.getElementsByClassName('login-button')[1]
];

button_modal.forEach((element, index) => {
    element.addEventListener('click', () => {
        document.getElementsByClassName('create-post')[index].classList.toggle('display');
        document.querySelector('body').setAttribute("style", "overflow: hidden");
    })
    document.getElementsByClassName('close-button-post')[index].addEventListener('click', () => {
        document.getElementsByClassName('create-post')[index].classList.toggle('display');
        document.querySelector('body').setAttribute("style", "overflow: auto");
    })
    
});

// Handle post create and Prevent scrolling on background
// let create_a_post = document.getElementById('create-a-post');
// create_a_post.addEventListener('focus', () => {
//     document.getElementsByClassName('create-post')[2].classList.toggle('display');
    
//     // if (document.getElementsByClassName('create-post')[0].classList.contains('display')) {

//     //     console.log(document.getElementsByTagName('body'));
//         document.querySelector('body').setAttribute("style", "overflow: hidden");
//     // } else {
//     //     document.querySelector('body').setAttribute("style", "overflow: auto");
//     // }

// });

// Handle closed button and re scrolling
// document.getElementById('create-a-post-closed-button').addEventListener('click', handleClosedButton);

// function handleClosedButton() {
//         document.getElementsByClassName('create-post')[2].classList.toggle('display');
// //     if (document.getElementsByClassName('create-post')[0].classList.contains('display')) {

// //         console.log(document.getElementsByTagName('body'));
//     //     document.querySelector('body').setAttribute("style", "overflow: hidden");
//     // } 
//     // else {
//         document.querySelector('body').setAttribute("style", "overflow: auto");
//     // }
// }

// handle login button
// document.getElementById('signup-button').addEventListener('click',() => {
//     document.getElementsByClassName('create-post')[2].classList.toggle('display');
//     document.querySelector('body').setAttribute("style", "overflow: auto");
//     // }
// });
// handle sign in button
