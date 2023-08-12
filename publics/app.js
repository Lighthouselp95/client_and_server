"use strict"


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
function addPosts(posts) {
    posts.forEach((post) => {
        const main_column = document.getElementsByClassName('main-column')[1];
        const post_dom = document.createElement('div');
        post_dom.classList.add('post');
        post_dom.innerHTML = `<div class="post-head">${post.title}
        </div>
        <div class="post-snippet">
        <i>
        ${moment(post.createdAt).format("HH:mm DD/MM/YYYY ")}
        </i>
        </div>
        <div class="post-body">
        ${post.body}
        </div>`;

        main_column.insertBefore(post_dom, main_column.firstChild);
     });
};

// Handle post create post submit
document.getElementById('create-post').addEventListener("submit", handlePostSubmit);
document.getElementById('signin-form').addEventListener("submit", handleSigninSubmit);
document.getElementById('login-form').addEventListener("submit", handleLoginSubmit);
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
                    body: body
                }
            ),
            headers: {
                'Content-Type' : 'application/json'
            }
            })  
            .then( res => res.json() )
            .then ( res => {
                console.log (res); 
                document.getElementsByClassName('create-post')[0].classList.toggle('display');
                document.querySelector('body').setAttribute("style", "overflow: auto");
                addPosts([res]);
            })
            .catch( (err) => console.log(err) )
};

function handleSigninSubmit(e) {
    console.log('into sign in form');
    let id = document.getElementsByName('id')[0].value;
    let password = document.getElementsByName('password')[0].value;
    let email = document.getElementsByName('email')[0].value;
    e.preventDefault();
    fetch('/sign-in', {
            method: 'post',
            body: JSON.stringify(
                {
                    id: id,
                    // tag: tag,
                    password: password,
                    email: email
                }
            ),
            headers: {
                'Content-Type' : 'application/json'
            }
            })  
    .then( res => res.json() )
    .then ( res => {
        console.log (res); 
        document.getElementsByClassName('create-post')[1].classList.toggle('display');
        document.querySelector('body').setAttribute("style", "overflow: auto");
    })
    .catch( (err) => console.log(err) );
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
        document.getElementsByClassName('create-post')[2].classList.toggle('display');
        document.querySelector('body').setAttribute("style", "overflow: auto");
    })
    .catch( (err) => console.log(err) );
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
        document.querySelector('body').setAttribute("style", "position: fixed");
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
// document.getElementById('signin-button').addEventListener('click',() => {
//     document.getElementsByClassName('create-post')[2].classList.toggle('display');
//     document.querySelector('body').setAttribute("style", "overflow: auto");
//     // }
// });
// handle sign in button
