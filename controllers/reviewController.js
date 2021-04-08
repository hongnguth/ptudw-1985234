let controller = {};
let models = require('../models');
let Review = models.Review;
controller.Add = (review) =>
{
   return new Promise((resolve, reject)=>{
       Review
       .findOne({
           where:{
               userId: review.userId,
               productId: review.productId
           }
       })
       .then((data) => {
           if(data)
           {
               return Review.update(review,{
                    where:{
                        userId: review.userId,
                        productId: review.productId
                    }
               })
           }
           else
           {
               return Review.create(review);
           }
       })
       .then(() => {
           models.Product
           .findOne({
               where: {id : review.productId},
               include: [{model: models.Review}]
           })
           .then(product=>{
                let overallReview = 0;
                for (let index = 0; index < product.Reviews.length; index++) {
                    overallReview += product.Reviews[index].rating;
                }
                overallReview = overallReview / product.reviewCount;
                
                return models.Product
                .update({
                    overallReview : overallReview,
                    reviewCount : product.Reviews.length
                    },
                    {
                        where:{id : product.id}
                })
           });
        })
        .then(data => resolve(data))
        .catch((error) => {
           reject(new Error(error));
       });

   }) 
}

controller.getUserReviewProduct = (userId, productId)=>{
    return Review.findOne({
        where:{
            userId,
            productId
        }
    });
}
module.exports = controller;