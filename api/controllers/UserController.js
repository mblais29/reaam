/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	'new': function(req,res){
		res.view();
	},

	//Create User from new.ejs form all form params sent to create function
	create: function(req,res,next){
		var userObj = {
			firstname: req.param('firstname'),
			lastname: req.param('lastname'),
			email: req.param('email'),
			password: req.param('password'),
			confirmation: req.param('confirmation')
		};
		
		User.create(userObj, function userCreated(err,user){
			//if there is an error return it
			if(err){
				console.log(err);
				req.session.flash = {
					err: err
				};
				//If error returns user to sign-up page
				return res.redirect('/user/new');
			};
			//After user is created redirect to show the action
			//returns the user in json format
			//res.json(user);
			
			res.redirect('/user/show/' + user.id);
		});
	},
	//shows selected user
	show: function(req, res, next){
		User.findOne(req.param('id'), function foundUser(err,user){
			if(err) return next(err);
			if(!user) return next();
			res.view({
				user: user
			});
		});
	},
	//List of Users page
	index: function(req, res, next){
		//console.log(new Date());
		//console.log(req.session);
		User.find(function foundUsers(err,users){
			if(err) return next(err);
			res.view({
				users: users
			});
		});
	},
	//Edit User
	edit: function(req, res, next){
		User.findOne(req.param('id'), function foundUser(err,user){
			if(err) return next(err);
			if(!user) return next('User doesn\'t exist...');
			res.view({
				user: user
			});
		});
	},
	//Update the User from edit page
	update: function(req, res, next){
		if(req.session.User.admin){
			var userObj = {
				firstname: req.param('firstname'),
				lastname: req.param('lastname'),
				email: req.param('email'),
				admin: req.param('admin')
			};
		}else{
			var userObj = {
				firstname: req.param('firstname'),
				lastname: req.param('lastname'),
				email: req.param('email')
			};
		}
		User.update(req.param('id'), userObj, function userUpdated(err){
			if(err){
				return res.redirect('/user/edit/' + req.param('id'));
			}
			return res.redirect('/user/show/' + req.param('id'));
		});
	},
	//Delete the User
	destroy: function(req, res, next){
		User.findOne(req.param('id'), function foundUser(err,user){
			if(err) return next(err);
			if(!user) return next('User doesn\'t exist...');
			User.destroy(req.param('id'), function userDestroyed(err){
				if(err) return next(err);
			});
			res.redirect('/user');
		});
	}
	
};

