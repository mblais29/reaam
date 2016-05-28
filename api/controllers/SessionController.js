/**
 * SessionController
 *
 * @description :: Server-side logic for managing sessions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var bcrypt = require('bcrypt');
module.exports = {
	'new': function(req,res){
		/*var oldDateObj = new Date();
		var newDateObj = new Date(oldDateObj.getTime() + 60000);
		req.session.cookie.expires = newDateObj;
		req.session.authenticated = true;
		console.log(req.session);*/
		res.view('session/new');
	},
	create: function(req,res,next){
		//checks to see if the user has entered a username and password
		if(!req.param('email') || !req.param('password')){
			var usernamePasswordRequiredError = [{name: 'usernamePasswordRequired', message: 'You must enter both a username and password.'}];
			req.session.flash = {
				err: usernamePasswordRequiredError
			};
			res.redirect('/session/new');
			return;
		}
		//Finds the user by their email
		User.findOneByEmail(req.param('email'), function foundUser(err,user){
			if(err) return next(err);
			//If no user is found throw an error
			if(!user){
				var noAccountError = [{name: 'noAccount', message: 'The email address ' + req.param('email')+ ' not found'}];
				req.session.flash = {
					err: noAccountError
				};
				res.redirect('/session/new');
				return;

			}
			//Compares the user password from the form to the user password found
			bcrypt.compare(req.param('password'), user.encryptedPassword, function(err,valid){
				if(err) return next(err);
				//If password from the database does not match throw an error
				if(!valid){
					var usernamePasswordMismatchError = [{name: 'usernamePasswordMismatch', message: 'Invalid username password combination.'}];
					req.session.flash = {
						err: usernamePasswordMismatchError
					};
					res.redirect('/session/new');
					return;
				}
				
				//Log in user
				req.session.authenticated = true;
				req.session.User = user;
				//console.log(user);
				
				//if user is admin user redirects to user list page
				if(req.session.User.admin){
					res.redirect('/user');
					return;
				}
				//Redirect to their profile page
				res.redirect('/user/show/' + user.id);
			});
		});	
	},
	
	destroy: function(req, res, next){
		//Wipe out session
		req.session.destroy();
		
		//Redirect browser to signin page
		res.redirect('/session/new');
	}
};

