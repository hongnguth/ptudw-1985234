let express = require("express");
let router = express.Router();
let controller = require('../controllers/userController');
router.post('/register', (req,res, next) =>{
    let user ={
        fullname: req.body.fullName,
        username: req.body.userName,
        password: req.body.password
    };
    let confirmPassword = req.body.confirmPassword;
    let keepLoggedIn = (req.body.keepLoggedIn != undefined);

    // Kiem tra confirm password
    if(user.password != confirmPassword)
    {
        return res.render('register', {
            message: 'Confirm password does not match!',
            type: 'alert-danger'
        });
    }
    // Kiem tra username chua ton tai
    controller.getUserByEmail(user.username)
    .then((result) => {
        if(result)
        {
            return res.render('register', {
                message: `Email ${user.username} exits! Please choose another email!`,
                type: 'alert-danger'
            });
        }   
        // Tao tk dang ky
        return controller.createUser(user)
        .then((result) => {
            if(keepLoggedIn)
            {
                req.session.user = result;
                return res.redirect('/');
            }
            else
            {
                return res.render('login',{
                    message: 'You have registered, now please login!',
                    type: 'alert-primary'
                });
            }
        });
    }).catch((error) => {
        next(error);
    });
});
router.post('/login', (req,res,next)=>{
    let email = req.body.userName;
    let password = req.body.password;
    let keepLoggedIn = req.body.keepLoggedIn;
    controller.getUserByEmail(email)
    .then((user) => {
        if(user){
            if(controller.comparePassword(password, user.password))
            {
                req.session.user = user;
                req.session.cookie.maxAge = keepLoggedIn ? 30*24*60*60*1000 : null;
                if(req.session.returnURL)
                {
                    res.redirect(req.session.returnURL);
                }
                else{
                    res.redirect('/')
                }
            }
            else{
                res.render('login', {
                    message: 'Incorrect Password!',
                    type : 'alert-danger'
                })
            }
        }
        else{
            return res.render('login', {
                message: 'Email does not exits!',
                type : 'alert-danger'
            })
        }
    }).catch((error) => {
        next(error);
    });
});

router.get('/login', (req,res)=>{
    req.session.returnURL = req.query.returnURL;
    res.render('login', {banner: 'login'});
});

router.get('/logout', (req,res, next)=>{
    req.session.destroy(error =>{
        if(error)
        {
            return next(error)
        }
        return res.redirect('/users/login');
    });
    res.render('login');
});

router.get('/register', (req,res)=>{
    res.render('register', {banner: 'register'});
});
module.exports = router;