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
        "course_name": $("#course").val(),
        "grade": $("#studentGrade").val()
    };
    student_array.push(student);
    clearAddStudentForm($("#studentName"),$("#course"),$("#studentGrade"));
    updateData(student_array);
    writeDataToServer(student);

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
    for (var i = 0; i <= student_array.length -1; i++) {
        total += parseFloat(student_array[i]["grade"]);
    }
    var average = Math.floor(total/student_array.length);
    $(".avgGrade").text(average);
    return average;
}
/**
 * updateData - centralized function to update the average and call student list update
 */
function updateData(student_array) {
    calculateAverage(student_array);
    addStudentToDom(student_array);
}

/**
 * updateStudentList - loops through global student array and appends each objects data into the student-list-container > list-body
 */

/**
 * addStudentToDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list tbody
 * @param studentObj
 */
function addStudentToDom(student_array) {
    $(".studentListTable").empty();
    let keys = ["name", "course_name","grade"];
    for (let i = 0; i < student_array.length; i++) {
        let studentRow = $("<tr>");
        for (let j = 0; j < keys.length; j++) {
            let td = $("<td>");
            let studentInfo = student_array[i][keys[j]];
            td.append(studentInfo);
            studentRow.append(td);
        }
        $(".studentListTable").append(studentRow);
        let deleteButton = $("<button>").addClass("btn btn-danger").text("Delete");
        let editButton =$("<button type='button' class='btn btn-primary' data-toggle='modal' data-target='editStudentModal'>");
        editButton.text("Edit");
        deleteButton.on("click", removeStudent);
        editButton.on("click", editStudentModal);
        studentRow.append(editButton);
        studentRow.append(deleteButton); // The formatting could use a little work

    }
}
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

function removeStudent() {
    // console.log("Index in student_array:", indexInStudentArray);
    // console.log("student_id:", student_array[indexInStudentArray]["id"]);
    // console.log(student_array[indexInStudentArray]["name"]);
    let indexInStudentArray = $(this).parent().index();
    let studentID = student_array[indexInStudentArray]["id"];
    student_array.splice($(this).parent().index(),1); // Removes the student object entry from the student array
    $(this).parent()[0].remove(); // Removes the student row from the table
    updateData(student_array); // update the data
    deleteDataFromServer(studentID); // delete the student from the server based on the student's id; student_id: (id value) => formatting
}
function editStudentModal() {
    let modalFade = $("<div class='modal fade' id='editStudentModal' tabindex='-1' role='dialog' aria-labelledby='editStudentModalLabel' aria-hidden='true'>");
    console.log("modalFade", modalFade);
    let modalDialog = $("<div class='modal-dialog' role='document'>");
    let modalContent = $("<div>").addClass("modal-content");
    let modalHeader = $("<div>").addClass("modal-header").text("Modal Header");
    let modalTitle = $("<div>").addClass("modal-title").text("Edit Student");
    let closeModalButton = $("<button type='button' class='close' data-dismiss='modal' aria-label='Close'>");
    let closeModalButtonSymbol = $("<span aria-hidden='true'>").text("&times;");
    closeModalButton.append(closeModalButtonSymbol);

    modalHeader.append(modalTitle);
    modalHeader.append(closeModalButton);
    console.log("modal header", modalHeader);

    modalContent.append(modalHeader);

    let modalBody = $("<div>").addClass("modal-body");
    let modalBodyContent = $("<div>").text("Bleep bloop");
    modalBody.append(modalBodyContent);
    modalContent.append(modalBody);
    console.log("modal content", modalContent);

    let modalFooter = $("<div>").addClass("modal-footer");
    let cancelEditButton = $("<button class='btn btn-secondary' data-dismiss='modal'>");
    cancelEditButton.text("Cancel");
    let confirmEditButton = $("<button class='btn btn-primary' data-dismiss='modal'>");
    confirmEditButton.text("Confirm Edit");
    modalFooter.append(cancelEditButton);
    modalFooter.append(confirmEditButton);
    modalContent.append(modalFooter);

    modalDialog.append(modalContent);
    modalFade.append(modalDialog);
    console.log("modalDialog", modalDialog);
    $(modalFade).modal("show");
}
/**
* editStudent - Grab the information of the student row; student information is collected as an object with id, name, course, and grade
* @param none
 */
function editStudent() {
    //let editedStudentRow = $(this).parent().tr.cells;
    //let indexInStudentArray = $(this).parent().index();
    //let editedStudent = student_array[indexInStudentArray];
    //console.log(student_array[indexInStudentArray]);
    //$(editedStudentRow).attr("contentEditable=true");
    //updateData(student_array);
    //editDataOnServer(student_array[indexInStudentArray]);
}
/**
 * getDataFromServer - Get student daa from the server
 */
function getDataFromServer() {
    // ajax call with data, dataType, method, url, and success function
    $.ajax({
        //data: dataObject,
        url: "../prototypes_C2.17/php_SGTserver/data.php?action=readAll",
        dataType: "json",
        method: "POST",
        // url: "http://s-apis.learningfuze.com/sgt/get", // /get is the one for reading data from the server

        success: function (response) {
            console.log("Test!");
            console.log("success",response);
            //updateData(response["data"]);
            addStudentToDom(response["data"]); // response["data"] gets the array with all the people in it
            for (let i = 0; i < response["data"].length; i++) {
                student_array.push(response["data"][i]);
            }
            updateData(student_array);
        },
        // error: (response) => {
        //     console.log("error");
        //     console.log(response);
        //     console.log(url);
        // }
    });
}

function writeDataToServer(student) {
    let dataObject = {
        "name": student_array[student_array.length-1]["name"],
        "course_name": student_array[student_array.length-1]["course_name"],
        "grade": student_array[student_array.length-1]["grade"]
    };

    $.ajax({
        data: dataObject,
        dataType: "json",
        method: "POST",
        url: "../prototypes_C2.17/php_SGTserver/data.php?action=insert",
        success: function(response) {
            console.log("writeDataToServer test!");
            console.log("I was the response", response);
            console.log("new_id", response["new_id"]);
            student.id = response["new_id"];
        }
    });
}

function deleteDataFromServer(studentID) {
    console.log(studentID);
    var dataObject = {
        "id": studentID
    };
    $.ajax({
        data: dataObject,
        dataType: "json",
        method: "POST",
        url: "../prototypes_C2.17/php_SGTserver/data.php?action=delete",
        success: function(response) {
            console.log("deleteDataFromServer function");
            console.log("response",response);
        },

        error: function(response) {
            console.log("ERROR!");
            console.log(response);
        }
    });
}

function editDataOnServer(studentObj) {
    $.ajax({
        data: {
            'id': studentObj.id,
            'student': studentObj.name,
            'course': studentObj.course_name,
            'score': studentObj.grade,
        },
        dataType: "json",
        method: "POST",
        url: "../prototypes_C2.17/php_SGTserver/data.php?action=update",
        success: (response) => {
            console.log("Success!");
        },
        error: (response) => {
            console.log("error");
            console.log(response);
        }
    });
}

