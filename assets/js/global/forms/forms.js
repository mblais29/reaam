$(window).on('load',function(){
	$( "#form-add" ).draggable();
	$( "#formfieldadd" ).draggable();
	$( "#form-edit" ).draggable();
	$( "#form-preview" ).draggable();
	
	$('#formPreviewClose').on('click', function(){
		$('#form-preview').slideUp();
		//Removes all children elements within form
		$('#formPreview').empty();
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
	
	$("#addNewFormField").on('click', 'li a', function(){
      $("#btn-formfieldtype").text($(this).text());
      $("#btn-formfieldtype").val($(this).text());
      $("#formfieldtypehidden").val($(this).text());
      /* If the user selects type string show option to create document upload */
      if($("#formfieldtypehidden").val() === 'string'){
      	$('#fileUploadCheckbox').show();
      }else{
      	$('#fileUploadCheckbox').hide();
      }

      $('#file-upload').on('click', function(){
		/* When checkbox is clicked update hidden input value */ 
      	$('#file-upload-hidden').val($(this).prop('checked'));
      });
      
    });
    
    $("#addsecgroup").on('click', 'li a', function(){
    	$("#btn-secgroup").text($(this).text());
    	$("#btn-secgroup").val($(this).text());

		/* Removes the [] around the security.secid */
    	var str = $("#btn-secgroup").val();
    	var regex = /\[(.*?)\]/g;
    	var newStr = str.match(regex);
    	var secId = newStr[0].replace(/[\[\]']+/g, '');
		$("#secgrouphidden").val(secId);
    });
    /* Forms Edit Page changes hidden input value on click */
    $("#editsecgroup").on('click', 'li a', function(){
    	$("#btn-seceditgroup").text($(this).text());
    	$("#btn-seceditgroup").val($(this).text());

		/* Removes the [] around the security.secid */
    	var str = $("#btn-seceditgroup").val();
    	var regex = /\[(.*?)\]/g;
    	var newStr = str.match(regex);
    	var secId = newStr[0].replace(/[\[\]']+/g, '');
		$("#seceditgrouphidden").val(secId);
    });
    
});

/* FUNCTIONS */

function closeFormAddPanel(){
	$('#form-add').slideUp();
	$('input[type=text]').rules('remove'); 
	$('#formCreate input').val("");
	$("#btn-secgroup").text('Select Type');
	$("#btn-secgroup").val('Select Type');
	$("#secgrouphidden").val('');
}

function forceLower(strInput){
	strInput.value = strInput.value.toLowerCase();
};

function submitFormPreview(){
	$('#formPreview').submit();
};

function getFormfieldValue(formid){
	$('#form').val(formid);
	$('#formfieldadd').show();
};

function getFormValue(formid){
	$('#form-edit').show();
	$.ajax('/forms/edit?formid=' + formid,{
      success: function(data) {
      	$('#form-id').val(data.formid);
      	$('#formname').val(data.formname);
      //	$('#formsecurity').val(data.securitygroup);
      getFormSec(data.formid);
      },
      done: function(data){
      	
      },
      error: function(err) {
         console.log(err);
      }
    });
};

function getFormSec(id, sec){
	$.get('/forms/getSecGroup?formid=' + id )
		.done(function(data){
			var formSecGroup = data[0].securitygroup[0].secid;
			addSecurityDropdown(formSecGroup);
		});
}

function addSecurityDropdown(formSecGroup){
	$.get('/security/getSecgroupEnum')
		.done(function(data) {
			if ( $('#seceditGroupDropdown').children().length === 0 ) {
				for (i = 0; i < data.length; i++) { 
			    	$('#seceditGroupDropdown').append('<li><a href="#">' + '[' + data[i].secid + '] ' + data[i].secname + '</a></li>');
				}
			};
			for (i = 0; i < data.length; i++) { 
				if(formSecGroup === data[i].secid){
					$("#btn-seceditgroup").text('[' + data[i].secid + '] ' + data[i].secname);
					$("#btn-seceditgroup").val('[' + data[i].secid + '] ' + data[i].secname);
					$("#seceditgrouphidden").val(data[i].secid);
				};
			};
			$('#formfield-edit').show();
		}).error(function(err){
			alert(err);
		});
}

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
	$('#formPreview').append('<div class="form-group" id="collection"></div>');
	$('#collection').append('<input type="hidden" name="collection" value="' + data[0].collectionname + '" />');
	for (var i = 0; i < data.length; i++){
		var obj = data[i];
	    for (var key in obj){
	    	//console.log('Key: ' + key);
	    	//console.log('Key Value: ' + obj[key]);
	    	if(key === 'formfields'){
	    		for (var i = 0; i < obj[key].length; i++){
	    			var formfieldObject = obj[key][i];
	    			/* If name has a space replace with '_' */
	    			var inputName = formfieldObject.formfieldname.replace(/\s/g, '_');
	    			
	    			$('#formPreview').append('<div class="form-group" id="' + 'formfieldid' + formfieldObject.formfieldid + '"></div>');
	    			var inputType = "";
	    			switch (formfieldObject.formfieldtype) {
					    case 'string':
					    	/* If input string is file show the file upload else just create a text input */
					    	if(formfieldObject.fileupload === true){
					    		inputType = "file";
					    		$('#formfieldid' + formfieldObject.formfieldid).append('<label for="' + formfieldObject.formfieldname + formfieldObject.formfieldid + '">' + formfieldObject.formfieldname + ':</label>');
			    				$('#formfieldid' + formfieldObject.formfieldid).append('<input type="' + inputType + '" class="form-control" id="' + formfieldObject.formfieldname + formfieldObject.formfieldid + '" name="' + inputName + '">');

								$('#' + formfieldObject.formfieldname + formfieldObject.formfieldid).filestyle({
									size: 'sm',
									buttonName : 'btn-info',
									buttonText : 'Upload'
								});
			    				
					    	}else{
					    		inputType = "text";
					    		$('#formfieldid' + formfieldObject.formfieldid).append('<label for="' + formfieldObject.formfieldname + formfieldObject.formfieldid + '">' + formfieldObject.formfieldname + ':</label>');
			    				$('#formfieldid' + formfieldObject.formfieldid).append('<input type="' + inputType + '" class="form-control" id="' + formfieldObject.formfieldname + formfieldObject.formfieldid + '" name="' + inputName + '">');
					    	}
					        break;
					    case 'text':
					        inputType = "text";
					        $('#formfieldid' + formfieldObject.formfieldid).append('<label for="' + formfieldObject.formfieldname + formfieldObject.formfieldid + '">' + formfieldObject.formfieldname + ':</label>');
			    			$('#formfieldid' + formfieldObject.formfieldid).append('<input type="' + inputType + '" class="form-control" id="' + formfieldObject.formfieldname + formfieldObject.formfieldid + '" name="' + inputName + '">');
							break;
					    case 'integer':
					        inputType = "number";
					        $('#formfieldid' + formfieldObject.formfieldid).append('<label for="' + formfieldObject.formfieldname + formfieldObject.formfieldid + '">' + formfieldObject.formfieldname + ':</label>');
			    			$('#formfieldid' + formfieldObject.formfieldid).append('<input type="' + inputType + '" class="form-control" id="' + formfieldObject.formfieldname + formfieldObject.formfieldid + '" name="' + inputName + '">');
					        break;
					    case 'float':
					        inputType = "number";
					        $('#formfieldid' + formfieldObject.formfieldid).append('<label for="' + formfieldObject.formfieldname + formfieldObject.formfieldid + '">' + formfieldObject.formfieldname + ':</label>');
			    			$('#formfieldid' + formfieldObject.formfieldid).append('<input type="' + inputType + '" class="form-control" id="' + formfieldObject.formfieldname + formfieldObject.formfieldid + '" name="' + inputName + '">');
					        break;
					    case 'date':
					        $('#formfieldid' + formfieldObject.formfieldid).append('<label for="' + inputName + formfieldObject.formfieldid + '">' + formfieldObject.formfieldname + ':</label>');
					        $('#formfieldid' + formfieldObject.formfieldid).append('<div class="input-group date form_date col-md-5" data-date="" data-date-format="dd MM yyyy" data-link-field="' + inputName + formfieldObject.formfieldid + '" data-link-format="yyyy-mm-dd" style="width:100%"><input class="form-control" size="16" type="text" value="" readonly><span class="input-group-addon"><span class="glyphicon glyphicon-remove"></span></span><span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span></div>');
					        $('#formfieldid' + formfieldObject.formfieldid).append('<input type="hidden" id="' + inputName + formfieldObject.formfieldid + '" name="' + inputName + '" value="" />');
					        $('.form_date').datetimepicker({
						        weekStart: 1,
						        todayBtn:  1,
								autoclose: 1,
								todayHighlight: 1,
								startView: 2,
								minView: 2,
								pickerPosition: "bottom-left",
								forceParse: 0
						    });
					        break;
					    case 'datetime':
					        $('#formfieldid' + formfieldObject.formfieldid).append('<label for="' + formfieldObject.formfieldname + formfieldObject.formfieldid + '">' + formfieldObject.formfieldname + ':</label>');
					        $('#formfieldid' + formfieldObject.formfieldid).append('<div class="input-group date form_datetime col-md-5" data-date="" data-link-field="' + formfieldObject.formfieldname + formfieldObject.formfieldid + '" data-date-format="dd MM yyyy - HH:ii p" style="width:100%"><input class="form-control" size="16" type="text" value="" readonly><span class="input-group-addon"><span class="glyphicon glyphicon-remove"></span></span><span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span></div>');
					        $('#formfieldid' + formfieldObject.formfieldid).append('<input type="hidden" id="' + formfieldObject.formfieldname + formfieldObject.formfieldid + '" name="' + inputName + '" value="" />');
					        $('.form_datetime').datetimepicker({
						        weekStart: 1,
						        todayBtn:  1,
								autoclose: 1,
								todayHighlight: 1,
								startView: 2,
								forceParse: 0,
						        showMeridian: 1,
								pickerPosition: "bottom-left"
						    });
					        break;
					    case 'boolean':
					        $('#formfieldid' + formfieldObject.formfieldid).append('<label for="formfield_boolean">' + formfieldObject.formfieldname + ':</label><div class="dropdown" id="formfield_boolean"><button id="boolean" class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">Yes or No  <span class="caret"></span></button>');
					        $('#formfield_boolean').append('<input type="hidden" id="formfield_boolean_val" name="formfield_boolean_val" ><ul class="dropdown-menu"><li><a href="#">Yes</a></li><li><a href="#">No</a></li></ul></div>');
					        $("#formfield_boolean").on('click', 'li a', function(){
						    $("#boolean").text($(this).text());
						    if($(this).text() === 'Yes'){
						    	$("#formfield_boolean_val").val('true');
						    	$("#boolean").removeClass('btn-primary');
						    	$("#boolean").removeClass('btn-danger');
						    	$("#boolean").addClass('btn-success');
						    }else{
						    	$("#formfield_boolean_val").val('false');
						    	$("#boolean").removeClass('btn-primary');
						    	$("#boolean").removeClass('btn-success');
						    	$("#boolean").addClass('btn-danger');
						    }
						      //console.log($("#boolean").text());
						      //console.log($("#formfield_boolean_val").val());
						    });
					        break;
					    case 'json':
					        inputType = "text";
					        $('#formfieldid' + formfieldObject.formfieldid).append('<label for="' + formfieldObject.formfieldname + formfieldObject.formfieldid + '">' + formfieldObject.formfieldname + ':</label>');
			    			$('#formfieldid' + formfieldObject.formfieldid).append('<input type="' + inputType + '" class="form-control" id="' + formfieldObject.formfieldname + formfieldObject.formfieldid + '" name="' + inputName + '">');
					        break;
					    case 'mediumtext':
					        $('#formfieldid' + formfieldObject.formfieldid).append('<label for="' + formfieldObject.formfieldname + formfieldObject.formfieldid + '">' + formfieldObject.formfieldname + ':</label>');
			    			$('#formfieldid' + formfieldObject.formfieldid).append('<textarea class="form-control" rows="5" id="' + formfieldObject.formfieldname + formfieldObject.formfieldid + '" name="' + inputName + '"></textarea>');
					        break;
					    case 'longtext':
					        $('#formfieldid' + formfieldObject.formfieldid).append('<label for="' + formfieldObject.formfieldname + formfieldObject.formfieldid + '">' + formfieldObject.formfieldname + ':</label>');
			    			$('#formfieldid' + formfieldObject.formfieldid).append('<textarea class="form-control" rows="5" id="' + formfieldObject.formfieldname + formfieldObject.formfieldid + '" name="' + inputName + '"></textarea>');
					        break;
					};
				}
	    	}
	    	
	    }
	}
}

