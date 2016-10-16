$(window).on('load',function(){
	$('#table').footable();
	$( "#form-add" ).draggable();
	$('#formAdd').on('click', function(){
		$('#form-add').show();
	});
	$('#formClose').on('click', function(){
		$('#form-add').slideUp();
	});
	
});