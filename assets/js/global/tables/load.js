var tableId;
var addButtonId;

window.onload = function() {
	/* Grabs the table id for current page loaded */
        tableId = $('table').attr('id');
        addButtonId = $('table thead tr th button').attr('id');
};

function createButtonAddEvent(){
	$('#' + addButtonId).on('click', function(){
		var showAddRecordPanel = $('div.panel-default').attr('id');
		$('#' + $('div.panel-default').attr('id')).show();
	});
}

