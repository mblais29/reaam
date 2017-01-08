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
			secname: req.param('secName'),
			secid: req.param('secId')
		};
		
		Security.create(secObj, function secGroupCreated(err,sec){
			if(err){
				req.session.flash = {
				err: err
				};
			};
			AlertService.success('success', 'You have created' + req.param('secName') + ' Security Group!');

			res.redirect('/security');
			console.log('Created Security Group ' + req.param('secName') + ' Successfully');
		});
	},
	edit: function(req,res,next){
		Security.findOne(req.param('secid')).exec(function (err, securityGroup) {
			return res.ok(securityGroup);
		});
	},
	//Update the Security Group
	update: function(req, res, next){
		var secObj = {};
			 secObj = {
				secid: req.param('sec-id'),
				secname: req.param('secname')
			};
		//console.log(secObj);
		Security.update(req.param('sec-id'), secObj, function securityGroupUpdated(err){
			if(err){
				req.session.flash = {
				err: err
				};
			res.redirect('/security');
			return;
			}
			return res.redirect('/security');
		}); 
	},
};

