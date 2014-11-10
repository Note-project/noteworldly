/*global $ */
$(function () {

	var email = '',
			notes = [];

	$('#submit').click(function () {
		email = $('#id').val();
    $('.form-signin').hide();
    $(".mainArea").load("welcomePartial.html");
	});

	$("#new").click(function (){
		if(email != ""){
			$(".mainArea").load("newPartial.html", function() {
				$("#noteName").focus();
				saveNote();
			});
		} else {
			alert("You must use a valid email address");
		}
	});

	function saveNote() {
		$('#save').click(function () {
			var noteArea = $('#newNote');
			var note = noteArea.val();
			var noteData= {email: email , note : note};
			console.log(noteData);
				$.post("http://162.243.45.239/OneNote/recieveNotes.php ", noteData, function (data) {
		        console.log("success");
		        //noteArea.val() = "";
		    });
		});
	};

	$("#view").click(function (){
		if(email != ""){
			$(".mainArea").load("viewPartial.html", function() {
				viewNote();
			});
		} else {
			alert("You must use a valid email address");
		}
	});

	function viewNote() {
		var noteArea = $('#viewNote');
		var noteData= {email: email};
		var allNotes ='';
		var noteArray = [];
		console.log(noteData);
			$.post("http://162.243.45.239/OneNote/retrieveNotes.php ", noteData, function (data) {
	        notes = $.parseJSON(data);
					var noteNumber = 1;
	       	$.each(notes, function (key, value){
	       		//allNotes = allNotes  + noteNumber++ + ". " + value.note + "\n \n";
	       		var ellipses = "";
	       		if(value.note.length > 20) {
	       			var ellipses = "...";
	       		}
	       		var clippedNote = value.note.substring(0,20);
	       		noteArray.push(value.note);
	       		$("#index").append("<li>" + clippedNote + ellipses + "</li>")
	       	});
	       	$('#index li').click(function(){
					  var noteIndex = $(this).index();
	       		noteArea.val(noteArray[noteIndex]);
					});
	    });
	    $('#edit').click(function () {
	    	//Do something with the note
		});
	};


		var file = '';
    $.getJSON(file, function(data) {
    		console.log(data);
    });
});
