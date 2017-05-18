<?php
//write a query that selects all the students from the database, all the data from each row
$query = "SELECT * FROM `students`;";
//send the query to the database, store the result of the query into $result
$result = mysqli_query($conn, $query);
//check if $result is empty.
if (empty($result)) {
    //if it is, add 'database error' to errors
    $output['error'][] = mysqli_connect_error(); # Trying to log the error so I can actually troubleshoot it
}
//check if any data came back
if (mysqli_num_rows($result) > 0) {
    //if it did, change output success to true
    $output['success'] = true;
    //do a while loop to collect all the data
    //add each row of data to the $output['data'] array
    while ($row = mysqli_fetch_assoc($result)) {
        $output['data'][] = $row;
    }
}
    //if not, add to the errors: 'no data'
else {
    $output['errors'][] = 'no data';
}
?>