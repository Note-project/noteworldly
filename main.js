/*global $ */
$(function () {

  var email = "",
      password = "",
      //remeber the user to save and retrive notes
      user = "",
      notes = [],
      cache = [],
      //set amount of results to show a one time (0 indexed)
      listLength = 9,
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
          if(data === "username taken") {
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
      $.post("http://162.243.45.239/OneNote/login.php ", noteData, function (data) {
        //check return message is not false to know if the username and password match
        if(data !== "false") {
          //get the userID number out
          var userObj = $.parseJSON(data);
          user = userObj[0].userID;
          $(".form-signin").hide();
          $(".mainArea").load("welcomePartial.html");
        } else {
          var message = "Username and Password do not match, try again. Not registered? Check the Register now box to register";
            //alert(message);
            $("#alert_placeholder").html("<div class='alert alert-danger alert-dismissable'><button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button><span>"+message+"</span></div>");
        }
      });
    }
  });

  //When the user clicks "New Note" tab, they can enter a new note
  $("#new").click(function (){
    //Checks to make sure they are logged in
    if(email !== ""){
      //change the "active" state to the current tab
      $(".container-fluid li").removeClass("active");
      $(this).addClass("active");
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
          noteData = {email: email, user: user, title: title, note: note};
      console.log(noteData);
        //send the user, userId, title, and note to the database
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
      //change the "active" state to the current tab
      $(".container-fluid li").removeClass("active");
      $(this).addClass("active");
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
        noteData= {email: email, user: user},
        //create an array to save the notes
        noteArray = [],
        //save a handle on note being edited
        editable;
    getNotes(noteData, function () {
      var i = 0;
      $.each(notes, function (key, value){
        var ellipses = "";
        //choose title to display, if none, display beginning of note
        var sideTitle = value.title !== "" ? value.title : value.note;
        //If title is more than 20 chars, only display the first 20 with an ellipses in the sidebar
        if(sideTitle.length > 20) {
          ellipses = "...";
        }
        var clippedTitle = sideTitle.substring(0,20);
        $("#index").append("<li class='list-group-item'>" + clippedTitle + ellipses + "</li>");
        noteArray.push({text: value.note, noteID: value.noteID});
        i++;
        //If there are more than set amount notes, only display that amount with button to view more
        if(i > listLength){
          $("ol li:gt(" + listLength + ")").css( "display", "none");
          $("#more").css( "display", "inline-block");
        }
      });
      $("#more").click(function(){
          viewMore();
        });
      //Get the index of menu item clicked on, and display the note with that index
      $("#index li").click(function(){
        var noteIndex = $(this).index();
        noteArea.val(noteArray[noteIndex].text);
        //dont allow for editing or clicking "Save Changes" unless edit button is clicked
        noteArea.prop("readonly", true);
        $("#saveEdit").addClass("disabled");
        editable = (noteArray[noteIndex].noteID);
      });
      //allow for editing the note
      $("#saveEdit").click(function () {
        saveEdit(editable);
      });
      $("#edit").click(function () {
        //Make not e editable, and enable button
        noteArea.prop("readonly", false);
        $("#saveEdit").removeClass("disabled");
        //TODO - write code to save updated note
      });
    });
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

  //TODO - write function for pagination to view newer notes
  function viewMore(){
    //clear the side bar to display new results
    $("ol li:lt("+listLength+1+")").css( "display", "none");
    //Display the notes from the current index up until 10 more
    $("ol li:gt("+listLength+"):lt(10)").css( "display", "block");
    listLength += 10;
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

  function saveEdit(editable){
    //check that a note has been selected
    if(!editable){
      alert("Choose a note to edit");
    } else {
      var noteArea = $("#viewNote"),
          //titleArea = $("#noteName"),
          //title = titleArea.val(),
          note = noteArea.val(),
          noteData = {email: email, noteID: editable, note: note};
      console.log(noteData);
      //send the user, noteId, title, and note to the database
      $.post("http://162.243.45.239/OneNote/recieveNotes.php ", noteData, function (data) {
          console.log(data);
          //display the result
          $("#result").html(data).delay(4000).fadeOut();
          //set fag false so display notes does not read from the cache
          flag =false;
      });
    }
  }

});