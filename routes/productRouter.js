let express = require('express');
let router = express.Router();

router.get('/',(req, res,next) => {
    let categoryController = require('../controllers/categoryController');
    categoryController
        .getAll()
        .then(data => {
            //console.log(data);
            res.locals.categories = data;
            let brandController = require('../controllers/brandController');
            return brandController.getAll();
        })
        .then(data => {
            res.locals.brands = data;
            let colorcontroller = require('../controllers/colorController');
            return colorcontroller.getAll();
            
        })
        .then(data => {
            res.locals.products = data;
            let productcontroller = require('../controllers/productController');
            return productcontroller.getAll();
            
        })
        .then(data => {
            res.locals.products = data;
            //console.log(data);
            res.render('category');
        })
        .catch(error=> next(error));
    
})

router.get('/:id',(req, res) => {
    res.render('singleproduct');
})

module.exports = router;