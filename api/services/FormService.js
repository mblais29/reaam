
module.exports = {
	
	getFormInfo: function (formid) {
		('/forms/populate?formid=' + formid,{
	      success: function(data) {
	      	console.log(data);
	      	
	      },
	      done: function(data){
	      	
	      },
	      error: function(err) {
	         console.log(err);
	      }
	    });
	}
};