<?php
$servername = "localhost";
$username = "root";  
$password = "";  
$dbname = "weaher_det";


$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$email = $_POST['email'];
$phone = $_POST['phone'];
$pass = password_hash($_POST['pass'], PASSWORD_DEFAULT); 
$city = $_POST['city'];
$state = $_POST['state'];
$zip = $_POST['zip'];

// Insert data into table
$sql = "INSERT INTO user_r (email, phone_no, password, city, state, zip) 
        VALUES ('$email', '$phone', '$pass', '$city', '$state', '$zip')";

if ($conn->query($sql) === TRUE) {
    header("Location: login.html"); // Redirect to login page
    echo "<script>alert('This is an alert!');</script>";
    
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>



