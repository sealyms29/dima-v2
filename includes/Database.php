<?php
/**
 * Database Connection Handler using PDO
 * Provides secure database access with prepared statements
 */

class Database {
    private static $pdo = null;
    private static $instance = null;

    private function __construct() {
        // Private constructor - use getInstance()
    }

    /**
     * Get singleton instance of Database
     */
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Get PDO connection
     */
    public static function getPDO() {
        if (self::$pdo === null) {
            self::connect();
        }
        return self::$pdo;
    }

    /**
     * Establish database connection
     */
    private static function connect() {
        try {
            $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4';
            
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
            ];

            self::$pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
            
        } catch (PDOException $e) {
            error_log('Database Connection Failed: ' . $e->getMessage());
            http_response_code(500);
            die(json_encode([
                'success' => false,
                'message' => 'Database connection failed'
            ]));
        }
    }

    /**
     * Execute prepared statement
     * 
     * Usage:
     *   $db->query("SELECT * FROM users WHERE id = ?", [$id]);
     *   $db->query("UPDATE users SET name = ? WHERE id = ?", [$name, $id]);
     */
    public static function query($sql, $params = []) {
        try {
            $stmt = self::getPDO()->prepare($sql);
            $stmt->execute($params);
            return $stmt;
        } catch (PDOException $e) {
            error_log('Query Error: ' . $e->getMessage() . ' SQL: ' . $sql);
            throw $e;
        }
    }

    /**
     * Fetch single row
     */
    public static function fetchOne($sql, $params = []) {
        $stmt = self::query($sql, $params);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Fetch all rows
     */
    public static function fetchAll($sql, $params = []) {
        $stmt = self::query($sql, $params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Insert record and return last insert ID
     */
    public static function insert($table, $data) {
        $columns = array_keys($data);
        $values = array_values($data);
        $placeholders = array_fill(0, count($columns), '?');

        $sql = "INSERT INTO " . self::escapeIdentifier($table) . " (" 
             . implode(',', array_map([self::class, 'escapeIdentifier'], $columns)) 
             . ") VALUES (" . implode(',', $placeholders) . ")";

        self::query($sql, $values);
        return self::getPDO()->lastInsertId();
    }

    /**
     * Update record
     */
    public static function update($table, $data, $where_field, $where_value) {
        $columns = array_keys($data);
        $values = array_values($data);
        $set = implode('=?,', array_map([self::class, 'escapeIdentifier'], $columns)) . '=?';
        $values[] = $where_value;

        $sql = "UPDATE " . self::escapeIdentifier($table) . " SET " . $set 
             . " WHERE " . self::escapeIdentifier($where_field) . " = ?";

        $stmt = self::query($sql, $values);
        return $stmt->rowCount();
    }

    /**
     * Delete record
     */
    public static function delete($table, $where_field, $where_value) {
        $sql = "DELETE FROM " . self::escapeIdentifier($table) 
             . " WHERE " . self::escapeIdentifier($where_field) . " = ?";
        
        $stmt = self::query($sql, [$where_value]);
        return $stmt->rowCount();
    }

    /**
     * Count records
     */
    public static function count($table, $where_field = null, $where_value = null) {
        $sql = "SELECT COUNT(*) as total FROM " . self::escapeIdentifier($table);
        
        if ($where_field) {
            $sql .= " WHERE " . self::escapeIdentifier($where_field) . " = ?";
            $stmt = self::query($sql, [$where_value]);
        } else {
            $stmt = self::query($sql);
        }
        
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result['total'] ?? 0;
    }

    /**
     * Escape column/table identifiers (backticks for MySQL)
     */
    private static function escapeIdentifier($identifier) {
        return '`' . str_replace('`', '``', $identifier) . '`';
    }

    /**
     * Begin transaction
     */
    public static function beginTransaction() {
        return self::getPDO()->beginTransaction();
    }

    /**
     * Commit transaction
     */
    public static function commit() {
        return self::getPDO()->commit();
    }

    /**
     * Rollback transaction
     */
    public static function rollback() {
        return self::getPDO()->rollback();
    }
}
