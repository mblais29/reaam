/**
 * FormsController
 *
 * @description :: Server-side logic for managing forms
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	'index': function(req,res){
		//if session is authenticated go to map else redirect to login page
		
		if(req.session.authenticated){
			Forms.find(function foundForms(err,forms){
				if(err) return next(err);
				res.view({
					forms: forms,
					title: 'Forms'
					});
				});
		}else{
			res.redirect('/session/new');
			return;
		}
	},
	
	'new': function(req,res){
		res.view();
	},
	
	'create': function(req,res,next){
		if(!req.param('form-name') || !req.param('collection')){
			var formRequiredError = [{name: 'formRequired', message: 'You must enter both a form name and a collection.'}];
			req.session.flash = {
				err: formRequiredError
			};
			res.redirect('/forms/new');
			return;
		};
		var formObj = {
			formName: req.param('form-name'),
			collection: req.param('collection'),
			description: req.param('form-description'),
			security: req.param('form-sec')
		};
		Forms.create(formObj, function formCreated(err,form){
			//if there is an error return it
			if(err){
				console.log(err);
				req.session.flash = {
					err: err
				};
				//If error returns user to sign-up page
				return res.redirect('/form/new');
			};
			res.redirect('/forms');
		});
	}
};

