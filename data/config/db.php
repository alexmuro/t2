<?php
 error_reporting(E_ALL ^ E_DEPRECATED);

class db {
  private $mysql_username;
  private $mysql_password;
  private $mysql_host;
  private $mysql_database;
  private $conn;
  
  function db(){}

  public function connect()
  {
    //Database Configuration
    $this->mysql_host = 'localhost';
    $this->mysql_username = 'root';
    $this->mysql_password = 'am1238wk';
    $this->mysql_database = 'tredis';
    
    //Database Connect
    $this->conn = mysql_connect($this->mysql_host, $this->mysql_username, $this->mysql_password)
    or die ("Could not connect: x " . mysql_error() ." ". $this->mysql_host);
    
    mysql_select_db($this->mysql_database);
    return $this->conn;
  }
  
  public function close(){
    mysql_close($this->conn);
  }
}