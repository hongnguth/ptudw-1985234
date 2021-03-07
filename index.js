let express = require("express");
let app = express();

// Set public static folder
app.use(express.static(__dirname + "/public"));

// Use View Engine
let expressHbs = require("express-handlebars");
let helper = require("./controllers/helper");
//let paginateHelper = require('express-handlebars-paginate'); 
let hbs = expressHbs.create({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: __dirname + "/views/layouts/",
    partialsDir: __dirname + "/views/partials",
    helpers: {
        createStarList: helper.createStarList,
        createStars : helper.createStars,
        //createPagination: paginateHelper.createPagination
    }
});
app.engine('hbs', hbs.engine);
app.set('view engine','hbs');

// Define your router here
// => Index
// products => category
// /products/:id => single-product

app.use('/', require('./routes/indexRouter'));
app.use('/products', require('./routes/productRouter'));

app.get('/sync', (req,res)=>{
    let models = require('./models');
    models.sequelize.sync()
    .then(()=>{
        res.send('database sync completed!')
         });
 });

app.get('/:page', (req, res) => {
    let banners = {
        'blog': 'Our Blog',
        'category': 'Shop Category',
        'cart': 'Shopping Cart',
        'checkout': 'Checkout',
        'confirmation': 'Order Confirmation',
        'contact': 'Contact Us',
        'login': 'Login/Register',
        'register': 'Register',
        'single-blog': 'Blog Details',
        'single-product': 'Shop Single',
        'tracking-order': 'Order Tracking'
    }
    let page = req.params.page;
    res.render(page, {banner: banners[page]});
});

//set Server Port & Start Server
app.set('port', process.env.PORT || 5000);
app.listen(app.get('port'), () => {
    console.log(`Server is running at post ${app.get('port')}`);
});
