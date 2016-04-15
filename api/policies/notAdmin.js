/**
 * notAdmin
 *
 * @module      :: Policy
 * @description :: TODO: You might write a short summary of how this policy works and what it represents here.
 * @help        :: http://sailsjs.org/#!/documentation/concepts/Policies
 */
module.exports = function(req, res, ok) {

  	var sessionUserMatchesId = req.session.User.id === req.param('id');
  	var isAdmin = req.session.User.admin;
  	
  	//Triggers when the requested id does not match the user's id and is not an admin
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