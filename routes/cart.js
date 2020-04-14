var express= require("express");
var router= express.Router();
var food=require("../models/food");
var user= require("../models/user");
var cart= require("../models/cart");
var address= require("../models/address");
var order= require("../models/order");
var middleware= require("../middleware");
var MongoClient = require('mongodb').MongoClient;
var url ="mongodb+srv://osamaiqbal786:osama786@cluster0-2683c.mongodb.net/food_express?retryWrites=true&w=majority";


router.get("/:id/cart",middleware.isloggedin ,function(req, res) {
    // res.send("get route")
    user.findById(req.user._id).populate("cart").exec(function(err,usercart){
        if(err){
            console.log(err);
        }else{
            
            res.render("cart/cart",{user:usercart});
        }
    });
    
});
router.post("/foods/:id/new/cart",middleware.isloggedin,function(req, res){
   user.findById(req.user._id,function(err, user) {
      if(err){
          console.log(err);
      } else{
         
          cart.create(req.body.peice,function(err,cart){
             if(err){
                 console.log(err);
             } else{
                 food.findById(req.params.id,function(err, food) {
                     if(err){
                         console.log(err);
                     }else{
                            cart.obj.id= req.params.id;
                            cart.obj.name=food.name;
                            cart.obj.price=food.price;
                            cart.obj.image=food.image;
                             //  cart.author.username= req.user.username;
                            cart.save();
                            user.cart.push(cart);
                            user.save();
                             req.flash("success","Added to cart successfully");
                            res.redirect("/"+req.user._id+"/cart");
                     }
                     
                 });
                 
             }
          });
      }
   });
});


router.delete("/:id/cart/:cart_id",middleware.isloggedin, function(req, res){
   cart.findByIdAndRemove(req.params.cart_id, function(err){
      if(err){
          res.redirect( "/"+req.params.id+"/cart");
      } else{
        //   req.flash("success","comment deleted successfully");
         res.redirect("/"+ req.params.id+"/cart"); 
      }
   }); 
});

router.get("/:id/cart/checkout/address",middleware.isloggedin ,function(req, res) {
     user.findById(req.user._id).populate("address").populate("cart").exec(function(err,useraddress){
         if(err){
             console.log(err);
         }else{
           res.render("cart/address",{user:useraddress})   
         }
     })
   
});


router.get("/:id/cart/checkout/newaddress",middleware.isloggedin ,function(req, res) {
     
           res.render("cart/newaddress")   
});

router.post("/:id/cart/checkout/newaddress",middleware.isloggedin,function(req, res){
   user.findById(req.params.id).populate("cart").exec(function(err, user) {
      if(err){
          console.log(err);
      } else{
         
          address.create(req.body.address,function(err,address){
             if(err){
                 console.log(err);
             } else{
                 user.address.push(address);
                 user.save();
                 res.redirect("/"+req.params.id+"/cart/checkout/address")
               
                 
             }
          });
      }
   });
});


router.get("/:id/order",middleware.isloggedin ,function(req, res) {
     user.findById(req.user._id).populate("order").exec(function(err,userorder){
         if(err){
             console.log(err);
         }else{
             userorder.cart.forEach(function(cart1){
                cart.findByIdAndRemove(cart1, function(err){
                if(err){
                    console.log(err)
                     }
                     }); 
                 });         
                var j=userorder.cart.length;
                userorder.cart.splice(0,j);
                userorder.save();
            
            //  res.send("order")
                res.render("cart/order",{user:userorder})   
         }
     })
   
});

router.post("/:id/cart/checkout/order",middleware.isloggedin,function(req, res){
   user.findById(req.params.id).populate("cart").exec(function(err, user) {
      if(err){
          console.log(err);
      } else{
        
             
          order.create(req.body.address,function(err,order){
             if(err){
                 console.log(err);
             } else{
                 user.cart.forEach(function(cart){
                //  order.obj.id=cart.obj.id;
                 order.name.push(cart.obj.name);
                 order.price.push(cart.obj.price);
                 order.peice.push(cart.peice);
                 order.image.push(cart.obj.image);
                 
                  });
                  order.save();
                  user.order.push(order);
                  user.save(function(err){
                     if(err){
                         console.log(err)
                     }
                 });
                 
             }
              
          });
       
        

        // res.redirect("/"+req.params.id+"/order")  
      }
     
   });
   
   res.redirect("/"+req.params.id+"/order")
});


router.get("/:id/adminorder",middleware.isauthorised,function(req, res) {
    
    MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("food_express");
  dbo.collection("orders").find({}).toArray(function(err, result) {
    if (err) throw err;
    res.render("cart/adminorder",{result:result});
    db.close();
  });
});
 
    
   
});



module.exports= router;