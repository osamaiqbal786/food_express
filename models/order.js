var mongoose=require("mongoose");

var orderschema= new mongoose.Schema({
   
        address:[{}],
        payment:[{}],
        name:[{}],
        price:[{}],
        peice:[{}],
        image:[{}]
    
});


module.exports=mongoose.model("order", orderschema);
