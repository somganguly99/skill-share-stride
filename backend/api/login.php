<?php
require_once '../config/database.php';
require_once '../includes/cors.php';
require_once '../includes/helpers.php';

$conn = getDBConnection();
$data = getJsonInput();

validateRequired($data, ['email', 'password', 'role']);

$email = $conn->real_escape_string($data['email']);
$password = $data['password'];
$role = $data['role'];

// Determine table and ID field based on role
$table = '';
$idField = '';
$nameField = '';

switch ($role) {
    case 'student':
        $table = 'Student';
        $idField = 'StudentId';
        $nameField = 'SName';
        break;
    case 'instructor':
        $table = 'Instructor';
        $idField = 'InstructorId';
        $nameField = 'IMail'; // Use email as name for now
        break;
    case 'admin':
        $table = 'Admin';
        $idField = 'AdminId';
        $nameField = 'AMail'; // Use email as name for now
        break;
    default:
        sendResponse(['success' => false, 'message' => 'Invalid role'], 400);
}

// Get user from database
$emailField = $role === 'student' ? 'SMail' : ($role === 'admin' ? 'AMail' : 'IMail');
$sql = "SELECT $idField as id, $emailField as email, $nameField as name, Password FROM $table WHERE $emailField = '$email'";
$result = $conn->query($sql);

if ($result->num_rows === 0) {
    sendResponse(['success' => false, 'message' => 'Invalid credentials'], 401);
}

$user = $result->fetch_assoc();

// Verify password
if (!verifyPassword($password, $user['Password'])) {
    sendResponse(['success' => false, 'message' => 'Invalid credentials'], 401);
}

// Remove password from response
unset($user['Password']);
$user['role'] = $role;

sendResponse([
    'success' => true,
    'user' => $user
]);

$conn->close();
?>
