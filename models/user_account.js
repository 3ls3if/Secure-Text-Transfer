let mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    findOrCreate = require("mongoose-findorcreate");
    passportLocalMongoose = require("passport-local-mongoose");


const userSchema = new Schema({
    username: String, //email
    password: String,
    googleId: String
},
{
    timestamps: true
}
);


userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

module.exports = mongoose.model("User", userSchema);