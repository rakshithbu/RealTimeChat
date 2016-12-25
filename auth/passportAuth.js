"use strict";

module.exports = function (passport, FacebookStrategy, configs, mongoose) {


    var chatUser = new mongoose.Schema({
        profileID: String,
        fullName: String,
        profilePic: String

    });

    var userModel = mongoose.model('chatUser', chatUser);

     passport.serializeUser(function(user,done) {
          done(null,user.id);
     });

     passport.deserializeUser(function (id,done){
         userModel.findOne({"_id":id},function(err,user){
         done(err,user);
     })
     });

    passport.use(new FacebookStrategy({
            clientID: configs.fb.appId,
            clientSecret: configs.fb.appSecret,
            callbackURL: "http://localhost:3000/auth/facebook/callback",
            profileFields: ['id', 'displayName', 'photos']
        },
        function (accessToken, refreshToken, profile, done) {
             userModel.findOne({ 'profileID': profile.id }, function (err, user) {
             if(user){
             done(null,user);
             }
               else{
             var newChatUser = new userModel({
             profileID : profile.id,
             fullName :  profile.displayName,
             profilePic :profile.photos[0].value || ''
             });
             newChatUser.save(function(err){
             done(null,newChatUser);
             })
             }
             });
        }
    ));
}