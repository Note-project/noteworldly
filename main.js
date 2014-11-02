/*global $ */
$(function () {

	$('#submit').click(function () {
			//$.post("getUser.php", {name: userName}, function (data) {
	        console.log("success");

	    //});
	});


		file = '';
    $.getJSON(file, function(data) {
    		console.log(data);
    });
});
