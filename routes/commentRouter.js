let express = require("express");
const comment = require("../models/comment");
let router = express.Router();
let userController = require('../controllers/userController');
router.post('/', userController.isLoggedIn ,(req,res,next)=>
{
    let comment = {
        userId : req.session.user.id,
        productId: req.body.productId,
        message: req.body.message
    };
    if(!isNaN(req.body.parentCommentId) && req.body.parentCommentId != "")
    {
        comment.parentCommentId = req.body.parentCommentId;
    }
    var commentController = require('../controllers/commentController');
    commentController.Add(comment)
    .then((comment) => {
       res.redirect('/products/' + comment.productId);
    }).catch((error) => {
        next(error);
    });
});

module.exports = router;