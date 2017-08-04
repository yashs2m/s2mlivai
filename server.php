<?php
$servername = "localhost";
$username = "s2mlivai";
$password = "aPBaXXFCXnQFTdbq ";

// Create connection
$connect = new mysqli($servername, $username, $password);

// Check connection
if ($connect->connect_error) {
    die("Connection failed: " . $connect->connect_error);
} 
echo "Connected successfully";
?>