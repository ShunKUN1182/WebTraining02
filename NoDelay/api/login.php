<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST,OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
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

  unset($userData["user_password"]);

  echo json_encode([
    "success" => true,
    "message" => "ログインに成功しました",
    "data" => $userData,
  ]);
} catch (PDOException $error) {
  http_response_code(500);
  echo json_encode([
    "success" => false,
    "message" => "ログインに失敗しました",
    "error" => $error->getMessage()
  ]);
}
