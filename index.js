let express = require('express');
let app = express();

//statically
app.use(express.static(__dirname + '/public'));

// View Engine
let expressHbs = require('express-handlebars');
let helper=require('./controllers/helper');
let hbs = expressHbs.create({
	extname			: 'hbs',
	defaultLayout	: 'layout', 
	layoutsDir		: __dirname + '/views/layouts/',
	partialsDir		: __dirname + '/views/partials/',
    helpers: {
        createStarList: helper.createStarList,
        createStars: helper.createStars
    }
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

//cac routes

app.use('/', require('./routes/indexRouter'));
app.use('/products', require('./routes/productRouter'));

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