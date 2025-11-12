<?php
require_once '../../config/database.php';
require_once '../../includes/cors.php';
require_once '../../includes/helpers.php';

$conn = getDBConnection();
$data = getJsonInput();

validateRequired($data, ['studentId', 'courseId']);

$studentId = (int)$data['studentId'];
$courseId = (int)$data['courseId'];

// Check if certificate already exists
$checkSql = "SELECT * FROM Certificate WHERE StudentId = $studentId AND CourseId = $courseId";
$checkResult = $conn->query($checkSql);

if ($checkResult->num_rows > 0) {
    $certificate = $checkResult->fetch_assoc();
    sendResponse([
        'success' => true,
        'message' => 'Certificate already exists',
        'certificate' => $certificate
    ]);
}

// Generate new certificate
$issueDate = date('Y-m-d');
$sql = "INSERT INTO Certificate (StudentId, CourseId, IssueDate) VALUES ($studentId, $courseId, '$issueDate')";

if ($conn->query($sql)) {
    $certificateId = $conn->insert_id;
    
    sendResponse([
        'success' => true,
        'message' => 'Certificate generated successfully',
        'certificate' => [
            'CNo' => $certificateId,
            'StudentId' => $studentId,
            'CourseId' => $courseId,
            'IssueDate' => $issueDate
        ]
    ]);
} else {
    sendResponse(['success' => false, 'message' => 'Failed to generate certificate: ' . $conn->error], 500);
}

$conn->close();
?>
