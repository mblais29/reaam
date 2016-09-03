$('#user-table').footable();

//Delay displaying the user table to allow footable to load
function showIt2() {
  $('#loading').css('display', 'none');
  $('#loading').css('opacity', '0');
  $('#user-title').css('display', 'block');
  $('#user-title').css('opacity', '1');
  $('#user-table').css('display', 'table');
  $('#user-table').css('opacity', '1');

}
setTimeout("showIt2()", 1000); // after 1 second

//Upload Profile Image Button Style
$('#BSbtninfo').filestyle({
	buttonName : 'btn-info',
	buttonText : 'Select a Profile Image'
});






