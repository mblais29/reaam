/**
 * SecurityController
 *
 * @description :: Server-side logic for managing securities
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	'index': function(req,res){
		//if session is authenticated go to map else redirect to login page
		if(req.session.authenticated){
			res.view({
				title: 'Security'
			});
			return;
		}else{
			res.redirect('/session/new');
			return;
		}
	},
	
	'new': function(req,res){
		res.view();
	},
	
	'create': function(req,res,next){
		if(!req.param('sec-name') || !req.param('sec-id')){
			var securityRequiredError = [{name: 'securityIdRequired', message: 'You must enter both a security name and a security id.'}];
			req.session.flash = {
				err: securityRequiredError
			};
			res.redirect('/security/new');
			return;
		}
	}
};

