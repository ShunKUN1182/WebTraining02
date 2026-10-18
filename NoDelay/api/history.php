<?php

$allowedOrigins = [
  "http://localhost:5173",
  "https://web-training02.vercel.app",
];

$origin = $_SERVER["HTTP_ORIGIN"] ?? "";

if (in_array($origin, $allowedOrigins, true)) {
  header("Access-Control-Allow-Origin: " . $origin);
}

header("Vary: Origin");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
  http_response_code(204);
  exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
  http_response_code(405);
  echo json_encode([
    "success" => false,
    "message" => "GETリクエストのみ受け付けます",
  ]);
  exit;
}

// URLからユーザーIDを取得
$userId = $_GET["userId"] ?? null;

if (!is_numeric($userId) || (int)$userId <= 0) {
  http_response_code(400);
  echo json_encode([
    "success" => false,
    "message" => "ユーザーIDが正しくありません",
  ]);
  exit;
}

try {
  require_once __DIR__ . "/Model.php";

  $model = new Model();

  $sql = "SELECT
                log_id,
                log_date,
                check_in_time,
                school_start_time,
                status,
                late_minutes
            FROM attendance_logs
            WHERE user_id = :user_id
            ORDER BY log_date DESC, check_in_time DESC";

  $model->query($sql, [
    ":user_id" => (int)$userId,
  ]);

  $logs = $model->getData();

  $history = array_map(function ($log) {
    return [
      "id" => (int)$log["log_id"],
      "date" => $log["log_date"],
      "time" => substr($log["check_in_time"], 0, 5),
      "schoolStartTime" => substr($log["school_start_time"], 0, 5),
      "status" => $log["status"],
      "lateMinutes" => (int)$log["late_minutes"],
    ];
  }, $logs);

  echo json_encode([
    "success" => true,
    "data" => $history,
  ]);
} catch (Throwable $error) {
  error_log($error->getMessage());

  http_response_code(500);
  echo json_encode([
    "success" => false,
    "message" => "登校履歴の取得に失敗しました",
  ]);
}
