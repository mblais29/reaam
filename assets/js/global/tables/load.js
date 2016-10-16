//Delay displaying the user table to allow footable to load
function loadPage() {
  $('#loading').css('display', 'none');
  $('#loading').css('opacity', '0');

  $('#table').css('display', 'table');
  $('#table').css('opacity', '1');
  $('#table-title').css('display', 'block');
  $('#table-title').css('opacity', '1');

}
setTimeout("loadPage()", 1000); // after 1 second