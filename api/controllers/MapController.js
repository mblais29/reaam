/**
 * MapController
 *
 * @description :: Server-side logic for managing maps
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	'index': function(req,res){
		//console.log(req.session.authenticated);
		//if session is authenticated go to map else redirect to login page
		if(req.session.authenticated){
			res.view();
			return;
		}else{
			res.redirect('/session/new');
			return;
		}
		
		
	}
};

