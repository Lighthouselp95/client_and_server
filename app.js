const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const os = require('os');
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const {Blog, User} = require('./models/Schema');
const authen = require('./middlewares/authen');
const controllerSignup = require("./controllers/controller.signup");
const controllerDeletePost = require('./controllers/controller.deletePost');
const controllerAddpost = require('./controllers/controller.Addpost');
const controllerLikePost = require('./controllers/controller.likePost');
const controllerGetallpost =  require('./controllers/controller.getAllpost');
const controllerUserLike = require('./controllers/controller.userLike');
const controllerComment = require('./controllers/controller.comment');
const controllerDeleteComment = require('./controllers/controller.deleteComment.js')
const verifySignup = require('./middlewares/verifySignup');
const verifyLogin = require('./middlewares/verifyLogin');
const app = express();
require('dotenv').config();
app.use(cookieParser());
const uploader = require("./middlewares/multer");
const cloudinary = require("./middlewares/cloudinary");
const cloudinary_upload = require('./middlewares/upload_cloudinary')
const http = require('http')
const axios = require("axios")
// use morgan to log request
// app.use(morgan('dev'));
// morgan.token('user-type', function(req, res) {
//     return req.headers['user-type']
// })
// console.log(http.METHODS, http.STATUS_CODES);

app.set('trust proxy', 'loopback, linklocal, uniquelocal', '162.158.162.0');
// app.set('trust proxy', (ip) => {
//     if (ip === '162.158.162.145' || ip === '162.158.162.7' || ip === '162.158.163.77' || ip === '162.158.163.62') return true // trusted IPs
//   });
app.use((req, res, next) => {
    console.log(req.ip);
    next();
})
app.use(morgan((tokens, req, res) => {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms'
    ].join(' ')
}));
// console.log(os.cpus());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended : true}));
// connect to mongodb
const dbURI = process.env.DB_URI;
mongoose.connect(dbURI, {useNewUrlParser : true, useUnifiedTopology : true})
    .then((result) => console.log("Connected to DB"))
    .catch((err) => console.log("err: ", err))

// Cloudinary upload
app.post('/blog', uploader.array("file"), authen, cloudinary_upload, controllerAddpost);

app.post('/like/:postid', authen, controllerLikePost);
app.post('/userlike', authen, controllerUserLike)
app.post('/comment/:postId', authen, controllerComment);
app.delete('/comment/:cmtId', authen, controllerDeleteComment);
app.get('/user', async (req, res) => {
    let users = await User.find().sort({createdAt: 1});
    res.send(users);
})
// get all the blogs from db
app.get('/blog', controllerGetallpost);
app.delete('/blog/:id', authen, controllerDeletePost);
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
app.get("/logout", (req, res) => {
    // clear the cookie
    const _id = req.cookies.uid;
    User.findOneAndUpdate({_id: _id}, {"token": undefined})
    .then(result => console.log(result))
    .catch(err => console.log(err));
    res.clearCookie("token");
    res.clearCookie("uid");
    // redirect to login
    res.send("Log out successful");
  });
// listening to port: 3002
app.listen(process.env.PORT, () => {
    console.log(`Listening on port: ${process.env.PORT}`);
    console.log(`Worker pid = ${process.pid}`); 
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



app.get('/about', async (req, res) => {
    res.sendFile('./publics/about.html', {root: __dirname});
})
app.get('/testfile', async (req, res) => {
    const path = "E:/Music/Đặt - 4H Người Khóc Cùng Anh - Hạnh Ke.mp3";
    const stat = fs.statSync(path).size;
    let start = 0, end = 5000000-1, chunk = 5000000-1;
    console.log(req.headers.range);
    if(req.headers.range) {
    start = Number(req.headers.range?.split('=')[1].split('-')[0]);
    end = Number(req.headers.range?.split('=')[1].split('-')[1])||(start+chunk)<(stat-1)?(start+chunk):stat-1;
    } else {
        end = stat -1;
    }
    
    // start = 0; end = stat-1;
    console.log(start, '-', end);
    console.log(stat, ' bytes');
    res.setHeader('Content-Disposition', 'inline; filename="Dat 4h nguoi khoc cung anh.mp3"');
    res.setHeader('Content-Length', end-start+1);
    // res.setHeader('Content-Length', stat);

    
    // const head = {
    //     'Content-Range': `bytes ${start}-${end}/${fileSize}`,
    //     'Accept-Ranges': 'bytes',
    //     'Content-Length': chunksize,
    //     'Content-Type': 'video/mp4',
    //     }
         
    //     res.writeHead(206, head)
    res.setHeader('Content-Range', `bytes `+ start +'-'+end+'/'+stat);
    res.status(206);
    if(end==stat-1) res.status(200);
    fs.createReadStream(path, {start: start, end: end}).pipe(res).on('err', () => console.log(err));
})

app.get('/testfile2', async (req, res) => {
    
    // const url ='https://github.com/chromium/chromium/blob/master/media/test/data/bear-640x360-a_frag.mp4';
    // const url = "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_5MB.mp4";
    const url = "https://res.cloudinary.com/dwvcdfn26/video/upload/v1694245678/client_and_server_proj/Nonstop_-_Em_N%C3%AAn_D%E1%BB%ABng_l%E1%BA%A1i_DJ_H%C6%B0ng_Taboo_-_Remix_txxnnl.mp3";
    // const url = "http://212.183.159.230/20MB.zip"
        let start = 0, end = 5000000-1, chunk = 5000000-1;
        console.log(req.headers.range);
        if(req.headers.range) {
        start = Number(req.headers.range?.split('=')[1].split('-')[0]);
        end = Number(req.headers.range?.split('=')[1].split('-')[1])||(start+chunk);
        }
        end = 97704644;
        axios({
            url: url,
            method: "get",
            responseType: 'stream',
            // headers: {'Content-Range': `bytes=`+ start +'-'+end},
        })
		.then(response => {
        
            // console.log(response);

            console.log(response.data.rawHeaders);
            console.log(response.status);
            console.log(response.headers);
            console.log(response.config);
            console.log(Object.keys(response));
            // console.log(response.data.responseUrl.split('/').slice(-1)[0]);
            // res.send(response.data.responseUrl);
            res.setHeader('Content-Length', response.data.rawHeaders[response.data.rawHeaders.indexOf('Content-Length')+1]);
            res.setHeader('Content-Disposition', `inline; filename=${response.data.responseUrl.split('/').slice(-1)[0]}`);
            res.setHeader('content-type', 'audio/mpeg')
            // res.setHeader('Content-Range', `bytes `+ start +'-'+end+'/'+response.data.rawHeaders[response.data.rawHeaders.indexOf('Content-Length')+1]);
            res.status(200);
			response.data.pipe(res);
        })
		.catch((err) => {
			res.status(500).send({ message: err });
		});


})
app.get('/testfile3', async (req, res) => {
    // res.send('<p>About Page</p>')
    try {
    console.log(__dirname);
    // fs.createReadStream("E:/Videos/Films/Davinci s Demon/Da.Vincis.Demons.S02E09.720p.mp4").pipe(fs.createWriteStream('./publics/assets/Davinci Demon.mp4'));
    // await cloudinary.uploader.upload("./publics/assets/giphy.gif", {resource_type: "auto", folder: "client_and_server_proj"})
    // await cloudinary.uploader.upload_large("E:/Videos/Films/Davinci s Demon/Da.Vincis.Demons.S02E09.720p.mp4", 
    // {resource_type: "auto", chunk_size: 6000000, folder: "client_and_server_proj"}, (err, result) => {
    //     if(result) console.log(result);
    //     if(err) console.log(err);
    // })
        // res.setHeader('Location','https://www.udemy.com/course/complete-react-native-mobile-development-zero-to-mastery-with-hooks/?fbclid=%5B%27IwAR071y3JRXUbZH03TOtw4jpREtx2OoVnxKRT_WCkG1z70EBzU7e_Rr17PZk%27%5D');
        // res.status(302).send();
        // res.redirect(200, 'https://www.udemy.com/course/complete-react-native-mobile-development-zero-to-mastery-with-hooks/?fbclid=%5B%27IwAR071y3JRXUbZH03TOtw4jpREtx2OoVnxKRT_WCkG1z70EBzU7e_Rr17PZk%27%5D');
        res.setHeader('Content-Disposition', 'attachment; filename="giphy.gif"');
        res.sendFile("./publics/assets/giphy.gif", {root: __dirname});
    
    
    //     res.download("./publics/assets/giphy.gif",'giphy.gif', (err) => {
    //     console.log(err);
    // })
}
    catch(err) {console.log(err)}
    // 
}
);
// redirect
app.get('/about-us', (req, res) => {
    res.redirect('https://www.google.com');
    res.redirect('/about');
});
app.get('/about-us2', (req, res) => {
    res.writeHead(302, {'Location' : '/about'});
    res.send();
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


