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
    if (student.name !== '' && student.course_name !== '' && student.grade !== '') {
        student_array.push(student);
        clearAddStudentForm($("#studentName"),$("#course"),$("#studentGrade"));
        writeDataToServer(student);
    }


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
 * @params - student_array (an array of objects; [{id: , name: , course: , grade: }])
 */
function updateData(arrayOfStudentObj) {
    student_array = []; // Empty out the student array before adding to it again
    for (let i = 0; i < arrayOfStudentObj.length; i++) {
    student_array.push(arrayOfStudentObj[i]);
    }
    calculateAverage(student_array);
    addStudentToDom(student_array);
}

/**
 * updateStudentList - loops through global student array and appends each objects data into the student-list-container > list-body
 */

/**
 * addStudentToDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list tbody
 * @param student_array (an array of objects)
 */
function addStudentToDom(student_array) {
    $(".studentListTable").empty(); // Empty out the table
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
        let operationsRow = $("<td class='btn-group-vertical'>");
        operationsRow.css("border-top", "none");
        let deleteButton = $("<button>").addClass("btn btn-outline-danger").text("REMOVE");
        let editButton = $("<button type='button' class='btn btn-outline-primary' data-toggle='modal' data-target='editStudentModal'>");
        editButton.css("marginRight", "1em");
        editButton.text("Edit");
        deleteButton.on("click", removeStudentModal);
        editButton.on("click", editStudentModal);
        operationsRow.append(editButton);
        operationsRow.append(deleteButton); // The formatting could use a little work
        studentRow.append(operationsRow);

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

function removeStudent(studentInfo) {

    let studentID = student_array[studentInfo]["id"];
    deleteDataFromServer(studentID); // delete the student from the server based on the student's id; student_id: (id value) => formatting
}

function removeStudentModal() {
    let indexInStudentArray = $(this).parent().parent().index(); // To know who to delete
    // Modal frame
    let modalFade = $("<div class='modal fade' id='editStudentModal' tabindex='-1' role='dialog' aria-labelledby='editStudentModalLabel' aria-hidden='true'>");
    let modalDialog = $("<div class='modal-dialog' role='document'>");
    let modalContent = $("<div>").addClass("modal-content");
    let modalHeader = $("<div>").addClass("modal-header");// .text("Modal Header");
    let modalTitle = $("<div>").addClass("modal-title").text("Are you sure you want to remove this student?");
    let closeModalButton = $("<button type='button' class='close' data-dismiss='modal' aria-label='Close'>");
    let closeModalButtonSymbol = $("<span aria-hidden='true'>").text("x");
    closeModalButton.append(closeModalButtonSymbol);

    modalHeader.append(modalTitle);
    modalHeader.append(closeModalButton);
    modalContent.append(modalHeader);


    let modalFooter = $("<div>").addClass("modal-footer");
    let cancelDeleteButton = $("<button class='btn btn-secondary' data-dismiss='modal'>");
    cancelDeleteButton.text("Cancel");
    let confirmDeleteButton= $("<button class='btn btn-danger' data-dismiss='modal'>");

    confirmDeleteButton.on("click", () => {
        removeStudent(indexInStudentArray);
    }); // Anonymous function to avoid firing as soon as modal loads
    confirmDeleteButton.text("REMOVE");
    modalFooter.append(cancelDeleteButton);
    modalFooter.append(confirmDeleteButton);
    modalContent.append(modalFooter);

    modalDialog.append(modalContent);
    modalFade.append(modalDialog);

    $(modalFade).modal("show");
    // When the modal hides, call the remove method to remove the modal from the DOM
    $(modalFade).on('hidden.bs.modal',() => {
        $(modalFade).remove();
    });
}

function editStudentModal() {

    let studentInfo = student_array[$(this).parent().parent().index()];

    // Modal form
    // Modal frame
    let modalFade = $("<div class='modal fade' id='editStudentModal' tabindex='-1' role='dialog' aria-labelledby='editStudentModalLabel' aria-hidden='true'>");
    let modalDialog = $("<div class='modal-dialog' role='document'>");
    let modalContent = $("<div>").addClass("modal-content");
    let modalHeader = $("<div>").addClass("modal-header");// .text("Modal Header");
    let modalTitle = $("<div>").addClass("modal-title").text("Edit Student");
    let closeModalButton = $("<button type='button' class='close' data-dismiss='modal' aria-label='Close'>");
    let closeModalButtonSymbol = $("<span aria-hidden='true'>").text("x");
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

    confirmEditButton.on("click", () => {
        editStudent(studentInfo);
    }); // Anonymous function to avoid firing as soon as modal loads
    confirmEditButton.text("Confirm Edit");
    modalFooter.append(cancelEditButton);
    modalFooter.append(confirmEditButton);
    modalContent.append(modalFooter);

    modalDialog.append(modalContent);
    modalFade.append(modalDialog);

    $(modalFade).modal("show");
    // When the modal hides, call the remove method to remove the modal from the DOM which clears the form after use
    $(modalFade).on('hidden.bs.modal',() => {
       $(modalFade).remove();
    });
}

/**
* editStudent - Use information from the modal to send info to the server
* @param studentObj
 */
function editStudent(studentObj) {
    // studentObj === studentInfo, contains id of student
    // updateData(student_array);
    let updatedInfo = {
        id: studentObj.id,
        student: $("#name").val(),
        course: $("#class").val(),
        score: $("#score").val()
    };
    editDataOnServer(updatedInfo);
    // updatedInfo = null;

}
/**
 * getDataFromServer - Get student daa from the server
 */
function getDataFromServer() {
    // ajax call with data, dataType, method, url, and success function
    $.ajax({
        url: "data.php?action=readAll",
        dataType: "json",
        method: "GET",
        success: function (response) {
            updateData(response.data); // response.data is an array of objects
            // If updateData was not used here, how else would data hit the rest of the program?
        },
        error: (response) => {
        }
    });
}

function writeDataToServer(student) {
    // studentObj contains name, course, and grade
    $.ajax({
        data: student,
        dataType: "json",
        method: "POST",
        url: "data.php?action=insert",
        success: function(response) {
            if (response.success === true) {
                student.id = response.insertID; // give the student an ID
                getDataFromServer(); // after inserting a student, make a call to the server to get the student list
            }
        },
        error: function(response) {
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
            getDataFromServer(); // Following the deletion, DOM needs to be updated
        },

        error: function(response) {
        }
    });
}

function editDataOnServer(studentObj) {
    $.ajax({
        data: studentObj,
        dataType: "json",
        method: "POST",
        url: "data.php?action=update",
        success: (response) => {
            getDataFromServer(); // Update the dom following the edit
        },
        error: (response) => {
        }
    });
}

