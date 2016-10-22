/**
 * FormsController
 *
 * @description :: Server-side logic for managing forms
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	//List of Users page
	index: function(req, res, next){
		//console.log(new Date());
		//console.log(req.session.User);
		Forms.find(function foundForms(err,forms){
			if(err) return next(err);
			res.view({
				forms: forms,
				title: 'Forms'
			});
		});
	},
	create: function(req,res,next){
		var formObj = {
			formname: req.param('formName'),
			securitygroup: req.param('formSecurity')
		};
		
		Forms.create(formObj, function formCreated(err,form){
			if(err){
				console.log(err);
			};
			console.log('Created Form ' + req.param('form-name') + ' Successfully');
		});
		
		res.redirect('/forms');
	},
	edit: function(req,res,next){
		Forms.findOne(req.param('formid')).exec(function (err, form) {
			return res.ok(form);
		});
	},
};

