$(window).on('load',function(){
	$('#table').footable();
	$( "#form-add" ).draggable();
	$('#formAdd').on('click', function(){
		$('#form-add').show();
	});
	$('#formClose').on('click', function(){
		$('#form-add').slideUp();
	});
	$( "#formfieldedit" ).draggable();

	$('#formfieldClose').on('click', function(){
		$('#formfieldedit').slideUp();
		$("#btn-formfieldtype").text('Select Type');
	});
	
});

function getFormfieldValue(formid){
	$('#form').val(formid);
	$('#formfieldedit').show();
}

$(function(){

    $(".dropdown-menu").on('click', 'li a', function(){
      $("#btn-formfieldtype").text($(this).text());
      $("#btn-formfieldtype").val($(this).text());
      $("#formfieldtypehidden").val($(this).text());
   });

});
