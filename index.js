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
// => Index
// products => category
// /products/:id => single-product
app.use('/', require('./routes/indexRouter'));
app.use('/products', require('./routes/productRouter'));
//app.use('/cart', require('./routes/cartRouter'));
//app.use('/comments', require('./routes/commentRouter'));
//app.use('/reviews', require('./routes/reviewRouter'));
//app.use('/users', require('./routes/userRouter'));



app.get('/sync', (req,res)=>{
    let models = require('./models');
    models.sequelize.sync()
    .then(()=>{
        res.send('database sync completed!')
         });
 });

app.get('/:page', (req, res) => {
    let banners = {
        blog:  'Our Blog',
        category: 'Shop Category',
        cart: 'Shopping Cart',
        contact: 'Contact Us', 
        login: 'Login / Register',
        register: 'Register',
        product: 'Single-Product',
        tracking: 'Tracking-order',
        checkout: 'Product Checkout'

    };
    let page = req.params.page;
    res.render(page, {banner: banners[page]});
});

//set Server Port & Start Server
app.set('port', process.env.PORT || 5000);
app.listen(app.get('port'), () => {
    console.log(`Server is running at post ${app.get('port')}`);
});
