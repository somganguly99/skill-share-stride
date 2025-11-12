<?php
require_once '../../config/database.php';
require_once '../../includes/cors.php';
require_once '../../includes/helpers.php';

$conn = getDBConnection();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['pending']) && $_GET['pending'] === 'true') {
        // Get pending courses (AdminId IS NULL means pending)
        $sql = "SELECT c.*, i.IMail as instructorEmail 
                FROM Course c 
                LEFT JOIN Instructor i ON c.InstructorId = i.InstructorId 
                WHERE c.AdminId IS NULL";
    } else {
        // Get all courses
        $sql = "SELECT * FROM Course";
    }
    
    $result = $conn->query($sql);
    $courses = [];
    
    while ($row = $result->fetch_assoc()) {
        $courses[] = $row;
    }
    
    sendResponse(['success' => true, 'courses' => $courses]);
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = getJsonInput();
    $method = isset($data['method']) ? $data['method'] : '';
    
    validateRequired($data, ['courseId']);
    $courseId = (int)$data['courseId'];
    
    if ($method === 'approve') {
        // Set AdminId to 1 (you can make this dynamic based on logged-in admin)
        $sql = "UPDATE Course SET AdminId = 1 WHERE CourseId = $courseId";
        
        if ($conn->query($sql)) {
            sendResponse(['success' => true, 'message' => 'Course approved']);
        } else {
            sendResponse(['success' => false, 'message' => 'Failed to approve course'], 500);
        }
    } elseif ($method === 'reject') {
        $sql = "DELETE FROM Course WHERE CourseId = $courseId AND AdminId IS NULL";
        
        if ($conn->query($sql)) {
            sendResponse(['success' => true, 'message' => 'Course rejected and removed']);
        } else {
            sendResponse(['success' => false, 'message' => 'Failed to reject course'], 500);
        }
    }
}

$conn->close();
?>
