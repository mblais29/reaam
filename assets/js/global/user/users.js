/*****************************
	LOADING USER UPLOAD PROFILE PAGE 
*****************************/
/* When screen loads check document size and adjust button accordingly */
$(document).ready(function () {
  $('#loading').css('display', 'none');
  $( '#addUserSecGroup-panel' ).draggable();
  var win = $(this); //this = window
  if (win.width() <= 640) { 
  	$('#user-profile-button').css("width", "80%");
  	$('#user-profile-button').css("margin", "0 auto");
  }
  if (win.width() >= 641) { 
  	$('#user-profile-button').css("width", "50%");
  	$('#user-profile-button').css("margin", "0 auto");
  }
  
  $('#addusersecgroups').on('click',function(){
  	addSecurityDropdown();
  });
  
  $('#userSecAddClose').on('click', function(){
	$('#addUserSecGroup-panel').slideUp();
  });
  
  $("#addusersecgroup").on('click', 'li a', function(){
		$("#btn-addusersecgroup").text($(this).text());
		$("#btn-addusersecgroup").val($(this).text());
		
		/* Removes the [] around the security.secid */
		var str = $("#btn-addusersecgroup").val();
		var regex = /\[(.*?)\]/g;
		var newStr = str.match(regex);
		var secId = newStr[0].replace(/[\[\]']+/g, '');
		$("#userAddSecGroup").val(secId);
	});
  
  $(".removesec").click(function(){

	    console.log($(this).attr('value'));
	
  });
  
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

$('#adminCheckbox').on('click', function(){
	//console.log($(this).is(':checked'));
	// Checks to see if the user is an admin or not and adjusts the hidden checkbox value accordingly
	$('#hiddenAdminCheckbox').attr('value', $(this).is(':checked'));
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

function addSecurityDropdown(){
	$.get('/security/getSecgroupEnum')
		.done(function(data) {
			if ( $('#addSecGroupDropdown').children().length === 0 ) {
				for (i = 0; i < data.length; i++) { 
			    	$('#addSecGroupDropdown').append('<li><a href="#">' + '[' + data[i].secid + '] ' + data[i].secname + '</a></li>');
				}
			};
			$('#addUserSecGroup-panel').show();
		}).error(function(err){
			alert(err);
		});
}








