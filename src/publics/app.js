"use strict"

// check out login status
function checkoutLoginStatus() {
    let b = document.cookie.replaceAll('=',':').replaceAll(';',':').replaceAll(' ','').split(':');
            if(localStorage.getItem('userId') && localStorage.getItem('name') && b.indexOf('token')>=0) {
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
    fetch('/log-in', {
        method: 'post'        
        })  
        .then( res => {
            let b = document.cookie.replaceAll('=',':').replaceAll(';',':').replaceAll(' ','').split(':');
            if(localStorage.getItem('userId') && localStorage.getItem('name') && b.indexOf('token')>=0) {
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
        })
        .catch ( err => {
            console.log (err); 
        })
}
document.querySelector('#nav-close-button').addEventListener('click', (e) => {
    // e.stopPropagation();
    // document.querySelector('#logout-button').style.pointerEvents = 'none';
    document.querySelector('.nav-wrapper').style.translate = '100%';

}, false)
const openMediaDevices = async () => {
    try {
        
    // document.querySelector('body').style = "overflow: hidden";
    const constraints = { 'video': {
        "width": {
            "min": 640,
            "max": 1024
        },
        "height": {
            "min": 480,
            "max": 768
        }}
        ,'audio':true};
    const openMediaDevice = await navigator.mediaDevices.getUserMedia(constraints);
    const video = document.querySelector('#rtc-stream');
    document.querySelector('#rtc-closed-button').addEventListener('click', () => {videoframe.style = "display: none";
    // openMediaDevice.removeTrack();
        document.querySelector('body').style = "overflow: auto";
        openMediaDevice.getTracks().forEach(function(track) {
            console.log(track);
            track.stop();
        });
    });
    const videoframe = document.querySelector('.rtc-modular');
    // const stream = openMediaDevice();
    console.log('Got MediaStream:', openMediaDevice);
    video.srcObject = openMediaDevice;
    video.style = "display: block; margin: auto;"
    videoframe.style = "overflow: hidden; text-align: center; padding: 11px; left: 50%; top:70px; translate: -50%; background-color: #e9e9d1; z-index: 14; display: block; position: fixed; visibility: visible;"
    } catch(error) {
        console.error('Error accessing media devices.', error);
    }
}
document.querySelector('#rtc').addEventListener('click', openMediaDevices);
// const loader = document.createElement('div');
//     loader.classList.add('loader-container');
//     loader.innerHTML = `<div class="loading-spinner">
//     </div>`
//     document.querySelectorAll('.content')[0].appendChild(loader);
// checkoutLoginStatus();

document.addEventListener("DOMContentLoaded", checkoutLoginStatus);
// fetchNews();
document.addEventListener("DOMContentLoaded", fetchNews);

// fetch new content to site
async function fetchNews() {
    const main_column = document.createElement('div');
    main_column.classList.add('main-column');
    document.querySelector('.content').appendChild(main_column);
    let posts = [];
    console.log('into fetchnew')
    await fetch('/blog')
        .then(res => res.json())
        .then((data) => {
            posts = data;
            // console.log(posts);
            if(document.getElementsByClassName('loader-container')[0]) {
                // document.getElementsByClassName('loader-container')[0].classList.add('opacity0');
                setTimeout(() => document.getElementsByClassName('loader-container')[0].remove(), 300);
            };
            addPosts(posts);
            checkLikePost();
            checkPostCondition();
        })
        .catch(err => console.log(err));
        console.log('post ngoai: ', posts);
    };

// Update timeline column function


// Add posts elements to html function
function addPosts(posts) {
    const main_column = document.querySelectorAll('.main-column')[1];
    for (let post of posts) {
        const post_dom = document.createElement('div');
        post_dom.classList.add('post-wrapper');
        post_dom.setAttribute('data-id', post._id)
        // post.file!== undefined? post.file = post.file.replace('"',''):'';
        // if (post.file!== undefined) {
        // post.file = JSON.stringify(post.file);
        // post.file = JSON.parse(post.file);
        
        // post.file = JSON.parse(post.file);
        // }
        // console.log(post.file, ': typeof :', typeof post.file);
        
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
            ${moment(post.createdAt).fromNow()}
            </i>
            </div>
            <div class="post-body">${post.file? (post.file.length!==0? ('<div class="img-wrapper">'+(post.file.map((e) => (e.resource_type=='image'&& //post.file[0].url.split('.').pop()=='mp4'? 
            `<img src=${e.url} class="post-img" width="100%" height="100%">`)
            ||  (e.file_format == 'mp4'&&`<video  class="post-img" width="100%" height="100%" controls controlsList="nodownload" webkit-playsinline playsinline muted><source src=${e.url}></video>`)
            || ((e.file_format == 'mp3'||e.resource_type=='video')&&`<audio controls controlsList="nodownload" class="post-img" width="100%" height="100%">
                <source src=${e.url}>
                <p>${e.original_filename}</p>
                Your browser does not support the audio tag.
            </audio>`)).join(''))+'</div>')
            : '') :''}<p>${post.body}</p></div>
            <div class = "react-band">
                <div class = "react" data-like="0"><i class="fa-regular fa-heart"></i>
                </div>
                <div class = "more-button" data-id="${post._id}" data-user-id = "${post.personID}"><i class="fa-solid fa-ellipsis-vertical"></i>
                </div>
            </div>
            <div class="number-like">${post.like.length} person likes</div>
            </div>

            <div class="comment-button">
                <button class="button-8" ${`data-number-comment=${post.comments.length}`}>Comment</button>
            </div>
           
            <div class="comment-content">
                <div >
                    <form class="write-comment">
                        <div class="send-wrapper" data-id="${post._id}">
                            <i class="fa-regular fa-paper-plane"></i>
                        </div>
                        <textarea placeholder="Write comment: " type="text" required class="write-comment-input"></textarea>
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
        


        post_dom.querySelector('.comment-button').onclick = (e) => {
            
            post_dom.querySelector('.comment-content').classList.toggle('display');
            }
        post_dom.querySelector('.post-body').addEventListener('click', (e) => {
            // if (e.target === post_dom.querySelector('.react')) {e.preventDefault()}
            const list = post_dom.querySelectorAll('.post-img');
            let condi;
            list.forEach(ele => {
            if (e.target == ele) {
                condi = true;
                
                
            }})
            console.log(condi);
            if(!condi) {
            post_dom.querySelector('.comment-content').classList.toggle('display');
            }
            })
        post_dom.querySelector('.react-band').addEventListener('click', (e) => {
            // if (e.target === post_dom.querySelector('.react')) {e.preventDefault()}
            if (e.target.className == 'fa-solid fa-heart'||e.target.className == 'fa-regular fa-heart'||e.target.className == 'fa-solid fa-ellipsis-vertical'||e.target.className == 'more-button'||e.target.className == 'react') {
                console.log('false');}
                else {
                post_dom.querySelector('.comment-content').classList.toggle('display');
            }
            
            })
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
        const value = ele.parentElement.querySelector('.write-comment-input').value;
        ele.parentElement.querySelector('.write-comment-input').value = '';
        if(value) {
                fetch(`/comment/${id}`, {
                    method: 'post',
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(
                        {
                            userId: localStorage.getItem('userId'),
                            comment: value
                        }
                        )
                    })
                    .then(res => res.json())
                    .then(data => {console.log(data);
                        addComment([data], document.querySelector(`.comment-body[data-id="${id}"]`));
                        
                        const button8 = ele.parentElement.parentElement.parentElement.parentElement.querySelector('.button-8');
                        button8.setAttribute('data-number-comment', Number(button8.getAttribute('data-number-comment')) + 1);
                        // fetchNews();
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
        div.classList.add('comment-wrapper'); //format("dddd, MMMM Do YYYY, h:mm:ss a")
        div.innerHTML = `
        <p class="comment-user">${e.name?e.name:""}</p>
        <div class="comment-time">${moment(e.createAt).format("lll")}</div> 
        <div class="comment-line anime1 ${comments.length==1?'anime1':''}"><p>${e.comment}</p><div class="delete-comment"><i class="fa-solid fa-xmark"></i></div></div>
        `;
        
        localStorage.getItem('userId') == e.userId || localStorage.getItem('userId')=='64e0eee99c007c207682e49a'? div.querySelector('.delete-comment').style.visibility = 'visible' : 
        div.querySelector('.delete-comment').style.visibility = 'hidden';
        
        div.querySelector('.delete-comment').addEventListener('click', () => {
            fetch(`comment/${e._id}`,{
                method: 'delete',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(
                    {
                        userId: localStorage.getItem('userId'),
                        cmId: e.userId
                    }
                    )
                })
                .then(res => {if(res.ok) {
                    
                    document.querySelector(`.comment-wrapper .comment-line`).classList.add('opacity0');
                    setTimeout(() => {
                        document.querySelector(`.comment-wrapper[data-cm-id="${e._id}"]`).remove();
                        const button8 = commentBodyDom.parentElement.previousElementSibling.querySelector('.button-8');
                        button8.setAttribute('data-number-comment', Number(button8.getAttribute('data-number-comment')) - 1);
                    }, 500);
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
        method: 'get',
        headers: {"Content-Type": "application/json"}
            
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
        // ele.addEventListener('click', () => alert('Hello!'));
        ele.addEventListener('click', () => {
            
          
            fetch(`/like/${postId}`, {
                method: 'post',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(
                    {
                        userId: localStorage.getItem('userId')
                    }
                    )
                })
                .then(res => {
                    if(!res.ok) {
                        // ele.innerHTML = '<i class="fa-regular fa-heart"></i>';
                    } 
                    return res.json();
                })
                .then(data => {
                    // ele.getAttribute('data-like') == 0? ele.innerHTML = '<i class="fa-solid fa-heart"></i>' : ele.innerHTML = '<i class="fa-regular fa-heart"></i>';
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
        // console.log(ele.getAttribute('data-user-id'));
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
            fetch(`/blog/${postId}`, {
                method: 'delete',
                body: JSON.stringify(
                    {   
                        post_id: postId
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
        document.querySelector('#create-a-post').value = '';
        document.getElementsByClassName('create-post')[0].classList.toggle('display');
        document.querySelector('body').setAttribute("style", "overflow: auto");
        console.log('into form')
        e.preventDefault();
        let title = document.getElementById('title').value;
        // let tag = document.getElementById('tag').value;
        let body = document.getElementById('create-post-body').value;
        let file_url = document.getElementById('file').value;
        console.log('file upload url: ', file_url);
        if(!(body||file_url||title)) return console.log('error: Lack information');
        const form = document.getElementsByTagName('form')[0];
        const submiter = document.getElementById('submit');
        const formData = new FormData(form, submiter);
        for (const [key, value] of formData) {
            console.log(key, ': ', value);
        }
        fetch('/blog', {
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
                // console.log ("res: ", res); 
                
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
        // console.log (res); 
        // var cre = new PasswordCredential(e.target);
        // navigator.credentials.store(cre);
        // console.log(cre);
        localStorage.setItem('userId', `${res.userId}`);
        localStorage.setItem('name', `${res.name}`);
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
        document.getElementsByClassName('create-post')[2].classList.toggle('display');
        document.querySelector('body').setAttribute("style", "overflow: auto");
        console.log (res); 
        // var cre = new PasswordCredential(e.target);
        // navigator.credentials.store(cre);
        // console.log(cre);
        localStorage.setItem('userId', `${res.userId}`);
        localStorage.setItem('name', `${res.name}`);
    })
    .then(() => {
        checkoutLoginStatus();
        checkPostCondition();
        checkLikePost();
        // document.querySelectorAll('.main-column')[1].innerHTML = '';
        // fetchNews();
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
    fetch('/logout', {
        method: 'get',
        mode: 'no-cors'
    })
    .then(() => {
        
        localStorage.removeItem('userId');
        localStorage.removeItem('name');
        checkoutLoginStatus();
        checkPostCondition();
        checkLikePost();
    })
    .catch(err => console.log(err));
    
    // fetchNews();
}


// Handle modal open and closed
let button_modal = [
    document.getElementById('create-a-post'),
    document.getElementsByClassName('login-button')[0],
    document.getElementsByClassName('login-button')[1]
];

button_modal.forEach((element, index) => {
    element.addEventListener('click', (e) => {
        // if (e.target.tagName=='path') {e.stopPropagation()}
        // e.stopPropagation();
        document.querySelector('#create-a-post').value = '';
        document.getElementsByClassName('create-post')[index].classList.toggle('display');
        document.querySelector('body').setAttribute("style", "overflow: hidden");
    }, false)
    document.getElementsByClassName('create-post')[index].querySelector('.close-button-post').addEventListener('click', (e) => {
        // e.stopPropagation();
        document.querySelector('#create-a-post').value = '';
        document.getElementsByClassName('create-post')[index].classList.toggle('display');
        document.querySelector('body').setAttribute("style", "overflow: auto");
    }, false)
    
});
document.querySelector('#menu').addEventListener('click', (e) => {
    
    document.querySelector('.nav-wrapper').style.translate = '0%';
})
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