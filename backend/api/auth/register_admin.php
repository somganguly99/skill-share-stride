<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once '../../config/database.php';
header('Content-Type: application/json');

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->email) && !empty($data->password)) {
    $check_query = "SELECT AdminId FROM Admin WHERE AMail = :email";
    $check_stmt = $db->prepare($check_query);
    $check_stmt->bindParam(":email", $data->email);
    $check_stmt->execute();
    
    if ($check_stmt->rowCount() > 0) {
        http_response_code(409);
        echo json_encode([
            "success" => false,
            "error" => "Admin already exists"
        ]);
        exit();
    }
    
    $hashed_password = password_hash($data->password, PASSWORD_DEFAULT);
    
    $query = "INSERT INTO Admin (AMail, AContact, ASalary, Password) 
              VALUES (:email, :contact, :salary, :password)";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(":email", $data->email);
    $stmt->bindParam(":contact", $data->contact);
    $stmt->bindParam(":salary", $data->salary);
    $stmt->bindParam(":password", $hashed_password);
    
    if ($stmt->execute()) {
        echo json_encode([
            "success" => true,
            "message" => "Registration successful"
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "error" => "Registration failed"
        ]);
    }
} else {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "error" => "Email and password are required"
    ]);
}
?>