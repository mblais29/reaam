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

		var uploadFile = req.file('uploadFile');
		
		uploadFile.upload({
		  adapter: require('skipper-gridfs'),
		  uri: 'mongodb://localhost:27017/reaam.user',
		  maxBytes: 100000000, //100mb
		  }, function (err, filesUploaded) {
		  if (err) return res.negotiate(err);
				   var userId = req.session.User.id;
		  var userObj = {
			//Adds the encrypted filename to user.profileimage field record for user being edited
			  profileimage: filesUploaded[0].extra.fd 
		  };
			User.update(userId, userObj, function userUpdated(err){
				if(err){
					res.json(err);
				}
			});  
		  return res.redirect('/user/show/' + req.param('id'));
		}); 

	}
};

