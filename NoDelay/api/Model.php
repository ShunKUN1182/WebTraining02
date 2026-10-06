<?php

require_once __DIR__ . "/config.php";

class Model
{
  private ?PDO $db = null;
  public function __construct()
  {
    if (is_null($this->db)) {
      $this->connect();
    }
  }
  private function connect(): void
  {
    $this->db = new PDO(DB_DSN, DB_USER, DB_PASS);
  }
  public function query(string $sql): array
  {
    $stmt = $this->db->query($sql);
    $stmt->execute();
    $result = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
      $result[] = $row;
    }
    return $result;
  }
}
