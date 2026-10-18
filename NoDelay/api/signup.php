<?php
$allowedOrigins = [
  "http://localhost:5173",
  "https://web-training02.vercel.app",
];

$origin = $_SERVER["HTTP_ORIGIN"] ?? "";

if (in_array($origin, $allowedOrigins, true)) {
  header("Access-Control-Allow-Origin: " . $origin);
  header("Access-Control-Allow-Credentials: true");
}

header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
  http_response_code(204);
  exit;
}

require_once __DIR__ . "/Model.php";

$data = json_decode(file_get_contents("php://input"), true);

$name = $data["name"] ?? null;
$email = $data["email"] ?? null;
$password = $data["password"] ?? null;

if (!$name || !$email || !$password) {
  echo json_encode([
    "success" => false,
    "message" => "入力されていない項目があります"
  ]);
  exit;
}

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);
$sql = "
  INSERT INTO users 
  (user_name,user_email,user_password)
  VALUES 
  (:name,:email,:password)
";

try {
  $model = new Model();
  $model->query($sql, [
    ":name" => $name,
    ":email" => $email,
    ":password" => $hashedPassword,
  ]);

  echo json_encode([
    "success" => true,
    "message" =>  "新規登録に成功しました"
  ]);
} catch (PDOException $error) {
  http_response_code(500);
  echo json_encode([
    "success" => false,
    "message" => "新規登録に失敗しました",
    "error" => $error->getMessage()
  ]);
}
