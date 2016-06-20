/**
 * admin
 *
 * @module      :: Policy
 * @description :: TODO: You might write a short summary of how this policy works and what it represents here.
 * @help        :: http://sailsjs.org/#!/documentation/concepts/Policies
 */
module.exports = function(req, res, ok) {

  	//User is allowed, proceed to controller
  	if(req.session.User && req.session.User.admin){
  		return ok();
  	}
  	
  	//User is not allowed
  	else{
  		var requireAdminError = [{name: 'requireAdminError', message: 'You must be an admin!'}];
  		req.session.flash = {
  			err: requireAdminError
  		};
  		res.redirect('/session/new');
  		return;
  	}
};