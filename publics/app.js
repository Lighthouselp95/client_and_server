"use strict"

let posts = [];

document.addEventListener("DOMContentLoaded", fetchNews);
// fetch new content to site
function fetchNews() {
    console.log('into fetchnew')
    fetch('/all-blogs')
        .then(res => res.json())
        .then((data) => {
            posts = data.reverse();
            console.log(posts);
            update_main_column();
        })
        .catch(err=>console.log(err));
    };
const main_column = document.getElementsByClassName('main-column')[1];
function update_main_column() {
    console.log('into update_main_column');

console.log(main_column);

addPosts(posts);

console.log(main_column);
}

function addPosts(posts) {
    posts.forEach((post) => {
        
        const post_dom = document.createElement('div');
        post_dom.classList.add('post');
        post_dom.innerHTML = `<div class="post-head">${post.title}
        </div>
        <div class="post-snippet">
        <i>
        ${post.snippet}
        </i>
        </div>
        <div class="post-body">
        ${post.body}
        </div>`;

        main_column.insertBefore(post_dom, main_column.firstChild);
     });
}


let create_post = document.getElementById('create-post');
console.log(create_post)
create_post.addEventListener("submit", handlePostSubmit);

function handlePostSubmit(e) {
    console.log('into former')
    e.preventDefault();
    let title = document.getElementById('title').value;
    let tag = document.getElementById('tag').value;
    let body = document.getElementById('body').value;
    
    fetch('/add-blog', {
        method: 'post',
        body: JSON.stringify(
            {
                title: title,
                tag: tag,
                body: body
            }
        ),
        headers: {
            'Content-Type' : 'application/json'
        }
    })
        .then( res => res.json() )
        .then ( res => {console.log (res); 
            document.getElementsByClassName('create-post')[0].classList.toggle('display');
            addPosts([res]);
        })
        .catch( (err) => console.log(err) )
}