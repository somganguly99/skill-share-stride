<?php
require_once '../config/database.php';
require_once '../includes/cors.php';
require_once '../includes/helpers.php';

$conn = getDBConnection();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Enroll student in course
    $data = getJsonInput();
    validateRequired($data, ['studentId', 'courseId']);
    
    $studentId = (int)$data['studentId'];
    $courseId = (int)$data['courseId'];
    
    // Check if already enrolled
    $checkSql = "SELECT * FROM Enrolls_In WHERE StudentId = $studentId AND CourseId = $courseId";
    $checkResult = $conn->query($checkSql);
    
    if ($checkResult->num_rows > 0) {
        sendResponse(['success' => false, 'message' => 'Already enrolled in this course'], 400);
    }
    
    $sql = "INSERT INTO Enrolls_In (StudentId, CourseId) VALUES ($studentId, $courseId)";
    
    if ($conn->query($sql)) {
        // Update enrolled count
        $conn->query("UPDATE Course SET Enrolled = Enrolled + 1 WHERE CourseId = $courseId");
        
        sendResponse([
            'success' => true,
            'message' => 'Enrollment successful'
        ]);
    } else {
        sendResponse(['success' => false, 'message' => 'Enrollment failed: ' . $conn->error], 500);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Get student enrollments
    if (isset($_GET['studentId'])) {
        $studentId = (int)$_GET['studentId'];
        
        $sql = "SELECT c.* FROM Course c 
                INNER JOIN Enrolls_In e ON c.CourseId = e.CourseId 
                WHERE e.StudentId = $studentId";
        $result = $conn->query($sql);
        
        $courses = [];
        while ($row = $result->fetch_assoc()) {
            $courses[] = $row;
        }
        
        sendResponse(['success' => true, 'courses' => $courses]);
    } else {
        sendResponse(['success' => false, 'message' => 'studentId is required'], 400);
    }
}

$conn->close();
?>
