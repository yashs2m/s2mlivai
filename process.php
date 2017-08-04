<?php include 'server.php';>

<?php

// create a variable
$speechtotext_id=$_POST['speechtotext_id'];
$speechtotext_text=$_POST['speechtotext_text'];


//Execute the query

mysqli_query($connect"INSERT INTO speechtotext(speechtotext_id, speechtotext_text)
				VALUES('$speechtotext_id','$speechtotext_text')");