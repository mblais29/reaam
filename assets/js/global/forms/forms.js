$(window).on('load',function(){
	$('#table').footable();
	$( "#form-add" ).draggable();
	$('#formAdd').on('click', function(){
		$('#form-add').show();
	});
	$('#formClose').on('click', function(){
		$('#form-add').slideUp();
		$('#formName').val("");
	});
	$( "#formfieldadd" ).draggable();

	$('#formfieldClose').on('click', function(){
		$('#formfieldadd').slideUp();
		$("#btn-formfieldtype").text('Select Type');
		$('#formfieldname').val("");
	});
	
});

function getFormfieldValue(formid){
	$('#form').val(formid);
	$('#formfieldadd').show();
}

$(function(){

    $(".dropdown-menu").on('click', 'li a', function(){
      $("#btn-formfieldtype").text($(this).text());
      $("#btn-formfieldtype").val($(this).text());
      $("#formfieldtypehidden").val($(this).text());
   });

});
