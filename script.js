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
 * @name - cancelClicked - Event Handler when user clicks the cancel button, should clear out student form
 */
function cancelClicked() {
    clearAddStudentForm($("#studentName"),$("#course"),$("#studentGrade"));
};

/**
 * @name - addStudent - creates a student objects based on input fields in the form and adds the object to global student array
 * @return undefined
 */
function addStudent() {
    let student = {
        "name": $("#studentName").val(),
        "course_name": $("#course").val(),
        "grade": $("#studentGrade").val()
    };

    let nameFeedback = $("<div class='nameFeedback'>").addClass("form-control-feedback").text("Names must be at least two (2) characters long");
    let courseFeedback = $("<div class='courseFeedback'>").addClass("form-control-feedback").text("Valid course names are less than twenty (20) characters and contain at least one letter");
    let gradeFeedback = $("<div class='gradeFeedback'>").addClass("form-control-feedback").text("Whole numbers between 0-100 only");
    if (student.name === '' && student.course_name === '' && student.grade === '') {

        // Warn the user about empty fields
        $("#studentNameDiv").addClass('has-warning');
        $("#studentNameDiv").append(nameFeedback);
        //Warn the user about empty course fields
        $("#studentCourseDiv").addClass('has-warning');
        $("#studentCourseDiv").append(courseFeedback);

        $("#studentGradeDiv").addClass('has-warning');
        $("#studentGradeDiv").append(gradeFeedback);

    }
    if (student.name !== '' && student.course_name !== '' && student.grade !== '') {
        if (student.name.length >= 2 && (student.course_name.length > 0 && student.course_name.length <= 20) && (parseInt(student.grade) >= 0 && parseInt(student.grade) <= 100)) {
            student_array.push(student);
            clearAddStudentForm($("#studentName"), $("#course"), $("#studentGrade"));
            writeDataToServer(student);
        } else {
            if (student.course_name.length > 20) {
                $("#studentCourseDiv").addClass('has-warning');
            }
            if (parseInt(student.grade) > 100) {
                $("#studentGradeDiv").addClass('has-warning');
            }
        }
    }

}
/**
 * @name - clearAddStudentForm - clears out the form values based on inputIds variable
 */
function clearAddStudentForm(studentName, courseName, studentGrade) {
    $(studentName).val("");
    $(courseName).val("");
    $(studentGrade).val("");
    $("#studentNameDiv").removeClass('has-danger');
    $("#studentNameDiv").removeClass('has-warning');

    $("#studentCourseDiv").removeClass("has-danger");
    $("#studentCourseDiv").removeClass("has-warning");

    $("#studentGradeDiv").removeClass("has-danger");
    $("#studentGradeDiv").removeClass("has-warning");

    $("#studentNameDiv").removeClass('has-success');
    $("#studentGradeDiv").removeClass("has-success");
    $("#studentCourseDiv").removeClass("has-success");

    $(".nameFeedback").remove();
    $(".gradeFeedback").remove();
    $(".courseFeedback").remove();
}
/**
 * @name - calculateAverage - loop through the global student array and calculate average grade and return that value
 * @returns {string | number} => string if there are no students; number if there are students
 */
function calculateAverage(student_array) {
    if (student_array.length === 0) {

        $(".avgGrade").text("0");
        return "0";
    } else {
        let total = 0;
        for (let i = 0; i <= student_array.length -1; i++) {
            total += parseFloat(student_array[i]["grade"]);
        }
        let average = Math.floor(total/student_array.length);
        $(".avgGrade").text(average);
        return average;
    }
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
 * @name - reset - resets the application to initial state. Global variables reset, DOM get reset to initial load state
 */
function reset() {
    student_array = [];
    studentName = $("#studentName").val("");
    courseName = $("#course").val("");
    studentGrade = $("#studentGrade").val("");

}
/**
 * @name - removeStudent - removes the student object from the student_array
 * @param studentInfo
 */
function removeStudent(studentInfo) {

    let studentID = student_array[studentInfo]["id"];
    deleteDataFromServer(studentID); // delete the student from the server based on the student's id; student_id: (id value) => formatting
}

/**
 * @name - removeStudentModal
 */
function removeStudentModal() {
    let indexInStudentArray = $(this).parent().parent().index(); // To know who to delete
    // Modal frame
    let modalFade = $("<div class='modal fade' id='editStudentModal' tabindex='-1' role='dialog' aria-labelledby='editStudentModalLabel' aria-hidden='true'>");
    let modalDialog = $("<div class='modal-dialog' role='document'>");
    let modalContent = $("<div>").addClass("modal-content"); // Modal content
    let modalHeader = $("<div>").addClass("modal-header"); // Modal header
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
/**
 * @name - editStudentModal
 */
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
    let modalBodyContentStudent= $("<div class='form-group' id='editNameDiv'>");
    let modalBodyContentStudentNameLabel = $("<label for='Student Name' class='form-control-label'>").text("Student Name");
    let modalBodyContentStudentName = $("<input type='text' id='name' class='form-control' onChange='nameValidation()'>").text(studentInfo.name);
    modalBodyContentStudentName.val(studentInfo.name);
    modalBodyContentStudent.append(modalBodyContentStudentNameLabel);
    modalBodyContentStudent.append(modalBodyContentStudentName);

    // Student Course input field
    let modalBodyContentCourse= $("<div class='form-group' id='courseNameDiv'>"); // Create form group
    let modalBodyContentCourseNameLabel = $("<label for='Course name' class='form-control-label'>").text("Course Name"); // Label for course
    let modalBodyContentCourseName = $("<input type='text' id='editCourse' class='form-control' onChange='courseNameValidation()'>");
    modalBodyContentCourseName.val(studentInfo.course_name);
    modalBodyContentCourse.append(modalBodyContentCourseNameLabel);
    modalBodyContentCourse.append(modalBodyContentCourseName);

    //Student Course Grade input field
    let modalBodyContentGrade = $("<div class='form-group' id='scoreDiv'>");
    let modalBodyContentGradeLabel = $("<label for='Course grade' class='form-control-label'>").text("Course Grade");
    let modalBodyContentGradeValue = $("<input type='text' id='editScore' class='form-control' onChange='gradeValidation()'>");
    modalBodyContentGradeValue.val(studentInfo.grade);
    modalBodyContentGrade.append(modalBodyContentGradeLabel);
    modalBodyContentGrade.append(modalBodyContentGradeValue);

    modalBody.append(modalBodyContentStudent);
    modalBody.append(modalBodyContentCourse);
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
        $("#studentNameDiv, #studentCourseDiv, #studentGradeDiv").removeClass("has-success");
    });
}

/**
 * @name - serverErrorModal - Modal with contextual message appears on screen following server-side error.
 * @param errorType {array}
 */

function serverErrorModal(errorType) {
    updateData([]); // Empty out the DOM by passing in an empty array. This was designed with the case of deleting the last student in mind.
    var defaultErrorMessage = "There was a problem processing your request."; // Default error message
    //errorType = response.errors array
    switch(errorType[0]) {
        case("no data"):
            var errorMessage = "Looks like the roster is empty! Add a student to explore more features"; // var instead of let because of scoping, and var instead of const because const cannot be reassigned.
            break;

        default:
            errorMessage = defaultErrorMessage; // A little redundant but explicit

    }

    // Modal frame
    let modalFade = $("<div class='modal fade' id='serverErrorModal' tabindex='-1' role='dialog' aria-labelledby='serverErrorModalLabel' aria-hidden='true'>");
    let modalDialog = $("<div class='modal-dialog' role='document'>");
    let modalContent = $("<div>").addClass("modal-content"); // Modal content
    let modalHeader = $("<div>").addClass("modal-header").text(errorMessage); // Modal header
    let modalTitle = $("<div>").addClass("modal-title");
    let closeModalButton = $("<button type='button' class='close' data-dismiss='modal' aria-label='Close'>");
    let closeModalButtonSymbol = $("<span aria-hidden='true'>").text("x");
    closeModalButton.append(closeModalButtonSymbol);

    modalHeader.append(modalTitle);
    modalHeader.append(closeModalButton);
    modalContent.append(modalHeader);
    let modalFooter = $("<div>").addClass("modal-footer"); // No content in the footer, but it gives the modal a nice shape
    modalContent.append(modalFooter);

    modalDialog.append(modalContent);
    modalFade.append(modalDialog);

    $(modalFade).modal("show");
    // When the modal hides, call the remove method to remove the modal from the DOM
    $(modalFade).on('hidden.bs.modal',() => {
        $(modalFade).remove();
    });

}

/**
* @name - editStudent - Use information from the modal to send info to the server
* @param studentObj
 */
function editStudent(studentObj) {
    // studentObj === studentInfo, contains id of student
    let updatedInfo = {
        id: studentObj.id,
        student: $("#name").val(),
        course: $("#editCourse").val(),
        score: $("#editScore").val()
    };
    if (updatedInfo.student === '' && updatedInfo.course === '' && updatedInfo.score === '') {
        $("#editNameDiv").addClass('has-warning');
        $("#courseNameDiv").addClass('has-warning');
        $("#scoreDiv").addClass('has-warning');

    }
    if (updatedInfo.student !== '' && updatedInfo.course !== '' && updatedInfo.score !== '') {
        if ((updatedInfo.student.length > 2 && !parseInt(updatedInfo.student)) && (updatedInfo.course.length > 0 && updatedInfo.course.length <= 20) && (parseInt(updatedInfo.score) >= 0 && parseInt(updatedInfo.score) <= 100)) {
            editDataOnServer(updatedInfo);
        }
    }

}
/**
 * getDataFromServer - Get student data from the server; Notify user if no data is available
 */
function getDataFromServer() {
    // ajax call with data, dataType, method, url, and success function
    $.ajax({
        url: "data.php?action=readAll",
        dataType: "json",
        method: "GET",
        success: function (response) {
            (response.success) ? (updateData(response.data)) : (serverErrorModal(response.errors)); // response.data is an array of objects)


        },
        error: (response) => {
            serverErrorModal(["uh oh"]); // In case of error, show a generic something was wrong modal
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
            serverErrorModal(["uh oh"]); // In case of error, show a generic something was wrong modal
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
            serverErrorModal(["uh oh"]); // In case of error, show a generic something was wrong modal
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
            $("#studentNameDiv, #studentCourseDiv, #studentGradeDiv").removeClass("has-success"); // remove the success fields
            getDataFromServer(); // Update the dom following the edit
        },
        error: (response) => {
            serverErrorModal(["uh oh"]); // In case of error, show a generic something was wrong modal
        }
    });
}


function nameValidation() {
    const studentName = $("#studentName").val();
    const editStudentName = $("#name").val();
    const alphabeticalCharacterRegex = new RegExp('[A-z]{2,}','g'); // ascii 65 -> ascii 122; applies to name and course

    // having three inputFeedback divs is a cheap work around for the divs disappearing when trying to append
    let inputFeedback = $("<div class='nameFeedback'>").addClass("form-control-feedback");

    if (!alphabeticalCharacterRegex.test(studentName) && studentName !== '') {
        $("#studentNameDiv").addClass("has-danger");
        ($(".nameFeedback").length === 0) ? $("#studentNameDiv").append(inputFeedback.text("Names must contain at least two (2) characters")) : (''); // Ternary to only append once
        return;
    } else {
        $(".nameFeedback").remove();
        $("#studentNameDiv").removeClass("has-danger");
        $("#studentNameDiv").removeClass("has-warning");
        $("#studentNameDiv").addClass("has-success");
    }
    if (!alphabeticalCharacterRegex.test(editStudentName) && editStudentName !== '') {
        $("#editNameDiv").addClass("has-danger");
        $("#editNameDiv").append(inputFeedback.text("Letters only, please"));
    } else {
        $(".nameFeedback").remove();
        $("#editNameDiv").removeClass("has-danger");
        $("#editNameDiv").removeClass("has-warning");
        $("#editNameDiv").addClass("has-success");
    }

}

function courseNameValidation() {
    const alphabeticalCharacterRegex = new RegExp('[A-z]','g'); // ascii 65 -> ascii 122; applies to name and course
    let inputFeedback2 = $("<div class='courseFeedback'>").addClass("form-control-feedback");
    const courseName = $("#course").val();
    const editCourseName = $("#editCourse").val();

    // course name is not empty, and the field is not just empty;
    if ((!alphabeticalCharacterRegex.test(courseName) && courseName !== '') || courseName.length > 20) {

        $("#studentCourseDiv").addClass("has-danger");
        ($('.courseFeedback').length === 0) ? $("#studentCourseDiv").append(inputFeedback2.text("Valid course names are less than twenty (20) characters and contain at least one letter")) : ('');
        return;
    } else {
        $(".courseFeedback").remove(); // Remove the feed back text
        $("#studentCourseDiv").removeClass("has-danger"); // Remove danger highlight
        $("#studentCourseDiv").removeClass("has-warning"); // Remove warning highlight
        (courseName !== '') ? $("#studentCourseDiv").addClass("has-success") : $("#studentCourseDiv").removeClass("has-success"); // Add success only if the field is not empty
    }
    // edit course name modal
    // editCourseName !== undefined to prevent checking .length of undefined. Quick and dirty way
    if ((!alphabeticalCharacterRegex.test(editCourseName) && editCourseName !== '') || (editCourseName !== undefined ? editCourseName.length > 20 : '')) {
        $("#courseNameDiv").addClass("has-danger");
        ($('.courseFeedback').length === 0) ? $("#courseNameDiv").append(inputFeedback2.text("Valid course names are less than twenty (20) characters and contain at least one letter")) : ('');
    } else {
        $(".courseFeedback").remove();
        $("#courseNameDiv").removeClass("has-danger");
        $("#courseNameDiv").removeClass("has-warning");
        $("#courseNameDiv").addClass("has-success");
    }
}

function gradeValidation() {
    let inputFeedback3 = $("<div class='gradeFeedback'>").addClass("form-control-feedback");
    const gradeRegex = new RegExp('[0-9]', 'g'); // numbers only for course
    const grade = $("#studentGrade").val();
    const score = $("#editScore").val();
    // if the grade contains at least
    if ((!gradeRegex.test(grade) && grade !== '') || grade.length > 3 || (parseInt(grade) > 100 || parseInt(grade) < 0)) {
        $("#studentGradeDiv").addClass("has-danger");
        ($('.gradeFeedback').length === 0) ? $("#studentGradeDiv").append(inputFeedback3.text("Whole numbers between 0-100 only")) : ('');
        return;
    } else {
        $(".gradeFeedback").remove();
        $("#studentGradeDiv").removeClass("has-danger");
        $("#studentGradeDiv").removeClass("has-warning");
        $("#studentGradeDiv").addClass("has-success");
    }
    if (!gradeRegex.test(score) && score !== '' || score.length > 3 || (parseInt(score) > 100 || parseInt(score) < 0)) {
        $("#scoreDiv").addClass("has-danger");
        $("#scoreDiv").append(inputFeedback3.text("Whole numbers between 0-100 only"));
    } else {
        $(".gradeFeedback").remove();
        $("#scoreDiv").removeClass("has-danger");
        $("#scoreDiv").removeClass("has-warning");
        $("#scoreDiv").addClass("has-success");
    }
}




$(document).ready(function(){
    $("#studentName").on("change", nameValidation);
    $("#course").on("change", courseNameValidation);
    $("#studentGrade").on("change",gradeValidation);
    getDataFromServer(); // Get data from server as soon as page loads
    // Modal input event handlers are added inline
});



