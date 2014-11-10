/*global $ */
$(function () {

	$('#submit').click(function () {
		var note = "This is a note";
		var noteData= {email: $('#id').val() , note : note};
		console.log(noteData);
			$.post("http://162.243.45.239/OneNote/recieveNotes.php ", noteData, function (data) {
	        console.log("success");
	        $('.form-signin').hide();
	        $(".mainArea").load("welcomePartial.html");
	    });
	});

	$("#new").click(function (){
		$(".mainArea").load("newPartial.html");
		setTimeout(function() {
		 $("#noteName").focus();
		}, 80);
	})


		var file = '';
    $.getJSON(file, function(data) {
    		console.log(data);
    });
});
