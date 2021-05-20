let express = require('express');
let app = express();

//statically
app.use(express.static(__dirname + '/public'));

// View Engine
let expressHbs = require('express-handlebars');
let helper=require('./controllers/helper');
let paginateHelper=require('express-handlebars-paginate');
let hbs = expressHbs.create({
	extname			: 'hbs',
	defaultLayout	: 'layout', 
	layoutsDir		: __dirname + '/views/layouts/',
	partialsDir		: __dirname + '/views/partials/',
    helpers: {
        createStarList: helper.createStarList,
        createStars: helper.createStars,
        createPagination: paginateHelper.createPagination
    }
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

//body parser
let bodyParser= require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//use cookie parser
let cookieParser=require('cookie-parser');
app.use(cookieParser());

//use session
let session=require('express-session');
app.use(session({
    cookie: {httpOnly: true, maxAge: 30 * 24 * 60* 60 * 1000},
    secret: "S3cret",
    resave: false,
    saveUninitilized: false
}));

//use cart controller
let Cart= require('./controllers/cartController');
app.use((req, res, next)=>{
    var cart=new Cart(req.session.cart ? req.session.cart: {});
    req.session.cart=cart;
    res.locals.totalQuantity=cart.totalQuantity;
    next();
});
//cac routes

app.use('/', require('./routes/indexRouter'));
app.use('/products', require('./routes/productRouter'));
app.use('/cart', require('./routes/cartRouter'));

app.get('/sync', function(req, res) {
    let models = require('./models');
    models.sequelize.sync()
    .then(() =>{
        res.send('database sync completed!');
    });
});

app.get('/:page', function(req, res) {
    let banners = {
        blog :'Our Blog',
        category :'Shop Category',
        cart: 'Shopping Cart',
        singleproduct: 'Shop Single',
        checkout: 'Product Checkout',
        confirmation: 'Order Confirmation',
        tracking_order: 'Order Tracking',
        single_blog: 'Blog Details',
        register: 'Register',
        login: 'Login / Register',
        contact: 'Contact Us',
        confirmation: 'Order Confirmation'
    };
    let page = req.params.page;
    //console.log(banners[page]);
    res.render(page,{banner: banners[page]});
})

//start server
app.set('port',process.env.PORT || 5000)
app.listen(app.get('port'),()=>{
    console.log('listening on port '+app.get('port'));
});