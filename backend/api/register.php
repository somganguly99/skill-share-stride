<?php
require_once '../config/database.php';
require_once '../includes/cors.php';
require_once '../includes/helpers.php';

$conn = getDBConnection();
$data = getJsonInput();

validateRequired($data, ['email', 'password', 'role']);

$email = $conn->real_escape_string($data['email']);
$password = hashPassword($data['password']);
$role = $data['role'];

if ($role === 'student') {
    validateRequired($data, ['name']);
    $name = $conn->real_escape_string($data['name']);
    $address = isset($data['address']) ? $conn->real_escape_string($data['address']) : '';
    $contact1 = isset($data['contact1']) ? $conn->real_escape_string($data['contact1']) : '';
    $contact2 = isset($data['contact2']) ? $conn->real_escape_string($data['contact2']) : '';
    
    $sql = "INSERT INTO Student (SName, SMail, SAddress, SContact1, SContact2, Password) 
            VALUES ('$name', '$email', '$address', '$contact1', '$contact2', '$password')";
} elseif ($role === 'instructor') {
    $contact = isset($data['contact']) ? $conn->real_escape_string($data['contact']) : '';
    $qualification = isset($data['qualification']) ? $conn->real_escape_string($data['qualification']) : '';
    
    $sql = "INSERT INTO Instructor (IMail, IContact, Qualification, Password) 
            VALUES ('$email', '$contact', '$qualification', '$password')";
} else {
    sendResponse(['success' => false, 'message' => 'Invalid role for registration'], 400);
}

if ($conn->query($sql)) {
    sendResponse([
        'success' => true,
        'message' => 'Registration successful',
        'userId' => $conn->insert_id
    ]);
} else {
    sendResponse([
        'success' => false,
        'message' => 'Registration failed: ' . $conn->error
    ], 500);
}

$conn->close();
?>
