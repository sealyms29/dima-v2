<?php
/**
 * Public - Downloadable Documents Display Page
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

// Fetch active documents grouped by category
try {
    $stmt = $pdo->prepare('
        SELECT id, title, description, category, file_path, year, month, audit_status, updated_at, download_count 
        FROM documents 
        WHERE status = "Active" 
        ORDER BY category ASC, year DESC, month DESC, title ASC
        LIMIT 100
    ');
    $stmt->execute();
    $all_documents = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Group by category
    $documents_by_category = [];
    foreach ($all_documents as $doc) {
        if (!isset($documents_by_category[$doc['category']])) {
            $documents_by_category[$doc['category']] = [];
        }
        $documents_by_category[$doc['category']][] = $doc;
    }
} catch (Exception $e) {
    $documents_by_category = [];
    $error = 'Error fetching documents: ' . $e->getMessage();
}

$category_order = ['MSPO Public Report Summary', 'MSPO Public Notifications'];
uksort($documents_by_category, function($a, $b) use ($category_order) {
    $pos_a = array_search($a, $category_order);
    $pos_b = array_search($b, $category_order);
    return ($pos_a !== false ? $pos_a : 999) - ($pos_b !== false ? $pos_b : 999);
});
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Downloadable Documents - DIMA</title>
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

        .programme-section {
            margin-bottom: 30px;
        }

        .programme-title {
            font-size: 24px;
            font-weight: 700;
            color: #667eea;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #e0e0e0;
        }

        .forms-list {
            background: white;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
            overflow: hidden;
        }

        .form-item {
            padding: 16px 20px;
            border-bottom: 1px solid #f0f0f0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 20px;
        }

        .form-item:last-child {
            border-bottom: none;
        }

        .form-item:hover {
            background: #f9f9f9;
        }

        .form-info {
            flex: 1;
        }

        .form-name {
            font-weight: 600;
            color: #1a1a1a;
            margin-bottom: 5px;
        }

        .form-details {
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
            font-size: 12px;
            color: #999;
        }

        .form-type-badge {
            display: inline-block;
            background: #e8f0f7;
            color: #1a6aa0;
            padding: 3px 8px;
            border-radius: 4px;
            font-weight: 600;
            font-size: 11px;
        }

        .download-btn {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 8px 16px;
            background: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 600;
            transition: background 0.2s, transform 0.1s;
            border: none;
            cursor: pointer;
            white-space: nowrap;
            flex-shrink: 0;
        }

        .download-btn:hover {
            background: #5568d3;
            transform: scale(1.02);
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

        @media (max-width: 768px) {
            .form-item {
                flex-direction: column;
                align-items: flex-start;
            }

            .download-btn {
                width: 100%;
                justify-content: center;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Downloadable Documents</h1>
            <p>Download forms and documents for certification programmes</p>
        </div>

        <?php if (isset($error)): ?>
            <div class="error">
                <?php echo htmlspecialchars($error); ?>
            </div>
        <?php endif; ?>

        <?php if (!empty($documents_by_category)): ?>
            <?php foreach ($documents_by_category as $category => $documents): ?>
                <div class="programme-section">
                    <h2 class="programme-title"><?php echo htmlspecialchars($category); ?></h2>
                    <div class="forms-list">
                        <?php foreach ($documents as $doc): ?>
                            <div class="form-item">
                                <div class="form-info">
                                    <div class="form-name"><?php echo htmlspecialchars($doc['title']); ?></div>
                                    <?php if ($doc['description']): ?>
                                        <p style="font-size: 13px; color: #666; margin-top: 5px;">
                                            <?php echo htmlspecialchars(substr($doc['description'], 0, 100)); ?>
                                        </p>
                                    <?php endif; ?>
                                    <div class="form-details">
                                        <span class="form-type-badge">PDF</span>
                                        <span><?php echo $doc['year']; ?></span>
                                        <span><?php echo date('M d, Y', strtotime($doc['updated_at'])); ?></span>
                                    </div>
                                </div>
                                <a href="<?php echo htmlspecialchars($doc['file_path']); ?>" class="download-btn" download>
                                    📥 Download
                                </a>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>
            <?php endforeach; ?>
        <?php else: ?>
            <div class="empty-state">
                <p>No documents available at this time.</p>
            </div>
        <?php endif; ?>

        <div style="text-align: center;">
            <a href="<?= defined('BASE_PATH') ? BASE_PATH : '' ?>/" class="back-link">← Back to Home</a>
        </div>
    </div>
</body>
</html>
