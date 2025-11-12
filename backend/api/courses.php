<?php
require_once '../config/database.php';
require_once '../includes/cors.php';
require_once '../includes/helpers.php';

$conn = getDBConnection();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Get all approved courses or specific course by ID
    if (isset($_GET['id'])) {
        $courseId = (int)$_GET['id'];
        $sql = "SELECT * FROM Course WHERE CourseId = $courseId";
        $result = $conn->query($sql);
        
        if ($result->num_rows > 0) {
            sendResponse(['success' => true, 'course' => $result->fetch_assoc()]);
        } else {
            sendResponse(['success' => false, 'message' => 'Course not found'], 404);
        }
    } else {
        // Get all approved courses (AdminId IS NOT NULL means approved)
        $sql = "SELECT * FROM Course WHERE AdminId IS NOT NULL ORDER BY CourseId DESC";
        $result = $conn->query($sql);
        
        $courses = [];
        while ($row = $result->fetch_assoc()) {
            $courses[] = $row;
        }
        
        sendResponse(['success' => true, 'courses' => $courses]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Create course request
    $data = getJsonInput();
    validateRequired($data, ['CName', 'instructorId']);
    
    $name = $conn->real_escape_string($data['CName']);
    $description = isset($data['CDescription']) ? $conn->real_escape_string($data['CDescription']) : '';
    $credits = isset($data['Credits']) ? (int)$data['Credits'] : 4;
    $duration = isset($data['CDuration']) ? $conn->real_escape_string($data['CDuration']) : '5 hours';
    $instructorId = (int)$data['instructorId'];
    $videoUrl = isset($data['videoUrl']) ? $conn->real_escape_string($data['videoUrl']) : '';
    $price = isset($data['Price']) ? (float)$data['Price'] : 1000;
    $level = isset($data['Level']) ? $conn->real_escape_string($data['Level']) : 'beginner';
    $category = isset($data['Category']) ? $conn->real_escape_string($data['Category']) : 'General';
    
    // Get instructor name
    $instructorResult = $conn->query("SELECT IMail FROM Instructor WHERE InstructorId = $instructorId");
    $instructorName = $instructorResult->num_rows > 0 ? $instructorResult->fetch_assoc()['IMail'] : 'Unknown';
    
    $sql = "INSERT INTO Course (CName, CDescription, Credits, CDuration, InstructorId, InstructorName, Price, Level, Category) 
            VALUES ('$name', '$description', $credits, '$duration', $instructorId, '$instructorName', $price, '$level', '$category')";
    
    if ($conn->query($sql)) {
        sendResponse([
            'success' => true,
            'message' => 'Course request submitted for admin approval',
            'courseId' => $conn->insert_id
        ]);
    } else {
        sendResponse(['success' => false, 'message' => 'Failed to create course: ' . $conn->error], 500);
    }
}

$conn->close();
?>
