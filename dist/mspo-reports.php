<?php
/**
 * Public - MSPO Public Summary Reports Display Page
 * Fetches from documents table where category = 'MSPO Public Report Summary'
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

// Fetch active reports from documents table
try {
    $stmt = $pdo->prepare("
        SELECT id, title, description, file_path, year, month, updated_at, created_at 
        FROM documents 
        WHERE category = 'MSPO Public Report Summary' AND status = 'Active'
        ORDER BY year DESC, month DESC, updated_at DESC
        LIMIT 500
    ");
    $stmt->execute();
    $reports = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (Exception $e) {
    $reports = [];
    $error = 'Error fetching reports: ' . $e->getMessage();
}

$MONTH_NAMES = ['', 'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'];

// Group reports by year, then optionally by month
$grouped = [];
foreach ($reports as $report) {
    $year = $report['year'] ?: date('Y', strtotime($report['created_at']));
    $month = $report['month'] ? intval($report['month']) : 0;
    
    if (!isset($grouped[$year])) {
        $grouped[$year] = [];
    }
    if (!isset($grouped[$year][$month])) {
        $month_name = $month > 0 ? $MONTH_NAMES[$month] : 'General';
        $grouped[$year][$month] = ['name' => $month_name, 'items' => []];
    }
    
    $grouped[$year][$month]['items'][] = $report;
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
    <title>MSPO Reports - DIMA</title>
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

        .report-item {
            padding: 12px 0;
            border-bottom: 1px solid #f5f5f5;
        }

        .report-item:last-child {
            border-bottom: none;
        }

        .report-link {
            color: #667eea;
            text-decoration: none;
            font-weight: 500;
            display: block;
            padding: 8px 0;
        }

        .report-link:hover {
            text-decoration: underline;
            color: #5568d3;
        }

        .report-date {
            display: inline-block;
            font-size: 12px;
            color: #999;
            margin-left: 10px;
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
            <h1>MSPO Public Summary Reports</h1>
            <p>Annual and periodic reports from MSPO</p>
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
                            
                            <?php foreach ($month_data['items'] as $report): ?>
                                <div class="report-item">
                                    <a href="<?php echo htmlspecialchars($report['file_path']); ?>" 
                                       class="report-link" 
                                       target="_blank"
                                       title="<?php echo htmlspecialchars($report['title']); ?>">
                                        <?php echo htmlspecialchars($report['title']); ?>
                                    </a>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php endforeach; ?>
        <?php else: ?>
            <div class="empty-state">
                <p>No reports available at this time.</p>
            </div>
        <?php endif; ?>

        <div style="text-align: center;">
            <a href="<?= defined('BASE_PATH') ? BASE_PATH : '' ?>/" class="back-link">← Back to Home</a>
        </div>
    </div>
</body>
</html>
