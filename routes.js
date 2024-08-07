
const express = require('express');
const passport = require("passport");
const session = require("express-session");
const passportLocalMongoose = require("passport-local-mongoose");
const app = require('./app');
const User = require("./models/user_account");
const PubKey = require("./models/public_keys");
var SelectedUser = require("./models/users-selected");
var UserMessage = require("./models/users_messages");
const router = require("express").Router();
const crypt = require("rsa-aes");
const { Schema } = require('mongoose');
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');
const GoogleStrategy = require("passport-google-oauth20").Strategy;







// delete a sent message

router.post("/delete-sent-messages", function (req, res) {


    let msg = req.body.msgInfo;

    // console.log(msg);

    PubKey.find({}).where("userId").equals(req.user._id).sort({ "createdAt": -1 }).limit(1).exec(function (err, data1) {

        UserMessage.find({ "sent_message_flag": { $eq: "no" } }).where("sender_username").equals(data1[0].username).exec(function (err, data2) {

            UserMessage.find({ "message_hash": { $eq: msg } }).where("sender_username").equals(data1[0].username).exec(function (err, data3) {

                // console.log(data3);

                UserMessage.updateOne({ message_hash: msg }, { $set: { sent_message_flag: "yes" } }).exec(function (err, data4) {

                    console.log("successfully deleted");
                    // console.log(data4);

                    if (data4) {
                        res.redirect("/message-history");
                    } else {
                        console.log("failed to delete message");
                        res.redirect("/message-history");
                    }
                });

            });


        });

    });


});





// user sent messages history

router.get("/message-history", function (req, res) {

    if (req.isAuthenticated()) {
        //getting the received messages from the database server
        // console.log(req.user);

        PubKey.find({}).where("userId").equals(req.user._id).sort({ "createdAt": -1 }).limit(1).exec(function (err, key) {

            // console.log(key[0].privateKey);
            // console.log(key[0].username);
            // console.log(key);
            try {
                UserMessage.find({ "sent_message_flag": { $eq: "no" } }).where("sender_username").equals(key[0].username).exec(function (err, data2) {


                    // UserMessage.find({ "message_flag": { $eq: "no" } }).where("receiver_username").equals(data1[0].username).exec(function (err, data3) {

                    // console.log(data2);


                    if (data2.length > 0) {

                        PubKey.find({}).where("username").equals(data2[0].receiver_username).sort({ "createdAt": -1 }).limit(1).exec(function (err, key2) {

                            // console.log(key2[0].username);


                            let array2 = [];

                            // console.log(array);


                            if (data2.length > 0) {


                                data2.forEach(records => {

                                    if (records.sent_message_flag === 'no') {

                                        try {
                                            // console.log(key);
                                            // console.log(records);
                                            array2.push(crypt.decryptRsa(key2[0].privateKey, records.enc_message));


                                        } catch (error) {
                                            console.log("error");

                                            array2.push(crypt.decryptRsa(key2[0].privateKey, records.enc_message));
                                        }
                                    }
                                    else {
                                        console.log("no messages");
                                    }

                                });

                                // console.log(array.length);
                                // console.log(array2);

                                if (array2.length > 0) {

                                    // console.log(array2);

                                    if (crypt.verify(data2[0].sender_publicKey, data2[0].message_hash, data2[0].sign, "sha1")) {
                                        res.render("sent-contents", {
                                            data2: data2, rUsername: key[0].username,

                                            decryptedMessage: array2

                                        });
                                    }
                                    else {
                                        res.render("sent-contents", { data2: 0, rUsername: "Empty", decryptedMessage: "Empty" });
                                    }
                                }
                                else {
                                    res.render("sent-contents", { data2: 0, rUsername: "Empty", decryptedMessage: "Empty" });
                                }


                            }
                            else {
                                res.render("sent-contents", { data2: 0, rUsername: "Empty", decryptedMessage: "Empty" });
                            }


                            // console.log(array);
                            // });
                        });

                    }
                    else {
                        res.render("sent-contents", { data2: 0, rUsername: "Empty", decryptedMessage: "Empty" });
                    }
                });

            } catch (err) {
                // console.log(err);
                res.redirect("/keygen");
            }
        });

    } else {
        res.redirect("/");
    }

});








// delete a received message

router.post("/delete-messages", function (req, res) {


    let msg = req.body.msgInfo;

    // console.log(msg);

    PubKey.find({}).where("userId").equals(req.user._id).sort({ "createdAt": -1 }).limit(1).exec(function (err, data1) {

        UserMessage.find({ "message_flag": { $eq: "no" } }).where("receiver_username").equals(data1[0].username).exec(function (err, data2) {

            UserMessage.find({ "message_hash": { $eq: msg } }).where("receiver_username").equals(data1[0].username).exec(function (err, data3) {

                // console.log(data3);

                UserMessage.updateOne({ message_hash: msg }, { $set: { message_flag: "yes" } }).exec(function (err, data4) {

                    console.log("successfully deleted");
                    // console.log(data4);

                    if (data4) {
                        res.redirect("/received-messages");
                    } else {
                        console.log("failed to delete message");
                        res.redirect("/received-messages");
                    }
                });

            });


        });

    });


});







// decrypt received encrypted messages

router.get("/received-messages", function (req, res) {

    if (req.isAuthenticated()) {
        //getting the received messages from the database server
        // console.log(req.user);

        PubKey.find({}).where("userId").equals(req.user._id).sort({ "createdAt": -1 }).limit(1).exec(function (err, data1) {

            // console.log(data1[0].username);
            // console.log(data1);
            try {
                UserMessage.find({ "message_flag": { $eq: "no" } }).where("receiver_username").equals(data1[0].username).exec(function (err, data2) {


                    // UserMessage.find({ "message_flag": { $eq: "no" } }).where("receiver_username").equals(data1[0].username).exec(function (err, data3) {

                    // console.log(data2);

                    let array = [];

                    // console.log(array);


                    if (data2.length > 0) {


                        data2.forEach(records => {

                            if (records.message_flag === 'no') {

                                try {
                                    // console.log(data1[0].privateKey);
                                    array.push(crypt.decryptRsa(data1[0].privateKey, records.enc_message));
                                } catch (error) {
                                    // console.log(error);
                                    array.push(crypt.decryptRsa(data1[0].privateKey, records.enc_message));
                                }
                            }
                            else {
                                console.log("no messages");
                            }

                        });

                        // console.log(array.length);
                        // console.log(count);

                        if (array.length > 0) {

                            // console.log(array);

                            if (crypt.verify(data2[0].sender_publicKey, data2[0].message_hash, data2[0].sign, "sha1")) {
                                res.render("decrypt-text-message", {
                                    data2: data2, rUsername: data1[0].username,

                                    decryptedMessage: array


                                });
                            }
                            else {
                                res.render("decrypt-text-message", { data2: 0, rUsername: "Empty", decryptedMessage: "Empty" });
                            }
                        }
                        else {
                            res.render("decrypt-text-message", { data2: 0, rUsername: "Empty", decryptedMessage: "Empty" });
                        }


                    }
                    else {
                        res.render("decrypt-text-message", { data2: 0, rUsername: "Empty", decryptedMessage: "Empty" });
                    }

                    // console.log(array);
                    // });

                });
            } catch (err) {
                // console.log(err);
                res.redirect("/keygen");
            }
        });

    } else {
        res.redirect("/");
    }

});











// send encrypted message route

router.get("/send-message", function (req, res) {

    if (req.isAuthenticated()) {

        SelectedUser.find({}).where("sender_uid").equals(req.user._id).sort({ "createdAt": -1 }).limit(1).exec(function (err, data) {
            // console.log(data);


            res.render("encrypt-text-message", { uName: data });

        });

    } else {
        res.redirect("/");
    }

});


router.post("/send-message", function (req, res) {

    //encrypting message using rsa 2048 bit key

    try {

        SelectedUser.find({}).where("sender_uid").equals(req.user._id).sort({ "createdAt": -1 }).limit(1).exec(function (err, data) {

            // console.log(data[0].publicKey);
            // let encryptedMessage = crypt.encryptRsa(data[0].publicKey, req.body.message);
            // console.log(encryptedMessage);
            PubKey.find({}).where("userId").equals(req.user._id).sort({ "createdAt": -1 }).limit(1).exec(function (err, keys) {

                // console.log(keys[0].publicKey);
                bcrypt.hash(req.body.message, 10, function (err, messageHash) {

                    const userMessage = new UserMessage({

                        receiver_username: req.body.receiver_username,
                        receiver_publicKey: data[0].publicKey,
                        sender_uid: req.user._id,
                        sender_username: keys[0].username,
                        sender_gid: req.user.googleId,
                        sender_email: req.user.username,
                        sender_publicKey: keys[0].publicKey,
                        enc_message: crypt.encryptRsa(data[0].publicKey, req.body.message),
                        message_hash: messageHash,
                        sign: crypt.sign(keys[0].privateKey, messageHash, "sha1"),
                        hash: "sha1",
                        message_flag: "no",
                        sent_message_flag: "no"

                    });

                    userMessage.save().then(savedMessage => {


                        if (userMessage === savedMessage) {

                            // console.log("Saved");


                            UserMessage.find({}).exec(function (err, data2) {

                                // console.log(data2[0].receiver_username);

                                PubKey.find({ "username": { $eq: req.body.receiver_username } }).exec(function (err, data3) {

                                    // console.log(data3[0].gId);


                                    //send email notification to the receiver

                                    let transporter = nodemailer.createTransport({

                                        service: "SendinBlue",

                                        auth: {
                                            // host: 'smtp-relay.sendinblue.com',
                                            // port: 587,
                                            user: 'rohan1das1@gmail.com',
                                            pass: '2gpXSvyCIBKnkAtq'
                                        }
                                    });

                                    let mailOptions = {
                                        // from: 'rohan1das1@gmail.com',
                                        from: 'S-CLOUD <s.cloud.text.transferer@gmail.com>',
                                        to: data3[0].email,
                                        subject: 'New Encrypted Text From ' + keys[0].username,
                                        text: 'Hi ' + data3[0].username + ', You have a new unread text from ' + keys[0].username + '. Check your inbox at sCloud account!'
                                    };

                                    transporter.sendMail(mailOptions, function (error, info) {
                                        if (error) {
                                            console.log(error);
                                        } else {
                                            console.log('Email sent: ' + info.response);
                                        }

                                    });

                                });

                            });


                        } else {
                            console.log("Failed");
                        }


                    });
                });


            });


        });


        res.redirect("/send-message");


    } catch (err) {
        console.log(err);
    }


});














// display users


router.get("/members", function (req, res) {

    if (req.isAuthenticated()) {

        // console.log(req.user);
        PubKey.find().exec(function (err, data) {
            res.render("show-all-users", { records: data, username: req.user });
        });

    } else {
        res.redirect("/");
    }

});

router.post("/members", function (req, res) {

    // console.log(req.body.userInfo);
    // console.log(req.body.keyInfo);

    //database for storing the information of the receivers



    PubKey.find({}).where("userId").equals(req.user._id).sort({ "createdAt": -1 }).limit(1).exec(function (err, data) {

        // console.log(data.length);

        if (data.length === 0) {

            res.redirect("/keygen");

        } else {

            const selectedUser = new SelectedUser({

                username: req.body.userInfo,
                publicKey: req.body.keyInfo,
                sender_email: req.user.username,
                sender_username: data[0].username,
                sender_gid: req.user.googleId,
                sender_uid: req.user._id
            });

            selectedUser.save();

            //redirects to the send message page for sending the message to the selected receiver.
            res.redirect("/send-message");


        }
    });


});




// generate encryption decryption keys


router.get("/keygen", function (req, res) {

    if (req.isAuthenticated()) {

        // console.log(req.query.valid);

        if (req.query.valid === "username is taken") {

            if (PubKey.find({}).where("userId").equals(req.user._id).sort({ "createdAt": -1 }).limit(1)) {

                PubKey.find({}).where("userId").equals(req.user._id).sort({ "createdAt": -1 }).limit(1).exec(function (err, data) {

                    res.render("generate-enc-dec-keys", { records: data, taken: "Username is taken!" });

                });

            } else {

                res.render("generate-enc-dec-keys", { records: "", taken: "Username is taken!" });
            }
        } else {

            PubKey.find({}).where("userId").equals(req.user._id).sort({ "createdAt": -1 }).limit(1).exec(function (err, data) {
                res.render("generate-enc-dec-keys", { records: data, taken: "" });
            });
        }
    } else {
        res.redirect("/");
    }

});



router.post("/keygen", function (req, res) {



    let string = "username is taken";
    let string2 = "username is not available";

    let username = req.body.username;

    let lowercaseUsername = username.toLowerCase();

    try {

        PubKey.find({}).where("username").equals(lowercaseUsername).sort({ "createdAt": -1 }).limit(1).exec(function (err, data) {

            // console.log(data);


            if (data.length != 0) {

                // console.log(req.body.username);

                res.redirect("/keygen/?valid=" + string);


            } else {

                // generating the key pairs

                key = crypt.getRsaKey(2048);

                //Storing the data into database

                // const pubKey = new PubKey({
                //     username: req.body.username,
                //     userId: req.user._id,
                //     gId: req.user.googleId,
                //     email: req.user.username,
                //     publicKey: key.publicKey,
                //     privateKey: key.privateKey
                // });

                // pubKey.save();

                var query = PubKey.find({ userId: req.user._id }),
                    update = {

                        username: lowercaseUsername,
                        userId: req.user._id,
                        gId: req.user.googleId,
                        email: req.user.username,
                        publicKey: key.publicKey,
                        privateKey: key.privateKey

                    },
                    options = { upsert: true, new: true, setDefaultsOnInsert: true };

                PubKey.findOneAndUpdate(query, update, options, function (error, result) {

                    if (error) return;
                });


                // console.log(string2);

                res.redirect("/keygen/?value=" + string2);
            }
        });
    }
    catch (error) {
        console.log(error)
    }

});





//logout

router.get("/logout", function (req, res) {
    req.logout(function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/");
        }
    });
});




//sign in with google

router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/auth/google/stransfer", passport.authenticate("google", { failureRedirect: "/login" }),

    function (req, res) {
        res.redirect("/dashboard");

    }

);


//User Login routes

router.get("/", function (req, res) {
    res.render("login");
});

router.post("/login", function (req, res) {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    req.login(user, function (err) {

        if (err) {
            res.render("login");

        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/dashboard");
            });
        }
    });
});


// User registration routes

router.get("/register", function (req, res) {
    res.render("register");
});

router.post("/register", function (req, res) {

    User.register({ username: req.body.username }, req.body.password_confirm, function (err, user) {
        if (err) {
            res.render("/");
            // res.redirect("/");
        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/dashboard");
            });
        }
    });
});


router.get("/dashboard", function (req, res) {
    if (req.isAuthenticated()) {
        res.render("dashboard");
    } else {
        res.redirect("/");
    }
});




//
module.exports = router;