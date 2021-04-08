let express = require("express");
let router = express.Router();
let userController = require('../controllers/userController');
router.post('/',userController.isLoggedIn, (req,res,next)=>
{
    let review = {
        userId : req.session.user.id,
        productId: req.body.productId,
        message: req.body.message,
        rating: req.body.rating
    };
    var reviewController = require('../controllers/reviewController');
    reviewController.Add(review)
    .then(() => {
       res.redirect('/products/' + review.productId);
    }).catch((error) => {
        next(error);
    });
});

module.exports = router;