<?php
require_once '../../config/database.php';
require_once '../../includes/cors.php';
require_once '../../includes/helpers.php';

$conn = getDBConnection();
$data = getJsonInput();

validateRequired($data, ['studentId', 'quizId']);

$studentId = (int)$data['studentId'];
$quizId = (int)$data['quizId'];

// For now, just return success. You can add a QuizAttempt table to track attempts
sendResponse([
    'success' => true,
    'message' => 'Quiz attempt recorded',
    'score' => isset($data['score']) ? $data['score'] : 0
]);

$conn->close();
?>
