<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST,OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

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
  $model->query($sql);
} catch (PDOException $error) {
  echo json_encode([
    "success" => false,
    "message" => "新規登録に失敗しました",
    "error" => $error->getMessage()
  ]);
}
