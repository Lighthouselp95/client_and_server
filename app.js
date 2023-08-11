const express = require('express');
const morgan = require('morgan');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const Blog = require('./models/blogs');
const app = express();

// use morgan to log request
app.use(morgan('dev'));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended : false}));
// connect to mongodb
const dbURI = 'mongodb+srv://lighthouselp95:Tienchua123$$$@nodetuts-firsttime.gisbza8.mongodb.net/node-tuts1?retryWrites=true&w=majority';
mongoose.connect(dbURI, {useNewUrlParser : true, useUnifiedTopology : true})
    .then((result) => console.log("Connected to DB"))
    .catch((err) => console.log("err: ",err))

// mongoose and mongoose sandbox route
app.post('/add-blog', (req, res) => {
    console.log(req.body);
    const blog = new Blog({
        personID: 123456789,
        groupID: 9876553431,
        title: req.body.title,
        tag: req.body.tag,
        snippet: 'About youtube song',
        body: req.body.body
    });
    console.log(blog);
    blog.save()
        .then((result) => {
            res.send(result);
        })
        .catch((err) => (console.log(err)))

});
// get all the blogs from db
app.get('/all-blogs', (req,res) => {
    Blog.find()
        .then((result) => 
            res.send(result))
        .catch((err) => 
            console.log(err));
})

// get a single blog
app.get('/single-blog/:id', (req,res) => {
    console.log(req.params.id);
    Blog.findById(req.params.id)
        .then((result) => res.send(result))
        .catch((err) => console.log(err));
})
// listening to port: 3002
app.listen(3002, () => {
    console.log('Listening on port: 3002');
});

// app.use((req,res,next) => {
//     console.log(req.hostname, req.path, req.method);
//     next();
// });


app.use('/public',express.static('publics'));

app.get('/', (req,res) => {
    // console.log(req.url);
    // res.send('<p>Home Page</p>')
    res.sendFile('./publics/index.html', {root: __dirname});
});
// app.get('/style.css', (req,res) => {
//     res.sendFile('./HTML_folder/style.css', {root: __dirname});
// });
// app.get('/js.js', (req,res) => {
//     res.sendFile('./HTML_folder/js.js', {root: __dirname});
// });
// app.get('/assets/images/logo.png', (req,res) => {
//     // console.log(req.url);
//     res.sendFile('./HTML_folder/assets/images/logo.png', {root: __dirname});
// });
app.get('/about', (req,res) => {
    // res.send('<p>About Page</p>')
    res.sendFile('./publics/about.html', {root: __dirname});
});
// redirect
app.get('/about-us', (req,res) => {
    res.redirect('https://www.google.com');
    res.redirect('/about');
});
app.get('/about-us2', (req,res) => {
    res.writeHead(302,{'Location' : '/about'});
});
// handle params
app.get('/example/:name/:age', (req,res) => {
    console.log(req.params);
    console.log(req.query, JSON.stringify(req.query));
    res.send(req.params.name +" "+ req.params.age);
})
// 404 error
app.use((req,res) => {
    res.status(404).sendFile('./publics/404.html', {root: __dirname});
});


