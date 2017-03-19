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
    clearAddStudentForm();
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
    cancelClicked(student_array);

}
/**
 * clearAddStudentForm - clears out the form values based on inputIds variable
 */
function clearAddStudentForm(studentName, courseName, studentGrade) {
    $(studentName).val("");
    $(courseName).val("");
    $(studentGrade).val("");
};
/**
 * calculateAverage - loop through the global student array and calculate average grade and return that value
 * @returns {number}
 */
function calculateAverage(student_array) {
    var total = 0;
    for (var i = 0; i <= student_array.length -1; i++) {
        total += student_array[i]["grade"];
    }
    var average = Math.floor(total/student_array.length);
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
    }
}

/**
 * reset - resets the application to initial state. Global variables reset, DOM get reset to initial load state
 */
function reset() {
    var student_array = [];
}


/**
 * Listen for the document to load and reset the data to the initial state
 *  */
// document.addEventListener(load, reset);