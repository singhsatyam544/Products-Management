const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    
        title: {type:String, required:true, unique:true,trim:true,lowercase:true},
        description: {type:String, required:true,trim:true},
        price: {type:Number, required:true, trim:true},
        currencyId: {type:String,required:true ,trim:true,uppercase:true},
        currencyFormat: {type:String, required:true, trim:true},
        isFreeShipping: {type:Boolean, default: false,lowercase:true},
        productImage: {type:String, require:true,trim:true},  // s3 link
        style: {type:String,trim:true},
        availableSizes: {type:[String], required:true,trim:true, enum:["S", "XS","M","X", "L","XXL", "XL"],uppercase:true},
        installments: {type:Number,trim:true},
        deletedAt: {type:Date,default:null}, 
        isDeleted: {type:Boolean, default: false},
      
      
},{ timestamps: true })


module.exports = mongoose.model("Product",productSchema)//products