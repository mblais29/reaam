/**
 * SecurityController
 *
 * @description :: Server-side logic for managing securities
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	//List of Security Groups page
	index: function(req, res, next){
		Security.find(function foundSecurity(err,security){
			if(err) return next(err);
			res.view({
				security: security,
				title: 'Security Groups'
			});
		});
	},
	create: function(req,res,next){
		var secObj = {
			formname: req.param('formName'),
			collectionname: req.param('formCollectionName'),
			securitygroup: req.param('formSecurity')
		};
	},
};

