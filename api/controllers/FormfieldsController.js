/**
 * FormfieldsController
 *
 * @description :: Server-side logic for managing formfields
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var Waterline = require('waterline');

module.exports = {
	
	index: function(req, res, next){
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

		var record = req.allParams();
		
		for(var prop in record) {
			//console.log(record[prop]);
	        if(record[prop] === '')
	            delete record[prop];
	    }

		/* Deletes the _csrf and collection records from the array */
		 delete record._csrf; 
		 delete record.collection;

		 /* Converts the key to lowercase before saving to database */
		 var lowercaseRecord = ObjectServices.convertLowercase(record);
 
		 /* Replaces and spaces with "_" before saving to database */
		 var finalRecord = ObjectServices.removeSpace(lowercaseRecord);

		 var MongoClient = require('mongodb').MongoClient;
		 var myCollection;
		 var insertedId;
		 var docName = [];

		 MongoClient.connect(sails.config.conf.url, function(err, db) {
		     if(err)
		         throw err;
		         
		     myCollection = db.collection(req.param('collection'));
		     myCollection.insert(finalRecord, function(err, result) {
			     if(err)
			         throw err;

	 			 insertedId = result.insertedIds[0];

	 			 //If files exist in the parameters upload the file to the docs bucket
	 			 if(typeof req._fileparser.upstreams[0] !== 'undefined'){
				 	var uploadFile = req._fileparser.upstreams[0];
				 	//console.log(uploadFile);
				 	//console.log(req._fileparser.upstreams[0]._files[0].stream.filename.split('.').pop());
				 	
			 		uploadFile.upload({
					   adapter: require('skipper-gridfs'),
					   uri: sails.config.conf.docUrl,
					   saveAs: uploadFile._files[0].stream.filename,
					   maxBytes: 1000000000, //1000mb
					   }, function (err, filesUploaded) {

						   if (err) return res.negotiate(err);
						   //If there are more than 1 file create an array or else just load the one file
						   if(filesUploaded.length > 1){
						     for(var i = 0; i < filesUploaded.length; i++){
						     	docName.push(filesUploaded[i].filename);
							   }
						   }else{
						     docName = filesUploaded[0].filename;
						   }

						   //Updates the new record with uploaded file name
				           myCollection.update({_id:insertedId}, {$set: {documents:docName}}, false, true);
					 });
					 
				 }
			 });
		 });
		res.redirect('/forms/myForms');
	},
	
	'streamFile': function (req, res) {
		
		var docAdapter = require('skipper-gridfs')({
			//reaam.docs is the database.file[bucket]
			uri: sails.config.conf.docUrl
		});

		var value = req.param('docname');
				 docAdapter.read(value, function(error , file) {
			 if(error) {
				res.json(error);
			} else {
				res.set({'Content-Disposition': 'attachment; filename=' + value + ''});
				res.send(new Buffer(file, 'binary'));
			}
		 });
		 
        
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

