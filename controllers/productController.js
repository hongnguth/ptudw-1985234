let controller = {};
let models = require('../models');
let product = models.Product;
let Sequelize = require('sequelize');
let Op = Sequelize.Op;

controller.getTrendingProducts = () =>
{
    return new Promise((resolve , reject)=>
    {
        product
        .findAll(
            {
                order:[
                    ['overallReview', 'DESC']
                ],
                limit: 8,
                include: [{model: models.Category}],
                attributes: ['id', 'name','imagepath','price'] 
            }
        )
        .then(data => resolve(data))   
        .catch(error => reject(new Error(error)));
        
    });
};
controller.getAll = (query) =>
{
    return new Promise((resolve , reject)=>
    {
        let options = {
            include: [{model: models.Category}],
            attributes: ['id', 'name','imagepath','price'],
            where:{
                price: {
                    [Op.gte]: query.min,
                    [Op.lte]: query.max
                }
            }
        };
        if (query.category > 0) {
            options.where.categoryId = query.category;
        }
        if (query.brand > 0) {
            options.where.brandId = query.brand;
        }
        if (query.color > 0) {
            options.include.push({
                model: models.ProductColor,
                attributes: [],
                where: { colorId: query.color}
            });
        }
        product
            .findAll(options)
             .then(data => resolve(data))
             .catch(error => reject(new Error(error)));
    });
};

controller.getById = (id) =>
{
    return new Promise((resole, reject) =>
    {
        let productResult;
        product.findOne(
            {
                include: [{model: models.Category}],
                where: {id : id}
            }
        )
        .then(result =>{
            productResult = result;
            return models.ProductSpecification.findAll(
                {
                    where : {productId : id},
                    include: [{model: models.Specification}]
                }
            );
        })
        .then(prodSpecification =>
        {
            productResult.ProductSpecifications = prodSpecification;
           return models.Comment.findAll(
               {
                   where : {productId : id, parentCommentId : null},
                   include: [
                        {model: models.User},
                        {
                            model: models.Comment,
                            as: 'SubComments',
                            include: [{model: models.User}]   
                        }
                    ]
               }
           )
        })
        .then( comments =>
        {
            productResult.Comments = comments;
            return models.Review.findAll({
                where : {productId : id},
                include: [{model: models.User}]
            })
        })
        .then( reviews =>
            {
                productResult.Reviews = reviews;
                let stars = [];
                for(let i = 1; i <=5 ; i++)
                {
                    stars.push(reviews.filter(item => item.rating == i).length);
                }
                productResult.Stars = stars;
                resole(productResult);
            })
        .catch(error => reject(new Error(error)));
    });
}
controller.getTopProducts = () =>
{
    return new Promise((resole , reject)=>
    {
        product.findAll(
            {
                order:[
                    ['overallReview', 'DESC']
                ],
                limit: 8,
                include: [{model: models.Category}],
                where: [{ model: models.Review, where: {productId: Sequelize.col('product.id')}, order: [['rating','DESC']]}],
                attributes: ['id', 'name','imagepath','price'] 
            }
        )
        .then((data) => {
            resole(data);   
        })
        .catch(error => reject(new Error(error)));
    });
};


module.exports = controller;