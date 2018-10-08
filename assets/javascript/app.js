// Initialize Firebase
var config = {
    apiKey: "AIzaSyCseP6NhA5U4TR979hnsA0wBxDugwbV4i4",
    authDomain: "train-scheduler-677a6.firebaseapp.com",
    databaseURL: "https://train-scheduler-677a6.firebaseio.com",
    projectId: "train-scheduler-677a6",
    storageBucket: "",
    messagingSenderId: "560504489509"
};
firebase.initializeApp(config);

// Create a variable to reference the database
var database = firebase.database();

// Initial Values
var name = "";
var dest = "";
var time = 0;
var freq = 0;

// Capture Button Click
$("#add-user").on("click", function (event) {
    event.preventDefault();

    //Read Inputs
    name = $("#name-input").val().trim();
    dest = $("#dest-input").val().trim();
    time = $("#time-input").val().trim();
    freq = $("#freq-input").val().trim();

    // Local Train Data Storage
    var newTrain = {
        name: name,
        dest: dest,
        time: time,
        freq: freq,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    };

    // Uploads train data to the database
    database.ref().push(newTrain);

    // Log input to console
    console.log(newTrain.name);
    console.log(newTrain.dest);
    console.log(newTrain.time);
    console.log(newTrain.freq);

    alert("New Train Sucessfully Added");

    // Clears all of the text-boxes
    $("#name-input").val("");
    $("#dest-input").val("");
    $("#time-input").val("");
    $("#freq-input").val("");

});

// Create Firebase event for adding train information to the database,
//and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {
        console.log(childSnapshot.val());

        // Store everything into a variable.
        var dbName = childSnapshot.val().name;
        var dbDest = childSnapshot.val().dest;
        var dbFirst = childSnapshot.val().time;
        var dbFreq = childSnapshot.val().freq;

        // Log Train Information
        console.log(dbName);
        console.log(dbDest);
        console.log(dbFirst);
        console.log(dbFreq);

        // Assumptions
        var tFrequency = dbFreq;

        // Time is 3:30 AM
        var firstTime = dbFirst;

        // First Time (pushed back 1 year to make sure it comes before current time)
        var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
        console.log(firstTimeConverted);

        // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

        // Time apart (remainder)
        var tRemainder = diffTime % tFrequency;

        // Minute Until Train
        var tMinutesTillTrain = tFrequency - tRemainder;

        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");

        // Create the new row
        var newRow = $("<tr>").append(
            $("<td>").text(dbName),
            $("<td>").text(dbDest),
            $("<td>").text(dbFreq),
            $("<td>").text(moment(nextTrain).format("h:mm a")),
            $("<td>").text(tMinutesTillTrain)
        );

        // Append the new row to the table
        $("#train-table").append(newRow);
    },
    //Handle the errors
    function (errorObject) {
        console.log("Errors handled: " + errorObject.code);

    });