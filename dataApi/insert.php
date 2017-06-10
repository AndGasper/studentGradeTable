<?php

$name = addslashes($_POST['name']);
$grade = addslashes($_POST['grade']);
$course = addslashes($_POST['course_name']);

if (ctype_space($name) || ctype_space($grade) || ctype_space($course)) {
    $output['errors'][] = 'No empty fields allowed';
}

if (empty($name)) $output['errors'][] = 'Please enter name';
if (empty($grade)) $output['errors'][] = 'Please enter grade';
if (empty($course)) $output['errors'][] = 'Please enter course name';


// Only query the database if there are no errors
if (count($output['errors']) === 0) {
    //send the query to the database, store the result of the query into $result
    $query = "INSERT INTO `students` (`id`, `name`, `grade`, `course_name`) VALUES (NULL,'$name', '$grade', '$course');";
    $result = mysqli_query($conn, $query);
    //check if $result is empty.
    if (empty($result)) {
        //if it is, add 'database error' to errors
        $output['errors'][] = 'Database error';
    }

    else {
        // check if the number of affected rows is 1
        if (mysqli_affected_rows($conn) === 1) {
            //if it did, change output success to true
            $output['success'] = true;
            //get the insert ID of the row that was added
            $insertID = mysqli_insert_id($conn);
            //add 'insertID' to $output and set the value to the row's insert ID
            $output['insertID'] = $insertID;
        }
        // if not, add to the errors: 'insert error'
        else {
            $output['errors'][] = 'insert error';
        }
    }
}



?>