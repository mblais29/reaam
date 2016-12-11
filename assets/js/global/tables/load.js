var tableId;
var addButtonId;

window.onload = function() {
	/* Grabs the table id for current page loaded */
        tableId = $('table').attr('id');
        addButtonId = $('table thead tr th button').attr('id');
};

//Delay displaying the user table to allow footable to load
function loadPage() {
  
  $('#loading').css('display', 'none');
  $('#loading').css('opacity', '0');
  
  if (document.getElementById("map")) {
	  $('#map').css('visibility', 'visible');
  }
  $('#'+ tableId).css('display', 'table');
  $('#' + tableId).css('opacity', '1');
  $('#table-title').css('display', 'block');
  $('#table-title').css('opacity', '1');
  $('#' + tableId).footable();
  createButtonAddEvent();

}
setTimeout("loadPage()", 1000); // after 1 second

function createButtonAddEvent(){
	$('#' + addButtonId).on('click', function(){
		var showAddRecordPanel = $('div.panel-default').attr('id');
		$('#' + $('div.panel-default').attr('id')).show();
	});
}

