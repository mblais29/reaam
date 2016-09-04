/*****************************
	LOADING USER PAGE 
*****************************/

$('#user-table').footable();

//Delay displaying the user table to allow footable to load
function userPage() {
  $('#user-loading').css('display', 'none');
  $('#user-loading').css('opacity', '0');

  $('#user-title').css('display', 'block');
  $('#user-title').css('opacity', '1');
  $('#user-table').css('display', 'table');
  $('#user-table').css('opacity', '1');


}
setTimeout("userPage()", 1000); // after 1 second

/*****************************
	LOADING USER UPLOAD PROFILE PAGE 
*****************************/
/* When screen loads check document size and adjust button accordingly */
$(document).ready(function () {
  var win = $(this); //this = window
  if (win.width() <= 640) { 
  	$('#user-profile-button').css("width", "80%");
  	$('#user-profile-button').css("margin", "0 auto");
  }
  if (win.width() >= 641) { 
  	$('#user-profile-button').css("width", "50%");
  	$('#user-profile-button').css("margin", "0 auto");
  }
});

/* When screen size changes adjust button accordingly */
$(window).on('resize', function(){
  var win = $(this); //this = window
  if (win.width() <= 640) { 
  	$('#user-profile-button').css("width", "80%");
  	$('#user-profile-button').css("margin", "0 auto");
  }
  if (win.width() >= 641) { 
  	$('#user-profile-button').css("width", "50%");
  	$('#user-profile-button').css("margin", "0 auto");
  }
});

 
//Upload Profile Image Button Style
$('#BSbtninfo').filestyle({
	size: 'sm',
	buttonName : 'btn-info',
	buttonText : 'Select a Profile Image'
});

//Delay displaying the user profile upload to allow file input to load first
function displayFileInput() {
  $('#user-profile-loading').css('display', 'none');
  $('#user-profile-loading').css('opacity', '0');
  $('.upload-user-profile').css('display', 'block');
  $('.upload-user-profile').css('opacity', '1');

}
setTimeout("displayFileInput()", 1000); // after 1 second 





