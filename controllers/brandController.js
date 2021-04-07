let controller = {};
let models = require('../models');
const { options } = require('../routes/indexRouter');
let Brand = models.Brand;
let Sequelize = require('sequelize');
let Op = Sequelize.Op;
controller.getAll = (query) => {
    return new Promise((resolve, reject) => {    
        let options = {
            attributes: ['id', 'name', 'imagepath'],
            include : [{ 
                model: models.Product,
                attributes: ['id'],
                where: {
                    price: {
                        [Op.gte]: query.min,
                        [Op.lte]: query.max
                    }
                }
            }]
        };
        if (query.category > 0) {
            options.include[0].where.categoryId =
            query.category;
        }
        if(query.search != '')
        {
            options.include[0].where.name = {
                [Op.iLike] : `%${query.search}%`
            };
        }
        if(query.color > 0){
            options.include[0].include = [{
                model: models.ProductColor,
                attributes: [],
                where:{ colorId : query.color}
            }];
        }
        Brand
            .findAll(options)  
            .then(data => resolve(data))
           .catch(error => reject(new Error(error)));
    });
};
       // let options = {
                //attributes: ['id', 'name', 'imagepath', 'summary'],
                //include : [{
                    //model: models.Product,
                    //attributes: ['id'],
                   // where: {
                        //price: {
                          //  [Op.gte]: query.min,
                           // [Op.lte]: query.max
                       // }
                    //}
                //}],
        //};
    //     if(query.search != '')
    //     {
    //         options.include[0].where.name = {
    //             [Op.iLike] : `%${query.search}`
    //         };
    //     }
    //     if(query.category > 0)
    //     {
    //         options.include[0].where.categoryId = query.category
    //     }
    //     if(query.color > 0)
    //     {
    //             options.include[0].include = [{
    //                 model: models.ProductColor,
    //                 attributes: [],
    //                 where:{ colorId : query.color}
    //             }];
    //     }
    //     brand.findAll(options)
    //     .then((result) => {
    //         resolve(result);
    //     }).catch((err) => {
    //         reject(new Error(err));
    //     });
    // });
    

module.exports = controller;