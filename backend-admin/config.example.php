<?php
define('ADMIN_USER', 'your_username');
define('ADMIN_PASS', 'your_password');

session_start();

function check_auth() {
    if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
        header("Location: index.php"); // Redirect to the login (index.php)
        exit;
    }
}
?>
