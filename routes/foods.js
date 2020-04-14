var express= require("express");
var router= express.Router();
var food=require("../models/food");
var middleware= require("../middleware");


router.get("/",function(req,res){
    res.redirect("/foods");
});


router.get("/foods",function(req,res){
    
     var noMatch = null;
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        food.find({name:regex},function(err, food){
       if(err) {
           console.log(err);
       }else{
           if(food.length <1){
               noMatch = "No food match that query, please try again.";
                // res.render("campground/camps",{campground : campground});
           }
            res.render("food/searchedfoods",{food : food, noMatch:noMatch});
       }
    });
    
    }else{
     food.find({},function(err, food){
       if(err) {
           console.log(err);
       }else{
          res.render("food/foods",{food : food, noMatch:noMatch});
       }
    });
    }
});

router.get("/foods/nonveg",function(req,res){
     food.find({},function(err, food){
       if(err) {
           console.log(err);
       }else{
          res.render("food/foodsnonveg",{food : food});
       }
    }); 
});

router.get("/foods/new",middleware.isauthorised,function(req, res) {
   res.render("food/newfood"); 
});

router.post("/foods",function(req, res){
    var name=req.body.name;
    var price=req.body.price;
    var type=req.body.type;
    var image=req.body.image;
    var desc=req.body.description;
    var newfood={name: name, price:price, type:type, image: image, description: desc};
    food.create(newfood, function(err,newfoods){
       if(err){
           console.log(err);
       } else{
          req.flash("success","food created successfully");
           res.redirect("/foods");
       }
    });
});
    
router.get("/foods/:id",function(req, res) {
    food.findById(req.params.id).populate("comment").exec(function(err,findfood){
        if(err){
            console.log(err);
        }else{
            
            res.render("food/moreinfo",{food:findfood});
        }
    });
    
});


router.get("/foods/:id/edit",middleware.isauthorised, function(req, res) {
    food.findById(req.params.id, function(err, foundfood){
       if(err){
           console.log(err);
       }else{
           res.render("food/editfood", {food:foundfood});
       } 
    });
    
});

router.put("/foods/:id",middleware.isauthorised,function(req, res){
    food.findByIdAndUpdate(req.params.id,req.body.food, function(err, updatedfood){
      if(err){
       res.redirect("/foods")
        }else{
            req.flash("success","food edited successfully");
            res.redirect("/foods/"+ req.params.id)
        }  
    });
   
});

router.delete("/foods/:id",middleware.isauthorised, function(req, res){
   food.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/foods");
      } else{
          req.flash("success","food deleted successfully");
         res.redirect("/foods"); 
      }
   }); 
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


module.exports= router;