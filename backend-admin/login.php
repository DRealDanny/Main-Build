<?php
require_once 'config.php';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if ($_POST['u'] === ADMIN_USER && $_POST['p'] === ADMIN_PASS) {
        $_SESSION['logged_in'] = true;
        session_regenerate_id(true);
        header("Location: dashboard.php");
        exit;
    } else {
        $error = 'Access Denied. Please check your credentials.';
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <link rel="icon" type="image/png" href="../assets/naturalbane-icon.png">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin | Login</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:ital,wght@0,700;1,700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="backend.css">
</head>
<body class="login-page">
<div class="wrapper">
    <div class="form-side">
        <h1>Welcome back!</h1>
        <p class="sub">Login to make changes on website</p>

        <?php if($error): ?><p class="error"><?php echo $error; ?></p><?php endif; ?>

        <form method="POST">
            <div class="input-group">
                <label>Username</label>
                <input type="text" name="u" required placeholder="Danny">
            </div>

            <div class="input-group">
                <label>Password</label>
                <div class="pass-wrapper">
                    <input type="password" name="p" id="passInput" required placeholder="Enter password">
                    <button type="button" class="toggle-btn" onclick="toggleVisibility()">
                        <svg id="eyeIcon" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    </button>
                </div>
            </div>

            <button type="submit" class="btn">Login</button>
        </form>
    </div>
    <div class="img-side"></div>
</div>

<script>
function toggleVisibility() {
    const input = document.getElementById('passInput');
    const icon = document.getElementById('eyeIcon');
    if (input.type === 'password') {
        input.type = 'text';
        icon.style.stroke = '#2060FF';
    } else {
        input.type = 'password';
        icon.style.stroke = '#333';
    }
}
</script>
</body>
</html>