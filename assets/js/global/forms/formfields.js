$(window).on('load',function(){
	$('#formfieldclosebutton').on('click', function(){
		$('#formfield-edit').slideUp();
	});
});

function getformfieldsrecords(formfieldid){
	$.ajax('/formfields/edit?formfieldid=' + formfieldid,{
      success: function(data) {
      	//console.log(data);
      	$('#formfieldid').val(data.formfieldid);
      	$('#formID').val(data.formid);
      	$('#formfieldName').val(data.formfieldname);
      	$('#formfieldtype').val(data.formfieldtype);
      	$('#formfield-edit').show();
      	
      },
      error: function(err) {
         console.log(err);
      }
    });

	
}

