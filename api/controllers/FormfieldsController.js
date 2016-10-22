/**
 * FormfieldsController
 *
 * @description :: Server-side logic for managing formfields
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index: function(req, res, next){
		//console.log(new Date());
		//console.log(req.session.User);
		Formfields.find(function foundForms(err,formfields){
			if(err) return next(err);
			res.view({
				formfields: formfields,
				title: 'Formfields'
			});
		});
	},
	create: function(req,res,next){
		var formObj = {
			formid: req.param('form'),
			formfieldname: req.param('formfieldname'),
			formfieldtype: req.param('formfieldtypehidden')
		};
		Formfields.create(formObj, function formfieldCreated(err,formfield){
			if(err){
				console.log(err);
			};
			console.log('Created Formfield ' + req.param('formfieldname') + ' Successfully');
		});
		//Populates the forms.formfields collection with all formfields associated to that form
		Forms.find(formObj.formid).populate("formfields")
		    .exec(function(err, response) {
		        console.log(response);
		    });
	},
	edit: function(req,res,next){
		Formfields.findOne(req.param('formfieldid')).exec(function (err, formfield) {
			return res.ok(formfield);
		});
	}
};

