/*global $ */
$(function () {

	var email = "",
			password = "",
			notes = [],
			cache = [],
			flag = true;

	$("#submit").click(function () {
		email = $("#id").val();
		password = $("#pswrd").val();
		var noteData = {email: email , password : password};
		if($("#register").is(":checked")){
			$.post("http://162.243.45.239/OneNote/registration.php ", noteData, function (data) {
	        console.log(data);
	        if(data !== "mail@aryehcaplan.comtestfalse") {
	        	var message = "Username is not available. Try another name. Already registered? Uncheck the Register now box and try again";
	        	//alert(message);
	        	$("#alert_placeholder").html('<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><span>'+message+'</span></div>');
	        } else {
	        		$(".form-signin").hide();
    					$(".mainArea").load("welcomePartial.html");
	        }
	    });
		} else {
			//send the username and password to see if they match, and process the return value
			//for now, it just dumps the user in.
			$(".form-signin").hide();
    	$(".mainArea").load("welcomePartial.html");
		}
	});

	$("#new").click(function (){
		if(email !== ""){
			$(".mainArea").load("newPartial.html", function() {
				$("#noteName").focus();
				saveNote();
			});
		} else {
			alert("You must sign in first");
		}
	});

	function saveNote() {
		$("#save").click(function () {
			var noteArea = $("#newNote"),
					titleArea = $("#noteName"),
					title = titleArea.val(),
					note = noteArea.val(),
					noteData = {email: email, title: title, note: note};
			console.log(noteData);
				$.post("http://162.243.45.239/OneNote/recieveNotes.php ", noteData, function (data) {
		        console.log(data);
		        flag =false;
		    });
		});
	}

	$("#view").click(function (){
		if(email !== ""){
			$(".mainArea").load("viewPartial.html", function() {
				viewNote();
			});
		} else {
			alert("You must sign in first");
		}
	});

	function viewNote() {
		var noteArea = $("#viewNote"),
				noteData= {email: email},
				noteArray = [];
		getNotes(noteData, function () {
	   	$.each(notes, function (key, value){
	   		var ellipses = "";
	   		if(value.note.length > 20) {
	   			ellipses = "...";
	   		}
	   		var clippedNote = value.note.substring(0,20);
	   		$("#index").append("<li class='list-group-item'>" + clippedNote + ellipses + "</li>");
	   		noteArray.push(value.note);
	       	});
	       	$("#index li").click(function(){
					  var noteIndex = $(this).index();
	       		noteArea.val(noteArray[noteIndex]);
					});
		    $("#edit").click(function () {
		    	//Do something with the note
			});
    });
	}

	function getNotes (noteData, cb) {
		if(cache.length !== 0 && flag === true){
			notes = cache;
			cb(notes);
		} else {
			$.post("http://162.243.45.239/OneNote/retrieveNotes.php ", noteData, function (data) {
	      notes = $.parseJSON(data);
				cache = notes;
				cb(notes);
			});
		}
		flag = true;
	}


		var file = "";
    $.getJSON(file, function(data) {
    		console.log(data);
    });
});
