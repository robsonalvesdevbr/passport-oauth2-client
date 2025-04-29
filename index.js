const express = require("express");
const passport = require("passport");
const session = require("express-session");

const app = express();
const OAuth2Strategy = require("passport-oauth2");

app.use(
	session({
		secret: "keyboard cat",
		resave: false,
		saveUninitialized: true,
		cookie: { secure: true },
	}),
);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});

passport.use(
	new OAuth2Strategy(
		{
			authorizationURL:
				"http://localhost:8080/realms/ecommerce/protocol/openid-connect/auth",
			tokenURL:
				"http://localhost:8080/realms/ecommerce/protocol/openid-connect/token",
			clientID: "app-payment-client-secret",
			clientSecret: "V4ebDlZGTK7jsW9jOKnxWp2z2vpaqkI8",
			callbackURL: "http://localhost:8000/auth/example/callback",
			scope: "openid profile app-payment-scope",
			state: true,
			pkce: true,
		},
		(accessToken, refreshToken, profile, cb) => {
			//User.findOrCreate({ exampleId: profile.id }, (err, user) =>
			//	cb(err, user),
			//);
			const user = {
				id: profile.id,
				accessToken: accessToken,
				refreshToken: refreshToken,
			};
			return cb(null, user);
			//return cb(null, { accessToken, refreshToken, profile });
		},
	),
);

app.get("/auth/example", passport.authenticate("oauth2"));

app.get(
	"/auth/example/callback",
	passport.authenticate("oauth2", { failureRedirect: "/login" }),
	(req, res) => {
		// Successful authentication, redirect home.
		res.redirect("/");
	},
);

app.listen(8000, () => {
	console.log("Server is running on http://localhost:8000");
});
