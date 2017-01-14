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
		switch(addButtonId){
			case 'formAdd': {
				$.get('/security/getSecgroupEnum')
					.done(function(data) {
						for (i = 0; i < data.length; i++) { 
						    $('#secGroupDropdown').append('<li><a href="#">' + data[i].secname + '</a></li>');
						}
	  				}).error(function(err){
	  					alert(err);
	  				});
					break;
			}
		}
	});
}

