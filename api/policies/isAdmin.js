/**
 * admin
 *
 * @module      :: Policy
 * @description :: TODO: You might write a short summary of how this policy works and what it represents here.
 * @help        :: http://sailsjs.org/#!/documentation/concepts/Policies
 */
module.exports = function(req, res, ok) {

	if(!req.session.User.admin){
		var requireError = [{name: 'requireAdminError', message: 'You must be an admin!'}];
  		req.session.flash = {
  			err: requireError
  		};
  		res.redirect('/error');
		return;
	}
	//User is allowed if they are logged in and an admin user, proceed to controller
  	else if(req.session.User && req.session.User.admin){
  		return ok();
  	};
  	
			

};