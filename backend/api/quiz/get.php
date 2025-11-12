<?php
require_once '../../config/database.php';
require_once '../../includes/cors.php';
require_once '../../includes/helpers.php';

$conn = getDBConnection();

if (!isset($_GET['courseId'])) {
    sendResponse(['success' => false, 'message' => 'courseId is required'], 400);
}

$courseId = (int)$_GET['courseId'];

$sql = "SELECT * FROM Quiz WHERE CourseId = $courseId";
$result = $conn->query($sql);

$quizzes = [];
while ($row = $result->fetch_assoc()) {
    $quizzes[] = $row;
}

sendResponse(['success' => true, 'quizzes' => $quizzes]);

$conn->close();
?>
