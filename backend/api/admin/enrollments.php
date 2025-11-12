<?php
require_once '../../config/database.php';
require_once '../../includes/cors.php';
require_once '../../includes/helpers.php';

$conn = getDBConnection();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Get all enrollments (pending is not tracked in schema, so return all)
    $sql = "SELECT e.StudentId, e.CourseId, s.SName as studentName, s.SMail as studentEmail, 
            c.CName as courseName, c.Price 
            FROM Enrolls_In e 
            INNER JOIN Student s ON e.StudentId = s.StudentId 
            INNER JOIN Course c ON e.CourseId = c.CourseId";
    
    $result = $conn->query($sql);
    $enrollments = [];
    
    while ($row = $result->fetch_assoc()) {
        $enrollments[] = $row;
    }
    
    sendResponse(['success' => true, 'enrollments' => $enrollments]);
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = getJsonInput();
    $method = isset($data['method']) ? $data['method'] : '';
    
    if ($method === 'approve') {
        // Enrollment is already approved when inserted, this is just for consistency
        sendResponse(['success' => true, 'message' => 'Enrollment approved']);
    } elseif ($method === 'reject') {
        validateRequired($data, ['studentId', 'courseId']);
        $studentId = (int)$data['studentId'];
        $courseId = (int)$data['courseId'];
        
        $sql = "DELETE FROM Enrolls_In WHERE StudentId = $studentId AND CourseId = $courseId";
        
        if ($conn->query($sql)) {
            $conn->query("UPDATE Course SET Enrolled = GREATEST(Enrolled - 1, 0) WHERE CourseId = $courseId");
            sendResponse(['success' => true, 'message' => 'Enrollment rejected']);
        } else {
            sendResponse(['success' => false, 'message' => 'Failed to reject enrollment'], 500);
        }
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $data = getJsonInput();
    validateRequired($data, ['studentId', 'courseId']);
    
    $studentId = (int)$data['studentId'];
    $courseId = (int)$data['courseId'];
    
    $sql = "DELETE FROM Enrolls_In WHERE StudentId = $studentId AND CourseId = $courseId";
    
    if ($conn->query($sql)) {
        $conn->query("UPDATE Course SET Enrolled = GREATEST(Enrolled - 1, 0) WHERE CourseId = $courseId");
        sendResponse(['success' => true, 'message' => 'Student removed from course']);
    } else {
        sendResponse(['success' => false, 'message' => 'Failed to remove student'], 500);
    }
}

$conn->close();
?>
