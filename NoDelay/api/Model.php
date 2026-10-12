<?php

require_once __DIR__ . "/config.php";

class Model
{
  private ?PDO $db = null;
  private ?PDOStatement $stmt = null;

  public function __construct()
  {
    if (is_null($this->db)) {
      $this->connect();
    }
  }

  // DBへの接続
  private function connect(): void
  {
    $this->db = new PDO(DB_DSN, DB_USER, DB_PASS);
  }

  // SQL実行
  public function query(string $sql, array $params = []): self
  {
    $this->stmt = $this->db->prepare($sql);
    $this->stmt->execute($params);
    return $this;
  }

  // 実行結果を取り出す
  public function getData(): array
  {
    if (is_null($this->stmt)) {
      return [];
    }
    $result = [];
    while ($row = $this->stmt->fetch(PDO::FETCH_ASSOC)) {
      $result[] = $row;
    }
    return $result;
  }
}
