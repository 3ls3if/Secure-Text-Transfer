let mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    findOrCreate = require("mongoose-findorcreate");
    passportLocalMongoose = require("passport-local-mongoose");


const userMessageSchema = new Schema({
   
    receiver_username: String,
    receiver_publicKey: String,
    sender_uid: String,
    sender_username: String,
    sender_gid: String,
    sender_email: String,
    sender_publicKey: String,
    enc_message: String,
    message_hash: String,
    sign: String,
    hash: String,
    message_flag: String,
    sent_message_flag: String

},
{
    timestamps: true
}
);


userMessageSchema.plugin(findOrCreate);

module.exports = mongoose.model("UserMessage", userMessageSchema);