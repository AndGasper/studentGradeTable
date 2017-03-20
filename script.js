/**
 * Define all global variables here
//  */
// var studentName = null;
// var courseName = null;
// var studentGrade = null;

/**
 * student_array - global array to hold student objects
 * @type {Array}
 */
var student_array = [];

/**
 * inputIds - id's of the elements that are used to add students
 * @type {string[]}
 */
var studentName = $("#studentName").val();
var courseName = $("#course").val();
var studentGrade = $("#studentGrade").val();

/**
 * addClicked = Event Handler when user clicks the add button, should a
 */
function addClicked() {
    addStudent();
};
/**
 * cancelClicked - Event Handler when user clicks the cancel button, should clear out student form
 */
function cancelClicked() {
    clearAddStudentForm($("#studentName"),$("#course"),$("#studentGrade"));
};

/**
 * addStudent - creates a student objects based on input fields in the form and adds the object to global student array
 *
 * @return undefined
 */
function addStudent() {
    var student = {
        "name": $("#studentName").val(),
        "course": $("#course").val(),
        "grade": $("#studentGrade").val()
    };
    student_array.push(student);
    updateData(student_array);
    addStudentToDom(student_array);
    clearAddStudentForm($("#studentName"),$("#course"),$("#studentGrade"));

}
/**
 * clearAddStudentForm - clears out the form values based on inputIds variable
 */
function clearAddStudentForm(studentName, courseName, studentGrade) {
    $(studentName).val("");
    $(courseName).val("");
    $(studentGrade).val("");
}
/**
 * calculateAverage - loop through the global student array and calculate average grade and return that value
 * @returns {number}
 */
function calculateAverage(student_array) {
    var total = 0;
    for (var i = 0; i <= student_array[0].length -1; i++) {
        total += student_array[0][i]["grade"];
    }
    var average = Math.floor(total/student_array[0].length);
    $(".avgGrade").text(average);
    return average;
}
/**
 * updateData - centralized function to update the average and call student list update
 */
function updateData(student_array) {
    updateStudentList(student_array);
    calculateAverage(student_array);
}

/**
 * updateStudentList - loops through global student array and appends each objects data into the student-list-container > list-body
 */
function updateStudentList(student_array) {
    var studentKeys = ["name","course", "grade"];
    for (var i = 0; i < student_array.length; i++) {
        for (var j = 0; j < studentKeys.length; j++) {
            $(student_array[i][studentKeys[j]]).appendTo("student-list-container > list-body");
        }
    }
}
/**
 * addStudentToDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list tbody
 * @param studentObj
 */
function addStudentToDom(student_array) {
    var keys = ["name", "course", "grade"];
    for (var i = 0; i < student_array.length; i++) {
        var studentRow = $("<tr>");
        for (var j = 0; j < keys.length; j++) {
            var td = $("<td>");
            var studentInfo = student_array[i][keys[j]];
            td.append(studentInfo);
            studentRow.append(td);
        }
        $(".studentListTable").append(studentRow);
        var deleteButton = $("<button>").addClass("btn btn-danger").text("Delete");
        deleteButton.on("click",removeStudentFromList);
        deleteButton.on("click", removeStudentFromDom);
        studentRow.append(deleteButton); // The formatting could use a little work
    }
}
// function addStudentToDom(student_array) {
//     var keys = ["name", "course","grade"];
//     for (var i = student_array.length-1; i >= student_array.length-1; i--) {
//         var studentRow = $("<tr>");
//         for (var j = 0; j < keys.length; j++) {
//             var td = $("<td>");
//             var studentInfo = student_array[i][keys[j]];
//             td.append(studentInfo);
//             studentRow.append(td);
//         }
//         $(".studentListTable").append(studentRow);
//         var deleteButton = $("<button>").addClass("btn btn-danger").text("Delete");
//         deleteButton.on("click",removeStudentFromList);
//         deleteButton.on("click", removeStudentFromDom);
//         studentRow.append(deleteButton); // The formatting could use a little work
//     }
// }

/**
 * reset - resets the application to initial state. Global variables reset, DOM get reset to initial load state
 */
function reset() {
    student_array = [];
    studentName = $("#studentName").val("");
    courseName = $("#course").val("");
    studentGrade = $("#studentGrade").val("");
}


/**
 * Listen for the document to load and reset the data to the initial state
 *  */
// document.addEventListener(load, reset);

/**
 * removeStudent function that removes the object in the student_array
 * @param studentObj
 */

function removeStudentFromDom() {

    // console.log("Who is this?", this); // this = <button>
    // console.log("Who is my parent row?");
    //console.log($(this).parent()[0]); // $(this).parent()[0] removes that entire row. The [0] index is the table row
    // console.log("Am I the index?", $(this).parent().index()); // Index of the row in the table for removing from student array
    student_array[0].splice($(this).parent().index(),1); // Removes the student object entry from the student array
    $(this).parent()[0].remove();
    // console.log(student_array);


}

function removeStudentFromList() {
    console.log("removeStudentFromList function");
    console.log("Who is this", this);
}

function getDataFromServer() {
    var dataObject = {
        api_key: "S5S9V7Xmy7"
    };
    console.log("test");
    $.ajax({
        data: dataObject,
        dataType: "json",
        method: "POST",
        url: "http://s-apis.learningfuze.com/sgt/get",
        success: function (response) {
            console.log("Test!");
            //updateData(response["data"]);
            addStudentToDom(response["data"]);
            student_array.push(response["data"]);
            updateData(student_array);
        }
    });
}