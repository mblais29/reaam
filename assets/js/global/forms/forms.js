/*****************************
	LOADING USER PAGE 
*****************************/

$('#form-table').footable();

//Delay displaying the user table to allow footable to load
function formPage() {
  $('#form-loading').css('display', 'none');
  $('#form-loading').css('opacity', '0');

  $('#form-title').css('display', 'block');
  $('#form-title').css('opacity', '1');
  $('#form-table').css('display', 'table');
  $('#form-table').css('opacity', '1');


}
setTimeout("formPage()", 1000); // after 1 second

function formPanelRequest(request, id){
	switch(request) {
		case 'add':
			$('.formflds-panel-header').text('Add Fields');
			$('.formflds-panel-header').append('<span class="pull-right close-formflds-panel" data-effect="slideUp"><i class="fa fa-times"></i></span>');
			removeFormsPanel();
			draggableFormsPanel();
			$('#formflds-panel').fadeIn('slow');
			$('#file-form').css('display', 'block');
			$('#formid').val(id);
			break;
	}
}

function removeFormsPanel(){
	$('.close-formflds-panel').on('click',function(){
		var effect = $(this).data('effect');
	    $(this).closest('.panel')[effect]();
	});
}

function draggableFormsPanel() {
    $("#formflds-panel").draggable({
	      handle: ".formflds-panel-header"
	  });
    
};