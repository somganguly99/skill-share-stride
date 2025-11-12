<?php
require_once '../../config/database.php';
require_once '../../includes/cors.php';
require_once '../../includes/helpers.php';

$conn = getDBConnection();
$data = getJsonInput();

validateRequired($data, ['courseId', 'totalMarks']);

$courseId = (int)$data['courseId'];
$totalMarks = (int)$data['totalMarks'];

$sql = "INSERT INTO Quiz (CourseId, TotalMarks) VALUES ($courseId, $totalMarks)";

if ($conn->query($sql)) {
    sendResponse([
        'success' => true,
        'message' => 'Quiz created successfully',
        'quizId' => $conn->insert_id
    ]);
} else {
    sendResponse(['success' => false, 'message' => 'Failed to create quiz: ' . $conn->error], 500);
}

$conn->close();
?>
