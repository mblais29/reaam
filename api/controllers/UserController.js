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
			
			//res.redirect('/user/show/' + user.id);
			res.redirect('/session/new');
		});
	},
	
	//shows selected user
	show: function(req, res, next){
		User.findOne(req.param('id'), function foundUser(err,user){
			if(err) return next(err);
			if(!user) return next();
			res.view({
				user: user,
				title: 'Show'
			});
		});
	},
	
	//List of Users page
	index: function(req, res, next){
		//console.log(new Date());
		console.log(req.session.User);
		User.find(function foundUsers(err,users){
			if(err) return next(err);
			res.view({
				users: users,
				title: 'Users'
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
	
	'resetpassword': function(req,res){
		//Pulls the user id from the url
		currentUserId = req.param('id');
		res.view();
	},
	'emailpassword': function(req,res){
		res.view();
	},
	
	//Update User's Password
	'updatepassword': function(req,res){
		//Creates User Object based on inputed values
		var userObj = {
			id: req.param('reset-userId'),
			email: req.param('email'),
			password: req.param('password'),
			confirmation: req.param('confirmation')
		};
		//console.log(userObj);
		//Finds the user by their email
		User.findOneByEmail(userObj.email, function foundUser(err,user){
			if(err) return next(err);
			//If no user is found throw an error
			if(!user){
				var noAccountError = [{name: 'noAccount', message: 'The email address ' + req.param('email')+ ' not found'}];
				req.session.flash = {
					err: noAccountError
				};
				res.redirect('/user/resetpassword');
				return;
			}else if(userObj.email == user.email && userObj.id == user.id){
				//console.log(userObj.email + ' = ' + user.email);
				//console.log(userObj.id + ' = ' + user.id);
				//Encrypts the User's new password
				require('bcrypt').compare(userObj.password, user.encryptedPassword, function(err,valid){
					if(err){
						console.log('Problem comparing the password with password record in the database!');
					} else if (valid){
						console.log('Please enter a new unique password!');
					} else {
						console.log('New Password does not match old password!');
						require('bcrypt').hash(userObj.password, 10, function passwordEncrypted(err,newEncryptedPassword){
					  		if(err) return next(err);
							var userNewPassword = {
								encryptedPassword: newEncryptedPassword
							};
	
							//Updates the User's Password in the database with the new password
					  		User.update(user.id, userNewPassword, function userUpdatedPassword(err){
					  			if(err){
									var passwordUpdateError = [{name: 'passwordUpdate', message: err}];
									req.session.flash = {
										err: passwordUpdateError
									};
								}
								return res.redirect('/session/new');
							});
					  	});
					}
				});	
			}else{
				console.log('User id and email do not match!');
			}
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

