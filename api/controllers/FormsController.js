/**
 * FormsController
 *
 * @description :: Server-side logic for managing forms
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Waterline = require('waterline');

module.exports = {
	//List of Users page
	index: function(req, res, next){
		/* Add populateAll to get all the foreign keys for the form model */
		Forms.find().populateAll().exec(function foundForms(err,data){
			if(err) return next(err);

			res.view({
				forms: data,
				title: 'Forms'
			});
		});
	},
	create: function(req,res,next){
		var formObj = {
			formname: req.param('formName'),
			collectionname: req.param('formCollectionName'),
			securitygroup: req.param('secgrouphidden')
		};
		
		Forms.create(formObj, function formCreated(err,form){
			if(err){
				console.log(err);
			};
			
			console.log('Created Form ' + req.param('formName') + ' Successfully');
		});
		
		var orm = new Waterline();

		var config = {
		    // Setup Adapters
		    // Creates named adapters that have have been required
		    adapters: {
		        'default': 'mongo',
		        mongo: require('sails-mongo')
		    },
		
		    // Build Connections Config
		    // Setup connections using the named adapter configs
		    connections: {
		        'default': {
		            adapter: 'mongo',
		            url: 'mongodb://localhost:27017/reaam'
		        }
		    }
		};
		
		var newModel = Waterline.Collection.extend({
		    identity: formObj.collectionname,
		    connection: 'default',

		});
		orm.loadCollection(newModel);
		
		orm.initialize(config, function(err, data) {
		    if (err) {
		        throw err;
		    }
		    res.redirect('/forms');
		});
		
		
	},
	edit: function(req,res,next){
		Forms.findOne(req.param('formid')).exec(function (err, form) {
			return res.ok(form);
		});
	},
	update: function(req, res, next){
		var formObj = {};
			 formObj = {
				formid: req.param('form-id'),
				formname: req.param('formname'),
				securitygroup: req.param('seceditgrouphidden')
			};

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
	},
	'populate': function(req, res, next){
		Forms.find().where({formid: req.param('formid')}).populateAll().exec(function (err, response) {
			if(err) return next(err);
			//Must return res.ok() to send the data to the ajax call
			return res.ok(response);
		});
	},
	'getSecGroup': function(req, res){
		Forms.find().where({formid: req.param('formid')}).populateAll().exec(function (err, records) {
			if(err) return next(err);
			//Must return res.ok() to send the data to the ajax call
			return res.ok(records);
		});
	},
};

