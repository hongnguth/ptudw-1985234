let controller = {};
let models = require('../models');
let Comment = models.Comment;
controller.Add = (comment) =>
{
   return new Promise((resolve, reject)=>{
       Comment.create(comment)
       .then((result) => {
          resolve(result); 
       }).catch((error) => {
           reject(new Error(error));
       });

   }) 
}

module.exports = controller;