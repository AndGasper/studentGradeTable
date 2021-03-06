<?php


$id = $_POST['id'];
if (empty($id)) {
    $output['errors'][] = 'Please specify a student id';
    return;
}
if (!ctype_digit($id)) {
    $output['errors'][] = "Please specify a student id";
    return;
}
//write a query that deletes the student by the given student ID  
$query = "DELETE FROM `students` WHERE `id`=$id;";
//send the query to the database, store the result of the query into $result
$result = mysqli_query($conn, $query);
//check if $result is empty.
if (empty($result)) {
    //if it is, add 'database error' to errors
    $output['errors'][] = 'Database error';
}
//else:
else {
    //check if the number of affected rows is 1
    if (mysqli_affected_rows($conn) === 1) {
        //if it did, change output success to true
        $output['success'] = true;
    } else {
        //if not, add to the errors: 'delete error
        $output['errors'][] = 'delete error';
    }
}
?>