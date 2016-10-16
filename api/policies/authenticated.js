/**
 * admin
 *
 * @module      :: Policy
 * @description :: TODO: You might write a short summary of how this policy works and what it represents here.
 * @help        :: http://sailsjs.org/#!/documentation/concepts/Policies
 */
module.exports = function(req, res, ok) {

  	//User is allowed if they are logged in and an admin user, proceed to controller
  	if(req.session.User && req.session.User.admin){
  		console.log(req.session.User);
  		return ok();
  	}
  	
  	//User is not allowed
  	else{
  		if(!req.session.User.admin){
  			var requireAdminError = [{name: 'requireAdminError', message: 'You must be an admin!'}];
	  		req.session.flash = {
	  			err: requireAdminError
	  		};
  		}  		
  		res.redirect('/session/new');
  		return;
  	}
};