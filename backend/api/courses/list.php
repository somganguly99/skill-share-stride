<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once("../../config/database.php");
header('Content-Type: application/json');

$database = new Database();
$db = $database->getConnection();

$query = "SELECT * FROM Course ORDER BY CourseId DESC";
$stmt = $db->prepare($query);
$stmt->execute();

$courses = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    "success" => true,
    "data" => $courses
]);
?>