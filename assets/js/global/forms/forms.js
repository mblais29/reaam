$(window).on('load',function(){
	$('#table').footable();
	$( "#form-add" ).draggable();
	$( "#formfieldadd" ).draggable();
	$( "#form-edit" ).draggable();
	
	$('#formPreviewClose').on('click', function(){
		$('#form-preview').slideUp();
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
      	console.log(data);
      	
      },
      done: function(data){
      	
      },
      error: function(err) {
         console.log(err);
      }
    });
}

