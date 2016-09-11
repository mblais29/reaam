/**
 * DocController
 *
 * @description :: Server-side logic for managing docs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	'fileUpload': function(req, res) {

		if (req.method === 'GET')
			return res.json({ 'status': 'GET not allowed' });

		var uploadFile = req.file('uploadFile');
		//console.log(uploadFile);
		
		uploadFile.upload({
		  adapter: require('skipper-gridfs'),
		  uri: 'mongodb://localhost:27017/reaam.doc',
		  maxBytes: 1000000000, //1gb
		  }, function (err, filesUploaded) {
		  if (err) return res.negotiate(err);
	  		console.log(err);
			console.log(filesUploaded);
		}); 
		
	}
};

