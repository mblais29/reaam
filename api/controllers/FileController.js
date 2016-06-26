/**
 * FileController
 *
 * @description :: Server-side logic for managing files
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	upload: function(req, res) {
	    if (req.method === 'GET')
	        return res.json({ 'status': 'GET not allowed' });
	    //	Call to /upload via GET is error
	
	    var uploadFile = req.file('uploadFile');
	    console.log(req.param('title'));
	    
	     uploadFile.upload({
	      adapter: require('skipper-gridfs'),
	      uri: 'mongodb://localhost:27017/reaam.fs'
	    }, function (err, filesUploaded) {
	      if (err) return res.negotiate(err);
	      
	      return res.ok({
		    files: filesUploaded,
		    textParams: req.params.all()
		  });
	      //console.log(filesUploaded);
	      //return res.ok();
	    });
	
	   /* uploadFile.upload(function onUploadComplete(err, files) {
	        //	Files will be uploaded to .tmp/uploads
	
	        if (err) return res.serverError(err);
	        //	IF ERROR Return and send 500 error with error
	
	        console.log(files);
	        res.json({ status: 200, file: files });
	   }); */
	}
};

