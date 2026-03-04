<?php
/**
 * Public - MSPO Public Notifications Display Page
 * Fetches from documents table where category = 'MSPO Public Notifications'
 */

header('Content-Type: text/html; charset=utf-8');

// Database connection
try {
    $pdo = new PDO(
        'mysql:host=localhost;dbname=dima_production;charset=utf8mb4',
        'root',
        '',
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
} catch (PDOException $e) {
    die('Database connection failed: ' . $e->getMessage());
}

// Fetch active notifications from documents table
try {
    $stmt = $pdo->prepare("
        SELECT id, title, description, file_path, year, month, audit_status, updated_at, created_at 
        FROM documents 
        WHERE category = 'MSPO Public Notifications' AND status = 'Active'
        ORDER BY year DESC, month DESC, updated_at DESC
        LIMIT 500
    ");
    $stmt->execute();
    $notifications = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (Exception $e) {
    $notifications = [];
    $error = 'Error fetching notifications: ' . $e->getMessage();
}

$MONTH_NAMES = ['', 'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'];

// Group notifications by year, then optionally by month
$grouped = [];
foreach ($notifications as $notif) {
    $year = $notif['year'] ?: date('Y', strtotime($notif['created_at']));
    $month = $notif['month'] ? intval($notif['month']) : 0; // 0 = no month
    
    if (!isset($grouped[$year])) {
        $grouped[$year] = [];
    }
    if (!isset($grouped[$year][$month])) {
        $month_name = $month > 0 ? $MONTH_NAMES[$month] : 'General';
        $grouped[$year][$month] = ['name' => $month_name, 'items' => []];
    }
    
    $grouped[$year][$month]['items'][] = $notif;
}

// Sort by year descending, then month descending
krsort($grouped);
foreach ($grouped as &$year_data) {
    krsort($year_data);
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MSPO Public Notifications - DIMA</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
            background: #f5f7fa;
            color: #333;
        }

        .container {
            max-width: 900px;
            margin: 0 auto;
            padding: 30px 20px;
        }

        .header {
            background: white;
            border-radius: 8px;
            padding: 30px;
            margin-bottom: 30px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            border-bottom: 4px solid #667eea;
        }

        .header h1 {
            font-size: 32px;
            color: #1a1a1a;
            margin-bottom: 10px;
        }

        .header p {
            color: #666;
            font-size: 14px;
        }

        .year-section {
            margin-bottom: 40px;
        }

        .year-title {
            font-size: 28px;
            font-weight: 700;
            color: #667eea;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #e0e0e0;
        }

        .month-section {
            margin-bottom: 25px;
            background: white;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .month-title {
            font-size: 18px;
            font-weight: 600;
            color: #555;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 1px solid #f0f0f0;
        }

        .notification-item {
            padding: 12px 0;
            border-bottom: 1px solid #f5f5f5;
        }

        .notification-item:last-child {
            border-bottom: none;
        }

        .notification-link {
            color: #667eea;
            text-decoration: none;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 8px 0;
        }

        .notification-link:hover {
            text-decoration: underline;
            color: #5568d3;
        }

        .notification-date {
            display: inline-block;
            font-size: 12px;
            color: #999;
            margin-left: 10px;
        }

        .badge-audit {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 3px;
            font-size: 11px;
            font-weight: 600;
            white-space: nowrap;
        }

        .badge-upcoming {
            background: #fff3cd;
            color: #856404;
        }

        .badge-past {
            background: #d1ecf1;
            color: #0c5460;
        }

        .empty-state {
            background: white;
            border-radius: 8px;
            padding: 60px 40px;
            text-align: center;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .empty-state p {
            color: #999;
            font-size: 16px;
        }

        .back-link {
            display: inline-block;
            padding: 10px 20px;
            background: white;
            color: #667eea;
            text-decoration: none;
            border-radius: 6px;
            margin-top: 20px;
            font-weight: 500;
            border: 1px solid #ddd;
            transition: all 0.2s;
        }

        .back-link:hover {
            background: #f5f7fa;
            border-color: #667eea;
        }

        .error {
            background: #fee;
            color: #c33;
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 20px;
            border-left: 4px solid #c33;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>MSPO Public Notifications</h1>
            <p>Latest notifications and audit updates from MSPO</p>
        </div>

        <?php if (isset($error)): ?>
            <div class="error">
                <?php echo htmlspecialchars($error); ?>
            </div>
        <?php endif; ?>

        <?php if (!empty($grouped)): ?>
            <?php foreach ($grouped as $year => $months): ?>
                <div class="year-section">
                    <div class="year-title"><?php echo $year; ?></div>
                    
                    <?php foreach ($months as $month => $month_data): ?>
                        <div class="month-section">
                            <div class="month-title"><?php echo $month_data['name']; ?></div>
                            
                            <?php foreach ($month_data['items'] as $notification): ?>
                                <div class="notification-item">
                                    <a href="<?php echo htmlspecialchars($notification['file_path']); ?>" 
                                       class="notification-link" 
                                       target="_blank"
                                       title="<?php echo htmlspecialchars($notification['title']); ?>">
                                        <span><?php echo htmlspecialchars($notification['title']); ?></span>
                                        <?php if (!empty($notification['audit_status'])): ?>
                                            <span class="badge-audit <?php echo $notification['audit_status'] === 'Upcoming Audit' ? 'badge-upcoming' : 'badge-past'; ?>">
                                                <?php echo htmlspecialchars($notification['audit_status']); ?>
                                            </span>
                                        <?php endif; ?>
                                    </a>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php endforeach; ?>
        <?php else: ?>
            <div class="empty-state">
                <p>No notifications available at this time.</p>
            </div>
        <?php endif; ?>

        <div style="text-align: center;">
            <a href="<?= defined('BASE_PATH') ? BASE_PATH : '' ?>/" class="back-link">← Back to Home</a>
        </div>
    </div>
</body>
</html>
