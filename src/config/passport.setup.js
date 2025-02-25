const passport = require("passport");
const User = require("../models/user.models");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

 
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({ googleId: profile.id });
        if (existingUser) {
          // return done(null, existingUser);
        //   console.log("User already exists");
          done(null, existingUser);
        } else {
          const user = await new User({
            googleId: profile.id,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            profilePicture: profile.photos[0].value,
          }).save().then((user)=> {
            console.log("User created successfully");
            done(null, user);
          })
        }
      } catch (error) {
        console.log(error);
      }
    }
  )
);
