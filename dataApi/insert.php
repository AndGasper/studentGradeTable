<?php
//INSERT INTO `student_data` (`id`, `name`, `grade`, `course_name`) VALUES (NULL, 'bleep', '98', 'blooping');
$name =$_POST['name'];
$grade = $_POST['grade'];
$course = $_POST['course_name'];
//check if you have all the data you need from the client-side call.
//if not, add an appropriate error to errors
if (empty($name)) $output['errors'][] = 'Please enter name';
if (empty($grade)) $output['errors'][] = 'Please enter grade';
if (empty($course)) $output['errors'][] = 'Please enter course name';
//write a query that inserts the data into the database.  remember that ID doesn't need to be set as it is auto incrementing
$query = "INSERT INTO `php_sgt_prototype`.`student_data` (`id`, `name`, `grade`, `course_name`) VALUES (NULL,'$name', '$grade', '$course');";
//send the query to the database, store the result of the query into $result
print($query);
$result = mysqli_query($conn, $query);
//check if $result is empty.
if (empty($result)) {
    //if it is, add 'database error' to errors
    $output['errors'][] = 'Database error';
    print_r($output['errors']);
}
//else:
else {
    //check if the number of affected rows is 1
    if (mysqli_affected_rows($conn) === 1) {
        //if it did, change output success to true
        $output['success'] = true;
        //get the insert ID of the row that was added
        $insertID = mysqli_insert_id($conn);
        //add 'insertID' to $output and set the value to the row's insert ID
        $output['insertID'] = $insertID;
    }
    //if not, add to the errors: 'insert error'
    else {
        $output['errors'][] = 'insert error';
    }
}
print_r($output);
print_r($output['errors']);


?>