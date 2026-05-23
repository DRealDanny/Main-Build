<?php
require_once 'config.php';
check_auth();

$jsonPath = '../content.json';
if (!file_exists($jsonPath)) {
    die("Error: content.json not found in root.");
}

$cms = json_decode(file_get_contents($jsonPath), true);

function delete_old_asset($relativePath) {
    if (empty($relativePath)) return true;
    $fullPath = '../' . $relativePath;
    if (!file_exists($fullPath)) return true;
    return unlink($fullPath);
}

$isAjax = !empty($_SERVER['HTTP_X_REQUESTED_WITH']) &&
          strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $isAjax) {
    header('Content-Type: application/json');

    $cms = json_decode(file_get_contents($jsonPath), true);

    if (isset($_POST['update_link'])) {
        $cms['config']['whatsapp_link'] = $_POST['link'];
        file_put_contents($jsonPath, json_encode($cms, JSON_PRETTY_PRINT));
        echo json_encode(['success' => true, 'msg' => 'WhatsApp link updated.']);
        exit;
    }

    if (isset($_POST['update_img'])) {
        $key     = $_POST['img_key'];
        $ext     = strtolower(pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION));
        $allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

        if (!in_array($ext, $allowed)) {
            echo json_encode(['success' => false, 'msg' => 'Invalid file type. Use JPG, PNG, or WEBP.']);
            exit;
        }

        $filename = $key . '_' . time() . '.' . $ext;
        $target   = '../assets/' . $filename;

        if (move_uploaded_file($_FILES['file']['tmp_name'], $target)) {
            $oldPath    = $cms['images'][$key] ?? '';
            $deleteOk   = delete_old_asset($oldPath);
            $deleteNote = $deleteOk ? '' : ' (old file could not be removed — check folder permissions)';

            $cms['images'][$key] = 'assets/' . $filename;
            file_put_contents($jsonPath, json_encode($cms, JSON_PRETTY_PRINT));

            echo json_encode([
                'success'  => true,
                'msg'      => 'Image replaced.' . $deleteNote,
                'new_path' => '../assets/' . $filename,
            ]);
        } else {
            echo json_encode(['success' => false, 'msg' => 'Upload failed. Check that the assets folder is writable.']);
        }
        exit;
    }

    if (isset($_POST['update_grid'])) {
        $grid  = $_POST['grid_name'];
        $index = (int) $_POST['grid_index'];
        $ext   = strtolower(pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION));

        $filename = $grid . '_' . $index . '_' . time() . '.' . $ext;
        $target   = '../assets/' . $filename;

        if (move_uploaded_file($_FILES['file']['tmp_name'], $target)) {
            $oldPath    = $cms['grids'][$grid][$index] ?? '';
            $deleteOk   = delete_old_asset($oldPath);
            $deleteNote = $deleteOk ? '' : ' (old file could not be removed — check folder permissions)';

            $cms['grids'][$grid][$index] = 'assets/' . $filename;
            file_put_contents($jsonPath, json_encode($cms, JSON_PRETTY_PRINT));

            echo json_encode([
                'success'  => true,
                'msg'      => 'Image updated.' . $deleteNote,
                'new_path' => '../assets/' . $filename,
            ]);
        } else {
            echo json_encode(['success' => false, 'msg' => 'Upload failed. Check that the assets folder is writable.']);
        }
        exit;
    }

    echo json_encode(['success' => false, 'msg' => 'Unknown action.']);
    exit;
}

function get_img($cms, $type, $key, $index = null) {
    $path = ($type === 'single') ? ($cms['images'][$key] ?? '') : ($cms['grids'][$key][$index] ?? '');
    return (!empty($path) && file_exists('../' . $path))
        ? '../' . $path
        : 'https://via.placeholder.com/150?text=No+Image';
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CMS Dashboard</title>
    <link rel="icon" type="image/png" href="../assets/naturalbane-icon.png">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:ital,wght@0,700;1,700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="backend.css">
</head>
<body>

<!-- Hamburger button (mobile only) -->
<button class="menu-toggle" id="menuToggle" onclick="toggleSidebar()">
    <span></span>
    <span></span>
    <span></span>
</button>

<!-- Dim overlay (mobile only) -->
<div class="sidebar-overlay" id="sidebarOverlay" onclick="toggleSidebar()"></div>

<div class="sidebar" id="sidebar">

    <div class="sidebar-wordmark">Dashboard</div>

    <div class="nav-heading">Work</div>
    <div class="nav-item active" onclick="showTab('branding', this)">Branding</div>
    <div class="nav-item" onclick="showTab('web', this)">Web Development</div>
    <div class="nav-item" onclick="showTab('video', this)">Video Editing</div>

    <div class="nav-divider"></div>

    <div class="nav-heading">Profile</div>
    <div class="nav-item" onclick="showTab('profile-pic', this)">Profile Picture</div>
    <div class="nav-item" onclick="showTab('showreel', this)">Watch Showreel</div>
    <div class="nav-item" onclick="showTab('skills', this)">Skills</div>

    <div class="nav-divider"></div>

    <a href="#" class="nav-item nav-socials">Socials</a>

    <a href="logout.php" class="logout">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="logout-icon" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
            <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
        </svg>
        Logout
    </a>
</div>

<div class="main">
    <div class="top-navbar">
        <div class="top-nav-title">Overview</div>
        <div class="top-nav-user">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
            </svg>
            <span>Danny</span>
        </div>
    </div>

    <div id="branding" class="tab active">
        <!-- Branding content goes here -->
    </div>
    <div id="web" class="tab">
        <!-- Web Development content goes here -->
    </div>
    <div id="video" class="tab">
        <!-- Video Editing content goes here -->
    </div>
</div>

<script>
    // ── Tab switching ──
    function showTab(id, clickedNav) {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        document.getElementById(id).classList.add('active');
        clickedNav.classList.add('active');

        // Auto-close sidebar on mobile after picking a tab
        if (window.innerWidth <= 768) toggleSidebar();
    }

    // ── Mobile sidebar toggle ──
    function toggleSidebar() {
        const sidebar  = document.getElementById('sidebar');
        const toggle   = document.getElementById('menuToggle');
        const overlay  = document.getElementById('sidebarOverlay');
        const isOpen   = sidebar.classList.contains('open');

        sidebar.classList.toggle('open', !isOpen);
        toggle.classList.toggle('open', !isOpen);
        overlay.classList.toggle('active', !isOpen);

        // Lock body scroll when sidebar is open
        document.body.style.overflow = isOpen ? '' : 'hidden';
    }

    // ── Toast ──
    function showToast(msg, type) {
        const icons     = { success: '✓', error: '✕', warn: '⚠' };
        const container = document.getElementById('toast-container');
        const toast     = document.createElement('div');

        toast.className = 'toast ' + type;
        toast.innerHTML = `
            <span class="toast-icon">${icons[type] || '✓'}</span>
            <span class="toast-msg">${msg}</span>
            <div class="toast-bar"></div>
        `;
        container.appendChild(toast);

        const remove = () => {
            toast.classList.add('leaving');
            toast.addEventListener('animationend', () => toast.remove(), { once: true });
        };
        setTimeout(remove, 3500);
    }

    // ── AJAX form handler ──
    document.querySelectorAll('form[data-ajax]').forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            const btn        = this.querySelector('.btn');
            const previewSel = this.dataset.preview;
            const previewImg = previewSel ? document.querySelector(previewSel) : null;
            const previewBox = previewImg ? previewImg.closest('.preview-box') : null;

            btn.classList.add('loading');
            if (previewBox) previewBox.classList.add('updating');

            try {
                const res  = await fetch('dashboard.php', {
                    method:  'POST',
                    headers: { 'X-Requested-With': 'XMLHttpRequest' },
                    body:    new FormData(this),
                });
                const data = await res.json();

                if (data.new_path && previewImg) {
                    previewImg.src = data.new_path + '?t=' + Date.now();
                }

                const hasWarning = data.success && data.msg.includes('could not be removed');
                const toastType  = !data.success ? 'error' : hasWarning ? 'warn' : 'success';
                showToast(data.msg, toastType);

                const fileInput = this.querySelector('input[type="file"]');
                if (fileInput) fileInput.value = '';

            } catch (err) {
                showToast('Connection error. Please try again.', 'error');
            } finally {
                btn.classList.remove('loading');
                if (previewBox) previewBox.classList.remove('updating');
            }
        });
    });
</script>

</body>
</html>