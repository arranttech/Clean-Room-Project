const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Only configure Google Strategy if credentials are available
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/auth/google/callback',
      },
      (accessToken, refreshToken, profile, done) => {
        const user = {
          googleId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
        };
        return done(null, user);
      }
    )
  );
}

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));
