<?php
session_start();
header("Content-Type: application/json; charset=UTF-8");
echo json_encode([
  "logged_in" => isset($_SESSION["user_id"]),
  "user_id" => $_SESSION["user_id"] ?? null,
]);