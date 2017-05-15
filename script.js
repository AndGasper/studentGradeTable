/**
 * student_array - global array to hold student objects
 * @type {Array}
 */
let student_array = [];

/**
 * inputIds - id's of the elements that are used to add students
 * @type {string[]}
 */
let studentName = $("#studentName").val();
let courseName = $("#course").val();
let studentGrade = $("#studentGrade").val();

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
    let student = {
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
    let total = 0;
    for (let i = 0; i <= student_array.length -1; i++) {
        total += parseFloat(student_array[i]["grade"]);
    }
    let average = Math.floor(total/student_array.length);
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
 * removeStudent function that removes the object in the student_array
 */

function removeStudent() {
    let indexInStudentArray = $(this).parent().index();
    let studentID = student_array[indexInStudentArray]["id"];
    student_array.splice($(this).parent().index(),1); // Removes the student object entry from the student array
    $(this).parent()[0].remove(); // Removes the student row from the table
    updateData(student_array); // update the data
    deleteDataFromServer(studentID); // delete the student from the server based on the student's id; student_id: (id value) => formatting
}
function editStudentModal() {

    let studentInfo = student_array[$(this).parent().index()];


    // Modal form

    // Modal frame
    let modalFade = $("<div class='modal fade' id='editStudentModal' tabindex='-1' role='dialog' aria-labelledby='editStudentModalLabel' aria-hidden='true'>");
    let modalDialog = $("<div class='modal-dialog' role='document'>");
    let modalContent = $("<div>").addClass("modal-content");
    let modalHeader = $("<div>").addClass("modal-header");// .text("Modal Header");
    let modalTitle = $("<div>").addClass("modal-title").text("Edit Student");
    let closeModalButton = $("<button type='button' class='close' data-dismiss='modal' aria-label='Close'>");
    let closeModalButtonSymbol = $("<span aria-hidden='true'>").text("&times;");
    closeModalButton.append(closeModalButtonSymbol);

    modalHeader.append(modalTitle);
    modalHeader.append(closeModalButton);
    modalContent.append(modalHeader);

    let modalBody = $("<form>").addClass("modal-body");

    // Student name input field
    let modalBodyContentStudent= $("<div class='form-group'>");
    let modalBodyContentStudentNameLabel = $("<label for='Student Name' class='form-control-label'>").text("Student Name");
    let modalBodyContentStudentName = $("<input type='text' id='name' class='form-control'>").text(studentInfo.name);
    modalBodyContentStudentName.val(studentInfo.name);
    modalBodyContentStudent.append(modalBodyContentStudentNameLabel);
    modalBodyContentStudent.append(modalBodyContentStudentName);

    // Student Course input field
    let modalBodyContentCourse= $("<div class='form-group'>");
    let modalBodyContentCourseNameLabel = $("<label for='Course name' class='form-control-label'>").text("Course Name");
    let modalBodyContentCourseName = $("<input type='text' id='class' class='form-control'>");
    modalBodyContentCourseName.val(studentInfo.course_name);
    modalBodyContentCourse.append(modalBodyContentCourseNameLabel);
    modalBodyContentCourse.append(modalBodyContentCourse);

    //Student Course Grade input field
    let modalBodyContentGrade = $("<div class='form-group'>");
    let modalBodyContentGradeLabel = $("<label for='Course grade' class='form-control-label'>").text("Course Grade");
    let modalBodyContentGradeValue = $("<input type='text' id='score' class='form-control'>");
    modalBodyContentGradeValue.val(studentInfo.grade);
    modalBodyContentGrade.append(modalBodyContentGradeLabel);
    modalBodyContentGrade.append(modalBodyContentGradeValue);

    modalBody.append(modalBodyContentStudent);
    modalBody.append(modalBodyContentCourseName);
    modalBody.append(modalBodyContentGrade);
    modalContent.append(modalBody);

    let modalFooter = $("<div>").addClass("modal-footer");
    let cancelEditButton = $("<button class='btn btn-secondary' data-dismiss='modal'>");
    cancelEditButton.text("Cancel");
    let confirmEditButton = $("<button  class='btn btn-primary' data-dismiss='modal'>");

    confirmEditButton.on("click", () => {editStudent(studentInfo)}); // Anonymous function to avoid firing as soon as modal loads
    confirmEditButton.text("Confirm Edit");
    modalFooter.append(cancelEditButton);
    modalFooter.append(confirmEditButton);
    modalContent.append(modalFooter);

    modalDialog.append(modalContent);
    modalFade.append(modalDialog);

    $(modalFade).modal("show");
}
/**
* editStudent - Use information from the modal to send info to the server
* @param studentObj
 */
function editStudent(studentObj) {
    // studentObj === studentInfo, contains id of student
    updateData(student_array);
    editDataOnServer(studentObj);
}
/**
 * getDataFromServer - Get student daa from the server
 */
function getDataFromServer() {
    // ajax call with data, dataType, method, url, and success function
    $.ajax({
        //data: dataObject,
        url: "data.php?action=readAll",
        dataType: "json",
        method: "GET",
        // url: "http://s-apis.learningfuze.com/sgt/get", // /get is the one for reading data from the server

        success: function (response) {

            addStudentToDom(response["data"]); // response["data"] gets the array with all the people in it
            for (let i = 0; i < response["data"].length; i++) {
                student_array.push(response["data"][i]);
            }
            updateData(student_array);
        },
        error: (response) => {
            console.log("Error");
            console.log(response);
        }
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
        url: "data.php?action=insert",
        success: function(response) {
            student.id = response["new_id"];
        }
    });
}

function deleteDataFromServer(studentID) {
    let dataObject = {
        "id": studentID
    };
    $.ajax({
        data: dataObject,
        dataType: "json",
        method: "POST",
        url: "data.php?action=delete",
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
    console.log("editDataOnServer(studentObj) studentObj", studentObj);
    let updatedStudentInfo = {
        "id": studentObj.id,
        "name": $('#name').val(),
        "course_name": $('#class').val(),
        "grade": $('#score').val()
    };
    console.log("updatedStudentInfo", updatedStudentInfo);
    $.ajax({
        data: {
            'id': studentObj.id,
            'student': updatedStudentInfo.name,
            'course': updatedStudentInfo.course_name,
            'score': updatedStudentInfo.grade,
        },
        dataType: "json",
        method: "POST",
        url: "data.php?action=update",
        success: (response) => {
            console.log("success response", response);
        },
        error: (response) => {
            console.log(response);
        }
    });
}

