let express = require("express");
let app = express();

// Set public static folder
app.use(express.static(__dirname + "/public"));

// Use View Engine
let expressHbs = require("express-handlebars");
let hbs = expressHbs.create({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: __dirname + "/views/layouts/",
    partialsDir: __dirname + "/views/partials",
});
app.engine('hbs', hbs.engine);
app.set('view engine','hbs');

// Define your router here
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/:page', (req, res) => {
    let banners = {
        blog:  'Our Blog',
        category: 'Shop Category',
        cart: 'Shopping Cart',
        contact: 'Contact Us', 
        login: 'Login / Register',
        register: 'Register'
    };
    let page = req.params.page;
    res.render(page, {banner: banners[page]});
});

//set Server Port & Start Server
app.set('port', process.env.PORT || 5000);
app.listen(app.get('port'), () => {
    console.log(`Server is running at post ${app.get('port')}`);
});


//let helper = require("./controllers/helper");
//let paginateHelper = require('express-handlebars-paginate'); 
// helpers: {
//     CreateStarList: helper.CreateStarList,
//     CreateStars : helper.CreateStars,
//     createPagination: paginateHelper.createPagination
// }
// // body parser
// let bodyParser = require('body-parser');
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended:false}));

// // use cookie
// let cookieParser = require('cookie-parser');
// app.use(cookieParser());

// // use session
// let session = require('express-session');
// app.use(session({
//     cookie: {httpOnly:true, maxAge: null},
//     secret: 'S3cret',
//     resave: false,
//     saveUninitialized: false

// }));

// // Use Cart controller
// let Cart = require('./controllers/cartController');
// app.use((req,res, next) =>{
//     var cart = new Cart(req.session.cart ? req.session.cart : {});
//     req.session.cart = cart;
//     res.locals.totalQuantity = cart.totalQuantity;
//     res.locals.fullName = req.session.user ? req.session.user.fullname : "";
//     res.locals.isLoggedIn = req.session.user ? true : false;
//     next();
// })
// // Define your router here
// // => Index
// // products => category
// // /products/:id => single-product
// app.use('/', require('./routes/indexRouter'));
// app.use('/products', require('./routes/productRouter'));
// app.use('/cart', require('./routes/cartRouter'));
// app.use('/comments', require('./routes/commentRouter'));
// app.use('/reviews', require('./routes/reviewRouter'));
// app.use('/users', require('./routes/userRouter'));


// // Using models Create init database
// app.get('/sync', (req,res)=>
// {
//     let models = require('./models');
//     models.sequelize.sync().then(()=>{
//         res.send('database sync completed!')
//     });
// });

// app.get('/:page', (req, res) => 
// {
//     let banners = {
//         blog: 'Our Blog',
//         category: 'Shop Category',
//         cart: 'Cart',
//         checkout: 'Product Checkout',
//         confirmation: 'Order Confirmation',
//         contact: 'Our Contact',
//         login: 'Login',
//         register: 'Register Account',
//         'single-blog': 'Blog Details',
//         'single-product': 'Product Details',
//         'tracking-order': 'Tracking Order',
//     };
//     let page = req.params.page;
//     res.render(page, {banner: banners[page]});
// });


// // Set server Port & start server
// app.set('port', process.env.PORT || 500) //  Truong hop chay tren server se tu phat sinh port, neu chay local se chay port 5000
// app.listen(app.get('port'), () => {
//     console.log(`Server is runing at port ${app.get('port')}`)
// });