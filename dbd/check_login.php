<?php

$host="localhost"; // Host name 
$username="dbdesign"; // Mysql username 
$password="andrewbottoms"; // Mysql password 
$db_name="dbdesign"; // Database name 
$tbl_name="members"; // Table name 


$mysqli = new mysqli($host, $username, $password, $db_name);
/*
 * This is the "official" OO way to do it
 */
if ($mysqli->connect_error) {
    die('Connect Error (' . $mysqli->connect_errno . ') '
            . $mysqli->connect_error);
}

// username and password sent from form 
$myusername=$_POST['myusername']; 
$mypassword=$_POST['mypassword'];
$mypassword=md5($mypassword);
echo "yo $mypassword ";

// To protect MySQL injection 
// Deez lines broke it earlier.
$myusername = stripslashes($myusername);
$mypassword = stripslashes($mypassword);
$myusername = $mysqli->real_escape_string($myusername);
$mypassword = $mysqli->real_escape_string($mypassword);

$sql="SELECT * FROM $tbl_name WHERE username='$myusername' and password='$mypassword'";
$result = $mysqli->query($sql);
// Mysql_num_row is counting table row
$count=$result->num_rows;

// If result matched $myusername and $mypassword, table row must be 1 row
if($count==1){

// Register $myusername, $mypassword and redirect to file "login_success.php"
session_register("myusername");
session_register("mypassword"); 
header("location:login_success.php");
}
else {
echo "Wrong Username or Password";
}
?>