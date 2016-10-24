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
	//Update the Form from edit page
	update: function(req, res, next){
		var formObj = {};
			 formObj = {
				formid: req.param('form-id'),
				formname: req.param('formname'),
				securitygroup: req.param('formsecurity')
			};
		//console.log(formObj);
		Forms.update(req.param('form-id'), formObj, function formsUpdated(err){
			if(err){
				req.session.flash = {
				err: err
				};
			res.redirect('/forms');
			return;
			}
			return res.redirect('/forms');
		}); 
	},
	//Delete the Form
	destroy: function(req, res, next){
		Forms.find().where({formid: req.param('formid')}).populateAll().exec(function (err, response) {
			//res.json(response[0].formfields);
			var fields = response[0].formfields;
			if(fields.length){
				var formFieldsError = [{name: 'formFieldsError', message: 'Must delete the form fields first before deleting the form...'}];
				req.session.flash = {
					err: formFieldsError
				};
				res.redirect('/forms');
				return;
			}else{
				Forms.findOne(req.param('formid'), function foundForm(err,form){
					if(err) return next(err);
					if(!form) return next('Form doesn\'t exist...');
					Forms.destroy(req.param('formid'), function formDestroyed(err){
						req.session.flash = {
							err: err
						};
					});
					res.redirect('/forms');
				});
			}
    	});
	}
};

