<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once '../../config/database.php';
header('Content-Type: application/json');

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->email) && !empty($data->password) && !empty($data->role)) {
    $table = '';
    $emailColumn = '';
    $idColumn = '';
    
    // Determine table and columns based on role
    switch($data->role) {
        case 'admin':
            $table = 'Admin';
            $emailColumn = 'AMail';
            $idColumn = 'AdminId';
            break;
        case 'instructor':
            $table = 'Instructor';
            $emailColumn = 'IMail';
            $idColumn = 'InstructorId';
            break;
        case 'student':
            $table = 'Student';
            $emailColumn = 'SMail';
            $idColumn = 'StudentId';
            break;
        default:
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "error" => "Invalid role"
            ]);
            exit();
    }
    
    $query = "SELECT * FROM $table WHERE $emailColumn = :email LIMIT 1";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":email", $data->email);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (password_verify($data->password, $user['Password'])) {
            $token = bin2hex(random_bytes(32));
            
            echo json_encode([
                "success" => true,
                "message" => "Login successful",
                "data" => [
                    "token" => $token,
                    "user" => $user,
                    "role" => $data->role
                ]
            ]);
        } else {
            http_response_code(401);
            echo json_encode([
                "success" => false,
                "error" => "Invalid password"
            ]);
        }
    } else {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "error" => "User not found"
        ]);
    }
} else {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "error" => "Email, password, and role are required"
    ]);
}
?>