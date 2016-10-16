/**
 * notAdmin
 *
 * @module      :: Policy
 * @description :: TODO: You might write a short summary of how this policy works and what it represents here.
 * @help        :: http://sailsjs.org/#!/documentation/concepts/Policies
 */
module.exports = function(req, res, ok) {
//Checks to see if the current user logged in is updating their own profile, the session user id must match the requested user id
  	var sessionUserMatchesId = req.session.User.id === req.param('id');
  	var isAdmin = req.session.User.admin;

  	if(!(sessionUserMatchesId || isAdmin)){
  		var noRightsError = [{name: 'noRights', message: 'You must be an admin.'}];
  		req.session.flash = {
  			err: noRightsError
  		};
  		//Wipe out session
		req.session.destroy();
  		res.redirect('/session/new');
  		return;
  	}
  	ok();
};