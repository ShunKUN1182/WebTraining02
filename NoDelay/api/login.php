<?php

$allowedOrigins = [
  "http://localhost:5173",
  "https://web-training02.vercel.app"
];

$origin = $_SERVER["HTTP_ORIGIN"] ?? "";

if (in_array($origin, $allowedOrigins, true)) {
  header("Access-Control-Allow-Origin: " . $origin);
  header("Access-Control-Allow-Credentials: true");
  header("Vary: Origin");
}

header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
  http_response_code(204);
  exit;
}

session_start();

header("Content-Type: application/json; charset=UTF-8");
require_once __DIR__ . "/Model.php";
$data = json_decode(file_get_contents("php://input"), true);
$email = $data["email"] ?? "";
$password = $data["password"] ?? "";

if (!$email || !$password) {
  echo json_encode([
    "success" => false,
    "message" => "メールアドレスとパスワードを入力してください",
  ]);
  exit;
}

try {
  $sql = "SELECT user_id,user_name,user_email,user_password FROM users WHERE user_email = :email";
  $model = new Model();
  $user = $model->query($sql, [
    ":email" => $email,
  ])->getData();

  if (!$user) {
    echo json_encode([
      "success" => false,
      "message" => "メールアドレスまたはパスワードが正しくありません"
    ]);
    exit;
  }

  $userData = $user[0];

  if (!$userData) {
    echo json_encode([
      "success" => false,
      "message" => "メールアドレスまたはパスワードが正しくありません"
    ]);
    exit;
  }

  if (!password_verify($password, $userData["user_password"])) {
    echo json_encode([
      "success" => false,
      "message" => "メールアドレスまたはパスワードが正しくありません",
      "data" => $userData,
    ]);
    exit;
  }

  session_regenerate_id(true);
  $_SESSION["user_id"] = $userData["user_id"];
  $_SESSION["user_name"] = $userData["user_name"];

  unset($userData["user_password"]);

  echo json_encode([
    "success" => true,
    "message" => "ログインに成功しました",
    "data" => $userData,
  ]);
} catch (PDOException $error) {
  error_log($error->getMessage());
  http_response_code(500);
  echo json_encode([
    "success" => false,
    "message" => "ログインに失敗しました",
  ]);
}
