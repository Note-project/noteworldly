/*global $ */
$(function () {

	var email = "",
			password = "",
			notes = [],
			cache = [],
			//set flag to use cache if no new notes where added
			flag = true;

	//Login and registration
	$("#submit").click(function () {
		email = $("#id").val();
		password = $("#pswrd").val();
		var noteData = {email: email , password : password};
		//Registration
		if($("#register").is(":checked")){
			$.post("http://162.243.45.239/OneNote/registration.php ", noteData, function (data) {
	        console.log(data);
	        //check return message to know if the username is valid
	        if(data === "mail@aryehcaplan.comtestfalse") { // <--this is just some junk for testing
	        	var message = "Username is not available. Try another name. Already registered? Uncheck the Register now box and try again";
	        	//alert(message);
	        	$("#alert_placeholder").html("<div class='alert alert-danger alert-dismissable'><button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button><span>"+message+"</span></div>");
	        } else {
	        		$(".form-signin").hide();
    					$(".mainArea").load("welcomePartial.html");
	        }
	    });
	    //Login
		} else {
			//send the username and password to see if they match, and process the return value
			//for now, it just dumps the user in.
			$(".form-signin").hide();
    	$(".mainArea").load("welcomePartial.html");
		}
	});

	//When th euser clicks "New Note" tab, they can enter a new note
	$("#new").click(function (){
		//Checks to make sure they are logged in
		if(email !== ""){
			//loads the veiw for entering a note
			$(".mainArea").load("newPartial.html", function() {
				$("#noteName").focus();
				//save note to db
				saveNote();
			});
		} else {
			//If user is not logged in
			alert("You must sign in first");
		}
	});

	//Saves a new note to the database
	function saveNote() {
		$("#save").click(function () {
			var noteArea = $("#newNote"),
					titleArea = $("#noteName"),
					title = titleArea.val(),
					note = noteArea.val(),
					noteData = {email: email, title: title, note: note};
			console.log(noteData);
				//send the user, title, and note to the database
				$.post("http://162.243.45.239/OneNote/recieveNotes.php ", noteData, function (data) {
		        console.log(data);
		        //set fag false so display notes does not read from the cache
		        flag =false;
		    });
		    // Clear the "new note" and "note title" fields
		    noteArea.val("");
		    titleArea.val("");
		});
	}

	//When the user clicks the "View Notes" button, they can choose a note to view
	$("#view").click(function (){
		//Checks to make sure they are logged in
		if(email !== ""){
			//loads the veiw for entering a note
			$(".mainArea").load("viewPartial.html", function() {
				viewNote();
			});
		} else {
			//If user is not logged in
			alert("You must sign in first");
		}
	});

	//Displays a list of notes
	function viewNote() {
		var noteArea = $("#viewNote"),
				noteData= {email: email},
				//create an array to save the notes
				noteArray = [];
		getNotes(noteData, function () {
			var i = 0;
	   	$.each(notes, function (key, value){
	   		var ellipses = "";
	   		//If note is more than 20 chars, only display the first 20 with an ellipses in the sidebar
	   		if(value.note.length > 20) {
	   			ellipses = "...";
	   		}
	   		var clippedNote = value.note.substring(0,20);
	   		$("#index").append("<li class='list-group-item'>" + clippedNote + ellipses + "</li>");
	   		noteArray.push(value.note);
	   		i++;
	   		//If there are more than 10 notes, only display first 10 with button to view more
	   		if(i > 9){
	   			$("#index").append("<button class='btn btn-lg' type='button' id='more'>View older</button>");
	   			$("#more").click(function(){
	   				//clear the side bar to display new results
	   				$("#index").empty();
	   				//Display the notes from the current index until 10 more, or the end,whatever is less
	   				var index = i,
	   				    end = notes.length,
	   				    group = end > index + 10 ? index + 10 : end;
	   				displayMore(index, group);
	   			});
	   			//break out of the .each()
	   			return false;
	   		}
	       	});
					//Get the index of menu item clicked on, and display the note with that index
	       	$("#index li").click(function(){
					  var noteIndex = $(this).index();
	       		noteArea.val(noteArray[noteIndex]);
					});
					//TODO - allow for editing the note
		    $("#edit").click(function () {
		    	//Do something with the note
			});
    });
	}
	//TODO - write function for pagination
	function displayMore(index, group){
		alert("display notes from number " + index + " until " + group + " somehow");
	}

	//Get notes from cach, or from database if they have been modified
	function getNotes (noteData, cb) {
		if(cache.length !== 0 && flag === true){
			notes = cache;
			cb(notes);
		} else {
			$.post("http://162.243.45.239/OneNote/retrieveNotes.php ", noteData, function (data) {
	      notes = $.parseJSON(data);
	      //Call a function to reverse the array so that the most recent notes come up first
				reverseArray(notes, function(reversed){
					notes = reversed;
					//save the notes in the cache
					cache = notes;
					cb(notes);
				});
			});
		}
		//reset flag to signify that the cach has the latest data
		flag = true;
	}

	//A function to reverse an array
	function reverseArray (array, cb){
		var newArray = [],
				temp,
				number = array.length;
		for(var i =0; i < number; i++){
			temp = array.pop();
			newArray.push(temp);
		}
		cb(newArray);
	}

});