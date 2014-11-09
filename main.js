/*global $ */
$(function () {

	$('#submit').click(function () {
		//var noteData = {};
		//noteData[$('#id').val()] = "This is a note";
		//console.log(noteData);
		//var email = $('#id').val(),
		var note = "This is a note";
		var noteData= {email: $('#id').val() , note : note};
		noteData = JSON.stringify(noteData);
		console.log(noteData);
			$.post("http://162.243.45.239/OneNote/recieveNotes.php ", noteData, function (data) {
	        console.log("success");
	        $('.form-signin').hide();
	    });
	});


		file = '';
    $.getJSON(file, function(data) {
    		console.log(data);
    });
});
