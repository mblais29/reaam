$(window).on('load',function(){
	$( "#form-add" ).draggable();
	$( "#formfieldadd" ).draggable();
	$( "#form-edit" ).draggable();
	$( "#form-preview" ).draggable();
	$( "#myform-selected" ).draggable();
	$( "#myform-viewrecords" ).draggable();
	$( "#myform-viewdocs" ).draggable();
	$( "#myform-addDoc" ).draggable();
	
	$('#formPreviewClose').on('click', function(){
		$('#form-preview').slideUp();
		//Removes all children elements within form
		$('#formPreview').empty();
	});
	
	$('#myformClose').on('click', function(){
		$('#myform-selected').slideUp();
		//Removes all children elements within form
		$('#formSelected').empty();
	});
	
	$('#myformViewRecordClose').on('click', function(){
		$('#myform-viewrecords').slideUp();
		//Removes all children elements within form
		$('#myform-panel-records').empty();
	});
	
	$('#myformViewDocClose').on('click', function(){
		$('#myform-viewdocs').slideUp();
		//Removes all children elements within form
		$('#myform-panel-docs').empty();
		$('#add-doc').remove();
		$('#doc-delete').remove();
		
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
	
	$('#myformAddDocClose').on('click', function(){
		$('#myform-addDoc').slideUp();
		$('#myform-panel-addDocs').empty();
	});
	
	$("#addNewFormField").on('click', 'li a', function(){
      $("#btn-formfieldtype").text($(this).text());
      $("#btn-formfieldtype").val($(this).text());
      $("#formfieldtypehidden").val($(this).text());
      
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

function submitMyForm(){
	$('#formSelected').submit();
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
		});
}

function insertPreviewFormData(formid){
	$('#form-preview').show();
	$.ajax('/forms/populate?formid=' + formid,{
      success: function(data) {
      	//console.log(data);
      	generatePreviewForm(data);
      },
      done: function(data){
      	
      },
      error: function(err) {
         console.log(err);
      }
    });
}

function insertSelectedFormData(formid){
	$('#myform-selected').show();
	$.ajax('/forms/populate?formid=' + formid,{
      success: function(data) {
      	$('#myform-title').append('<span>' + data[0].formname + '</span>');
      	generateForm(data);
      },
      done: function(data){
      	
      },
      error: function(err) {
         console.log(err);
      }
    });
}

function openFormRecords(collection,formid){
	$('#myform-viewrecords').show();
	$.ajax({
		url:'/forms/formRecords?collection=' + collection + '&formid=' + formid,
		dataType : 'json',
      	success : function(result) {
      		//Create the table
      		$('#myform-panel-records').append('<table id="table-formrecords" class="table table-striped" data-paging="true" data-sorting="true" data-filtering="true"></table>');
 
      		var table = $('#table-formrecords');
      		
      		//Create empty column array for table header
      		var jsonColumns = [];

            $.each(result, function(idx, obj) {
                $.each(obj, function(key, value) {
                	//If the column does not exist add it to the jsonColumns array, will not push docid fields
                	if(!arrayCheck(jsonColumns, key) && key != 'docid'){
                		jsonColumns.push({name: key, title: key});
                	}

                	//If the value is a date value convert it using moment plugin
                	if(moment(value, 'YYYY-MM-DD', true).isValid() === true){
						var date = moment(value).format('ll');
						obj[key] = date;
					}else if(moment(value, 'YYYY-MM-DD H:mm:s', true).isValid() === true){
						var datetime = moment(value).format('llll');
						obj[key] = datetime;
					}

                });
            });

			//Initialize the table with records
			if(jsonColumns.length){
				$('#table-formrecords').footable({
					"columns": jsonColumns,
					"rows": result
				});
			}else{
				$('#table-formrecords').css('text-align','center');
				$('#table-formrecords').append('<h1><i>No Results</i></h1>');
			}
            
         },
	      done: function(data){
	      	
	      },
	      error: function(err) {
	         console.log(err);
	      }
    });

}

function openDocumentRecords(recordId, collection, formid){
	$('#myform-viewdocs').show();
	$.ajax({
		url:'/formfields/getDocs?recordid=' + recordId + '&collection=' + collection,
		dataType : 'json',
      	success : function(result) {
      		//Create the table if it does not already exist
      		if($("#table-docs").length === 0){
	      		$('#myform-panel-docs').append('<table id="table-docs" class="table table-striped" data-paging="true" data-sorting="true" data-filtering="true"></table>');
	 			
	      		var table = $('#table-docs');
	
	      		getFormFieldType(result, formid, collection, recordId);
      		}
      	}
		
	});
}

function getFormFieldType(result, formid, collection, recordId){
	$.each(result, function(idx, obj) {
		$.each(obj, function(key, value) {
			$.ajax({
				url:'/formfields/checkField?formid=' + formid + '&formfieldname=' + key,
				type: "GET",
		      	success : function(data) {
		      		if(data === "binary"){
		      			var binaryField = "";
		      			if(obj[key] instanceof Array){
			      			for(var ii = 0; ii < obj[key].length; ii++){
			      				binaryField = key;
			      				var values = {};
			      				values["record"] = recordId;
			      				values["docid"] = obj['docid'][ii];
			      				values["docname"] = obj[key][ii];
			      				values["collection"] = collection;
			      				values["formfield"] = key;
								var stringifiedValue = JSON.stringify(values);

								$('#table-docs').append('<tr><td><a href="/formfields/streamFile?docid=' + obj['docid'][ii] + '"><button type="button" class="btn btn-info">' + obj[key][ii] + '</button></a><label class="checkbox-inline pull-right"><input type="checkbox" class="deleteDoc" value=' + stringifiedValue + '></label></td></tr>');
		        			}
		        		}else{
		        			binaryField = key;
		        			$('#table-docs').append('<tr><td><a href="/formfields/streamFile?docid=' + obj['docid'][ii] + '"><button type="button" class="btn btn-info">' + obj[key] + '</button></a><label class="checkbox-inline pull-right"><input type="checkbox" class="deleteDoc" value=' + stringifiedValue + '></label></td></tr>');
		        		}
		        		if($('#doc-delete').length < 1 && $('#add-doc').length < 1){
		        			$('#myform-viewdocs-title').append('<div class="btn-group pull-right"><button type="button" id="add-doc" class="btn btn-primary btn-sm" onclick="createUploadButton(' + '\'' + collection + '\',' + '\'' + recordId + '\'' + ',\'' + binaryField + '\'' + ')">Add</button><button type="button" id="doc-delete" class="btn btn-danger btn-sm" onclick="deleteDocuments()">Delete</button></div>');
		        		}
		        		
		        	}
		      	}
		 	});
		});
	});
}

function createUploadButton(collection, recordId, binaryField){
	$('#myform-addDoc').show();
	$('form#addDocForm').append('<input type="hidden" name="collection" value="' + collection + '"><input type="hidden" name="id" value="' + recordId + '"><input type="hidden" name="binaryField" value="' + binaryField + '"><label for="addNewDoc">Upload Files:</label><input type="file" class="form-control" id="addNewDoc" name="addNewDoc" multiple />');
	
	$('#addNewDoc').filestyle({
		size: 'sm',
		buttonName : 'btn-info',
		buttonText : 'Upload'
	});
	
	$('#submitFiles').on('click', function(){
		insertNewFiles(collection, recordId);
	});
	
};

function insertNewFiles(name, recordId){
	$('#addDocForm').submit();
};

function deleteDocuments(){
	var deleteDocuments = [];
	$('.deleteDoc').each(function () {
	    var checkedVal = (this.checked ? $(this).val() : "");
	    if(checkedVal != ""){
	    	console.log(JSON.parse(checkedVal));
	    	var objVal = JSON.parse(checkedVal);
	    	
	    	$.ajax({
				url:'/formfields/deleteDoc?record=' + objVal["record"] + '&docid=' + objVal["docid"] + '&docname=' + objVal["docname"] + '&collection=' + objVal["collection"] + '&formfield=' + objVal["formfield"],
				type: "GET",
		      	success : function(data) {
		      		
		      	}
		      	
		    }).done(function(){
		    
		    });
	    	
	    }
	});
	location.reload();
}

function arrayCheck(array, val){
	for(var i=0;i < array.length; i++) {
    	if (array[i].title === val) {
    		return true;
    	}
    }
    return false;
}

function generatePreviewForm(data){
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
					    		inputType = "text";
					    		$('#formfieldid' + formfieldObject.formfieldid).append('<label for="' + formfieldObject.formfieldname + formfieldObject.formfieldid + '">' + formfieldObject.formfieldname + ':</label>');
			    				$('#formfieldid' + formfieldObject.formfieldid).append('<input type="' + inputType + '" class="form-control" id="' + formfieldObject.formfieldname + formfieldObject.formfieldid + '" name="' + inputName + '">');
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
					        $('#formfieldid' + formfieldObject.formfieldid).append('<label for="' + inputName + formfieldObject.formfieldid + '">' + formfieldObject.formfieldname + ':</label>');
					        $('#formfieldid' + formfieldObject.formfieldid).append('<div class="input-group date form_datetime col-md-5" data-date="" data-link-field="' + inputName + formfieldObject.formfieldid + '" style="width:100%"><input class="form-control" size="16" type="text" value="" readonly><span class="input-group-addon"><span class="glyphicon glyphicon-remove"></span></span><span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span></div>');
					        $('#formfieldid' + formfieldObject.formfieldid).append('<input type="hidden" id="' + inputName + formfieldObject.formfieldid + '" name="' + inputName + '" value="" />');
					        $('.form_datetime').datetimepicker({
					        	format: "yyyy-mm-dd hh:ii:00",
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
					    case 'binary':
					    	/* If input string is file show the file upload else just create a text input */
					    		inputType = "file";
					    		$('#formfieldid' + formfieldObject.formfieldid).append('<label for="' + inputName + formfieldObject.formfieldid + '">' + formfieldObject.formfieldname + ':</label>');
			    				$('#formfieldid' + formfieldObject.formfieldid).append('<input type="' + inputType + '" class="form-control" id="' + inputName + formfieldObject.formfieldid + '" name="' + inputName + formfieldObject.formfieldid + '" multiple>');

								$('#' + inputName + formfieldObject.formfieldid).filestyle({
									size: 'sm',
									buttonName : 'btn-info',
									buttonText : 'Upload'
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

function generateForm(data){
	$('#formSelected').append('<div class="form-group" id="collection"></div>');
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
	    			
	    			$('#formSelected').append('<div class="form-group" id="' + 'formfieldid' + formfieldObject.formfieldid + '"></div>');
	    			var inputType = "";
	    			switch (formfieldObject.formfieldtype) {
					    case 'string':
					    		inputType = "text";
					    		$('#formfieldid' + formfieldObject.formfieldid).append('<label for="' + inputName + '">' + formfieldObject.formfieldname + ':</label>');
			    				$('#formfieldid' + formfieldObject.formfieldid).append('<input type="' + inputType + '" class="form-control" id="' + inputName + '" name="' + inputName + '">');
					        break;
					    case 'text':
					        inputType = "text";
					        $('#formfieldid' + formfieldObject.formfieldid).append('<label for="' + inputName + '">' + formfieldObject.formfieldname + ':</label>');
			    			$('#formfieldid' + formfieldObject.formfieldid).append('<input type="' + inputType + '" class="form-control" id="' + inputName + formfieldObject.formfieldid + '" name="' + inputName + '">');
							break;
					    case 'integer':
					        inputType = "number";
					        $('#formfieldid' + formfieldObject.formfieldid).append('<label for="' + inputName + formfieldObject.formfieldid + '">' + formfieldObject.formfieldname + ':</label>');
			    			$('#formfieldid' + formfieldObject.formfieldid).append('<input type="' + inputType + '" class="form-control" id="' + inputName + formfieldObject.formfieldid + '" name="' + inputName + '">');
					        break;
					    case 'float':
					        inputType = "number";
					        $('#formfieldid' + formfieldObject.formfieldid).append('<label for="' + inputName + formfieldObject.formfieldid + '">' + formfieldObject.formfieldname + ':</label>');
			    			$('#formfieldid' + formfieldObject.formfieldid).append('<input type="' + inputType + '" class="form-control" id="' + inputName + formfieldObject.formfieldid + '" name="' + inputName + '">');
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
					        $('#formfieldid' + formfieldObject.formfieldid).append('<label for="' + inputName + formfieldObject.formfieldid + '">' + formfieldObject.formfieldname + ':</label>');
					        $('#formfieldid' + formfieldObject.formfieldid).append('<div class="input-group date form_datetime col-md-5" data-date="" data-link-field="' + inputName + formfieldObject.formfieldid + '" style="width:100%"><input class="form-control" size="16" type="text" value="" readonly><span class="input-group-addon"><span class="glyphicon glyphicon-remove"></span></span><span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span></div>');
					        $('#formfieldid' + formfieldObject.formfieldid).append('<input type="hidden" id="' + inputName + formfieldObject.formfieldid + '" name="' + inputName + '" value="" />');
					        $('.form_datetime').datetimepicker({
					        	format: "yyyy-mm-dd hh:ii:00",
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
					    case 'binary':
					    	/* If input string is file show the file upload else just create a text input */
					    		inputType = "file";
					    		var lowercase = formfieldObject.formfieldname.toString().toLowerCase();
								$('<input name="binary" type="hidden" value="' + lowercase + '" />').appendTo('#formfieldid' + formfieldObject.formfieldid);
					    		$('#formfieldid' + formfieldObject.formfieldid).append('<label for="' + inputName + formfieldObject.formfieldid + '">' + formfieldObject.formfieldname + ':</label>');
			    				$('#formfieldid' + formfieldObject.formfieldid).append('<input type="' + inputType + '" class="form-control" id="' + inputName + formfieldObject.formfieldid + '" name="' + inputName + formfieldObject.formfieldid + '" multiple />');
								
								
								$('#' + inputName + formfieldObject.formfieldid).filestyle({
									size: 'sm',
									buttonName : 'btn-info',
									buttonText : 'Upload'
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
					        $('#formfieldid' + formfieldObject.formfieldid).append('<label for="' + inputName + formfieldObject.formfieldid + '">' + formfieldObject.formfieldname + ':</label>');
			    			$('#formfieldid' + formfieldObject.formfieldid).append('<input type="' + inputType + '" class="form-control" id="' + inputName + formfieldObject.formfieldid + '" name="' + inputName + '">');
					        break;
					    case 'mediumtext':
					        $('#formfieldid' + formfieldObject.formfieldid).append('<label for="' + inputName + formfieldObject.formfieldid + '">' + formfieldObject.formfieldname + ':</label>');
			    			$('#formfieldid' + formfieldObject.formfieldid).append('<textarea class="form-control" rows="5" id="' + finputName + formfieldObject.formfieldid + '" name="' + inputName + '"></textarea>');
					        break;
					    case 'longtext':
					        $('#formfieldid' + formfieldObject.formfieldid).append('<label for="' + inputName + formfieldObject.formfieldid + '">' + formfieldObject.formfieldname + ':</label>');
			    			$('#formfieldid' + formfieldObject.formfieldid).append('<textarea class="form-control" rows="5" id="' + inputName + formfieldObject.formfieldid + '" name="' + inputName + '"></textarea>');
					        break;
					};
				}
	    	}
	    	
	    }
	}
}
