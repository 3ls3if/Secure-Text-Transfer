
let mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    findOrCreate = require("mongoose-findorcreate");

 

const keySchema = new Schema({
    username: String,
    userId: String,
    gId: String,
    email: String,
    publicKey: String,
    privateKey: String

},

{
    timestamps: true
}

);


keySchema.plugin(findOrCreate);

module.exports = mongoose.model("PubKey", keySchema);