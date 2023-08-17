"use strict"

// check out login status
function checkoutLoginStatus() {
    if(localStorage.getItem('acess_token') && localStorage.getItem('username') && localStorage.getItem('name')) {
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
checkoutLoginStatus();
document.addEventListener("DOMContentLoaded", fetchNews);

// fetch new content to site
function fetchNews() {
    let posts = [];
    console.log('into fetchnew')
    fetch('/all-blogs')
        .then(res => res.json())
        .then((data) => {
            posts = data;
            console.log(posts);
            addPosts(posts);
        })
        .catch(err => console.log(err));
    };

// Update timeline column function


// Add posts elements to html function
async function addPosts(posts) {
   
    for await (let post of posts) {
        const main_column = document.getElementsByClassName('main-column')[1];
        const post_dom = document.createElement('div');
        post_dom.classList.add('post');
        post_dom.innerHTML = `
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
        <div class="post-body">${post.body}</div>
        <div class="more-button" data-id="${post._id}"><i class="fa-solid fa-ellipsis-vertical"></i></div>`;
        
        main_column.insertBefore(post_dom, main_column.firstChild);
        
     }; //replace(/\n/g, "\\n")     
     const main_column = document.getElementsByClassName('main-column')[1];

     const moreButton = main_column.getElementsByClassName('more-button');
        deletePost(moreButton);   
};
// delete post
function deletePost(moreButton) {
    for (let ele of moreButton) {
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
            }})
            .then(res =>{
                if(res.ok) {
                
                    ele.parentElement.classList.toggle("smallerize");
                    
                    setTimeout(() => {
                        ele.parentElement.remove();
                        // fetchNews()
                    }, 800);
                    
                }
        
        
                
            })
            .catch(err => console.log(err));
        
            })
  
    }
 } //lui va 1 o
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
        console.log('into former')
        e.preventDefault();
        let title = document.getElementById('title').value;
        // let tag = document.getElementById('tag').value;
        let body = document.getElementById('body').value;
    
        fetch('/add-blog', {
            method: 'post',
            body: JSON.stringify(
                {
                    title: title,
                    // tag: tag,
                    body: body,
                    token: localStorage.getItem('acess_token')
                }
            ),
            headers: {
                'Content-Type' : 'application/json',
                'Authorization': 'Bearer'
            }
            })  
            .then(res => {
                if(!res.ok) {throw new Error("Error")};
                return res.json();
            })
            .then ( res => {
                console.log ("res: ", res); 
                document.getElementsByClassName('create-post')[0].classList.toggle('display');
                document.querySelector('body').setAttribute("style", "overflow: auto");
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
                    name: name
                }
            ),
            headers: {
                'Content-Type' : 'application/json'
            }
            })  
    .then( res => res.json() )
    .then ( res => {
        console.log (res); 
        localStorage.setItem('acess_token', `${res[1]}`);
        localStorage.setItem('username', `${res[2]}`);
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
        localStorage.setItem('acess_token', `${res[1]}`);
        localStorage.setItem('username', `${res[2]}`);
        localStorage.setItem('name', `${res[3]}`);
        document.getElementsByClassName('create-post')[2].classList.toggle('display');
        document.querySelector('body').setAttribute("style", "overflow: auto");
        checkoutLoginStatus();
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
    localStorage.removeItem('username');
    checkoutLoginStatus();
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
