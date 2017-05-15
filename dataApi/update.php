<?php
print_r($_POST);
//check if you have all the data you need from the client-side call.  This should include the fields being changed and the ID of the student to be changed
$id = $_POST['id'];
//if (empty($id)) {
////if not, add an appropriate error to errors
//    $output['errors'][] = 'No updates supplied';
//}
$updateFields = [
    'student' => 'name',
    'course' => 'course_name',
    'score' => 'grade'
];

if (empty($id)) {
    $output['errors'][] = 'Missing ID';
}
else {

    $query = "UPDATE `student_data` SET ";
    foreach ($updateFields as $externalField => $internalField) {
        if (!empty($_POST[$externalField])) {
            $query .= "`$internalField` = '{$_POST[$externalField]}',";
        }
    }
    $query = substr($query, 0, -1);
    $query .= " WHERE `id`=$id";
    print_r($query);
    $result = mysqli_query($conn, $query);

    if (empty($result)) {
        $output['errors'][] = 'database error';
    } else {
        if (mysqli_affected_rows($conn) === 1) {
            $output['success'] = true;
        } else {
            $output['errors'][] = 'update error';
        }
    }
}

?>