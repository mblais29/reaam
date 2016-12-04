/**
 * FormfieldsController
 *
 * @description :: Server-side logic for managing formfields
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var Waterline = require('waterline');

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
			formfieldtype: req.param('formfieldtypehidden'),
			fileupload: req.param('file-upload-hidden')
		};
		Formfields.create(formObj, function formfieldCreated(err,formfield){
			if(err){
				console.log(err);
			};
			console.log('Created Formfield ' + req.param('formfieldname') + ' Successfully');
		});
		
		/*var orm = new Waterline();

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
		var formCollection = "";
		var attributeName = formObj.formfieldname;
		var attributeType = formObj.formfieldtype;
		
		Forms.findOne(formObj.formid).exec(function (err, form) {
			formCollection = form.collectionname;
			newAttribute = Waterline.Collection.extend({
			    identity: formCollection,
			    connection: 'default',
			
			    attributes: {
					attributeName: attributeType
			    }
			});
			orm.loadCollection(newAttribute);
			
			orm.initialize(config, function(err, data) {
			    if (err) {
			        throw err;
			    }
			});
			
		});*/

		res.redirect('/forms');
	},
	
	edit: function(req,res,next){
		Formfields.findOne(req.param('formfieldid')).exec(function (err, formfield) {
			return res.ok(formfield);
		});
	},
	//Update the Form Field from edit page
	update: function(req, res, next){
		var formFieldObj = {};
			 formFieldObj = {
				formfieldid: req.param('formfieldid'),
				formfieldname: req.param('formfieldName'),
				formfieldtype: req.param('formfield-type-hidden')
			};
		//console.log(formFieldObj);
		Formfields.update(req.param('formfieldid'), formFieldObj, function formfieldsUpdated(err){
			if(err){
				req.session.flash = {
				err: err
				};
			res.redirect('/formfields');
			return;
			}
			return res.redirect('/formfields');
		}); 
	},
	'insert': function(req, res, next){
		//res.json(req.param('collection'));
		var record = req.allParams();
		
		/* Deletes the _csrf and collection records from the array */
		delete record._csrf; 
		delete record.collection;
		
		/* Converts the key to lowercase before saving to database */
		var lowercaseRecord = ObjectServices.convertLowercase(record);
		
		/* Replaces and spaces with "_" before saving to database */
		var finalRecord = ObjectServices.removeSpace(lowercaseRecord);
		
		var MongoClient = require('mongodb').MongoClient;
 		
		var myCollection;
		var db = MongoClient.connect(sails.config.conf.url, function(err, db) {
		    if(err)
		        throw err;
		    //console.log("Connected to the MongoDB !");
		    myCollection = db.collection(req.param('collection'));
		    myCollection.insert(lowercaseRecord, function(err, result) {
			    if(err)
			        throw err;
			 
			    //console.log("entry saved");
			});
		});
		res.redirect('/forms');
	},
	//Delete the Form Field
	destroy: function(req, res, next){
		Formfields.findOne(req.param('formfieldid'), function foundFormfield(err,formfield){
			if(err) return next(err);
			if(!formfield) return next('Form Field doesn\'t exist...');
			Formfields.destroy(req.param('formfieldid'), function formfieldDestroyed(err){
				if(err) return next(err);
			});
			res.redirect('/formfields');
		});
	}
};

