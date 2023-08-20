const express = require('express');
const morgan = require('morgan');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const {Blog, User} = require('./models/Schema');
const authen = require('./middlewares/authen');
const controllerSignup = require("./controllers/controller.signup");
const controllerDeletePost = require('./controllers/controller.deletePost');
const controllerAddpost = require('./controllers/controller.Addpost');
const controllerLikePost = require('./controllers/controller.likePost');
const controllerGetallpost =  require('./controllers/controller.getAllpost');
const controllerUserLike = require('./controllers/controller.userLike');
const controllerComment = require('./controllers/controller.comment')
const verifySignup = require('./middlewares/verifySignup');
const verifyLogin = require('./middlewares/verifyLogin');
const app = express();
require('dotenv').config();
// use morgan to log request
app.use(morgan('dev'));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended : false}));
// connect to mongodb
const dbURI = process.env.DB_URI;
mongoose.connect(dbURI, {useNewUrlParser : true, useUnifiedTopology : true})
    .then((result) => console.log("Connected to DB"))
    .catch((err) => console.log("err: ", err))

// mongoose and mongoose sandbox route
app.post('/add-blog', authen, controllerAddpost);
app.post('/like/:postid', authen, controllerLikePost);
app.post('/userlike', authen, controllerUserLike)
app.post('/comment/:postId', authen, controllerComment)
app.get('/all-users', async (req, res) => {
    let users = await User.find().sort({createdAt: 1});
    res.send(users);
})
// get all the blogs from db
app.get('/all-blogs', controllerGetallpost);
app.delete('/blogs/:id', authen, controllerDeletePost);
// get a single blog


app.get('/blog/:id', (req,res) => {
    console.log(req.params.id);
    Blog.findById(req.params.id)
        .then((result) => res.send(result))
        .catch((err) => console.log(err));
})
app.get('/user/:id', (req,res) => {
    console.log(req.params.id);
    User.findById(req.params.id)
        .then((result) => res.send(result))
        .catch((err) => console.log(err));
})
//Login
app.post('/sign-up', verifySignup.verify, controllerSignup);
app.post('/log-in', verifyLogin);
// listening to port: 3002
app.listen(process.env.PORT, () => {
    console.log(`Listening on port: ${process.env.PORT}`);
});

// app.use((req,res,next) => {
//     console.log(req.hostname, req.path, req.method);
//     next();
// });


app.use('/public', express.static('publics'));

app.get('/', (req, res) => {
    // console.log(req.url);
    // res.send('<p>Home Page</p>')
    res.sendFile('./publics/index.html', {root: __dirname});
});

app.get('/about', (req, res) => {
    // res.send('<p>About Page</p>')
    res.sendFile('./publics/about.html', {root: __dirname});
});
// redirect
app.get('/about-us', (req, res) => {
    res.redirect('https://www.google.com');
    res.redirect('/about');
});
app.get('/about-us2', (req, res) => {
    res.writeHead(302, {'Location' : '/about'});
});
// handle params
app.get('/example/:name/:age', (req, res) => {
    console.log(req.params);
    console.log(req.query, JSON.stringify(req.query));
    res.send(req.params.name +" "+ req.params.age);
})
// 404 error
app.use((req, res) => {
    res.status(404).sendFile('./publics/404.html', {root: __dirname});
});


