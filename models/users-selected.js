let mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    findOrCreate = require("mongoose-findorcreate");
    passportLocalMongoose = require("passport-local-mongoose");


const selectedUserSchema = new Schema({
    username: String,
    publicKey: String,
    sender_email: String,
    sender_username: String,
    sender_gid: String,
    sender_uid: String
},
{
    timestamps: true
}
);


selectedUserSchema.plugin(findOrCreate);

module.exports = mongoose.model("SelectedUser", selectedUserSchema);