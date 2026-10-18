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

header("Content-Type: application/json; charset=UTF-8");

// POST以外の通信は拒否する
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
  http_response_code(405);
  echo json_encode([
    "success" => false,
    "message" => "POSTリクエストのみ受け付けます"
  ]);
  exit;
}
// Reactから送られたJSONを取得
$data = json_decode(file_get_contents("php://input"), true);

$userId = $data["userId"] ?? null;
$schoolStartTime = $data["schoolStartTime"] ?? "";

// 入力チェック
if (
  !is_numeric($userId) ||
  (int)$userId <= 0 ||
  !is_string($schoolStartTime) ||
  !preg_match('/^(?:[01]\d|2[0-3]):[0-5]\d$/', $schoolStartTime)
) {
  http_response_code(400);
  echo json_encode([
    "success" => false,
    "message" => "ユーザーIDまたは登校予定時刻が正しくありません",
  ]);
  exit;
}

try {
  require_once __DIR__ . "/Model.php";

  // 現在日時を取得（日本時間）
  $now = new DateTimeImmutable(
    "now",
    new DateTimeZone("Asia/Tokyo")
  );

  $logDate = $now->format("Y-m-d");
  $checkInTime = $now->format("H:i:s");
  $startTime = $schoolStartTime . ":00";

  // 時刻を「0時からの経過分数」に変換
  $checkInMinutes =
    (int)$now->format("H") * 60 +
    (int)$now->format("i");

  [$startHour, $startMinute] = array_map(
    "intval",
    explode(":", $schoolStartTime)
  );

  $startMinutes = $startHour * 60 + $startMinute;

  // 遅刻分数を計算
  $lateMinutes = max(0, $checkInMinutes - $startMinutes);

  // 遅刻か、間に合ったかを判定
  $status = $lateMinutes > 0 ? "late" : "safe";

  // DBに保存
  $model = new Model();

  $sql = "INSERT INTO attendance_logs (
        user_id,
        log_date,
        check_in_time,
        school_start_time,
        status,
        late_minutes
    ) VALUES (
        :user_id,
        :log_date,
        :check_in_time,
        :school_start_time,
        :status,
        :late_minutes
    )";

  $model->query($sql, [
    ":user_id" => (int)$userId,
    ":log_date" => $logDate,
    ":check_in_time" => $checkInTime,
    ":school_start_time" => $startTime,
    ":status" => $status,
    ":late_minutes" => $lateMinutes,
  ]);

  // 保存成功
  echo json_encode([
    "success" => true,
    "message" => "登校記録を保存しました",
    "data" => [
      "date" => $logDate,
      "time" => substr($checkInTime, 0, 5),
      "schoolStartTime" => $schoolStartTime,
      "status" => $status,
      "lateMinutes" => $lateMinutes,
    ],
  ]);
} catch (PDOException $error) {
  error_log($error->getMessage());

  http_response_code(500);
  echo json_encode([
    "success" => false,
    "message" => "記録を保存できませんでした。同じ日の記録がないか確認してください。",
  ]);
}
