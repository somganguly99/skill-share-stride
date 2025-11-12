<?php
require_once '../../config/database.php';
require_once '../../includes/cors.php';
require_once '../../includes/helpers.php';

$conn = getDBConnection();

if (!isset($_GET['studentId']) || !isset($_GET['courseId'])) {
    sendResponse(['success' => false, 'message' => 'studentId and courseId are required'], 400);
}

$studentId = (int)$_GET['studentId'];
$courseId = (int)$_GET['courseId'];

$sql = "SELECT c.*, s.SName as studentName, co.CName as courseName 
        FROM Certificate c 
        INNER JOIN Student s ON c.StudentId = s.StudentId 
        INNER JOIN Course co ON c.CourseId = co.CourseId 
        WHERE c.StudentId = $studentId AND c.CourseId = $courseId";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    sendResponse(['success' => true, 'certificate' => $result->fetch_assoc()]);
} else {
    sendResponse(['success' => false, 'message' => 'Certificate not found'], 404);
}

$conn->close();
?>
