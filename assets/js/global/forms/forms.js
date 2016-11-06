$(window).on('load',function(){
	$('#table').footable();
	$( "#form-add" ).draggable();
	$( "#formfieldadd" ).draggable();
	$( "#form-edit" ).draggable();
	
	$('#formPreviewClose').on('click', function(){
		$('#form-preview').slideUp();
		//Removes all children elements within form
		$("#formPreview").empty();
	});
	
	$('#formAdd').on('click', function(){
		$('#form-add').show();
	});
	
	$('#formClose').on('click', function(){
		$('#form-add').slideUp();
		$('#formName').val("");
	});
	
	$('#formEditClose').on('click', function(){
		$('#form-edit').slideUp();
		$('#formname').val("");
	});
	
	$('#formfieldClose').on('click', function(){
		$('#formfieldadd').slideUp();
		$("#btn-formfieldtype").text('Select Type');
		$('#formfieldname').val("");
	});
	
	$(".dropdown-menu").on('click', 'li a', function(){
      $("#btn-formfieldtype").text($(this).text());
      $("#btn-formfieldtype").val($(this).text());
      $("#formfieldtypehidden").val($(this).text());
    });
	
});

function getFormfieldValue(formid){
	$('#form').val(formid);
	$('#formfieldadd').show();
};

function getFormValue(formid){
	$('#form-edit').show();
	$.ajax('/forms/edit?formid=' + formid,{
      success: function(data) {
      	//console.log(data);
      	$('#form-id').val(data.formid);
      	$('#formname').val(data.formname);
      	$('#formsecurity').val(data.securitygroup);
      	$('#formfield-edit').show();
      },
      done: function(data){
      	
      },
      error: function(err) {
         console.log(err);
      }
    });
};

function insertFormData(formid){
	$('#form-preview').show();
	$.ajax('/forms/populate?formid=' + formid,{
      success: function(data) {
      	//console.log(data);
      	generateForm(data);
      },
      done: function(data){
      	
      },
      error: function(err) {
         console.log(err);
      }
    });
}

function generateForm(data){
	for (var i = 0; i < data.length; i++){
		var obj = data[i];
	    for (var key in obj){
	    	//console.log('Key: ' + key);
	    	//console.log('Key Value: ' + obj[key]);
	    	if(key === 'formfields'){
	    		for (var i = 0; i < obj[key].length; i++){
	    			var formfieldObject = obj[key][i];
	    			console.log(formfieldObject);
	    			console.log(formfieldObject.formfieldname);
	    			
	    			$('#formPreview').append('<div class="form-group"><label class="control-label col-sm-2" for="'+ formfieldObject.formfieldname + '">' + formfieldObject.formfieldname + ':</label><div class="col-sm-10"><input type="text" class="form-control" id="' + formfieldObject.formfieldname + '" name="' + formfieldObject.formfieldname + '" placeholder="Enter form name..."></div></div>');
		    		//for (var formfieldKey in formfieldObject){
		    			//console.log('Key: ' + formfieldKey);
		    			//console.log('Key Value: ' + formfieldObject[formfieldKey]);
		    			//console.log(formfieldObject.formfieldname);
		    			//$('#formPreview').append('<div class="form-group"><label class="control-label col-sm-2" for="'+ formfieldObject.formfieldname + '">' + formfieldObject.formfieldname + '</label><div class="col-sm-10"><input type="text" class="form-control" id="' + formfieldObject.formfieldname + '" name="' + formfieldObject.formfieldname + '" placeholder="Enter form name..."></div></div>');

		    		//}
	    		}
	    	}
	    	
	    }
	}
}

