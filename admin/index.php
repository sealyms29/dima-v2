<?php
/**
 * Admin Dashboard - Main Overview Page
 */

require_once __DIR__ . '/../includes/bootstrap.php';

// Authentication check
if (!isset($_SESSION['admin_user_id'])) {
    header('Location: /admin/login.php');
    exit;
}

// Get submission counts
try {
    $quotation_new = Database::fetchOne(
        "SELECT COUNT(*) as total FROM quotations WHERE status = ?",
        ['new']
    );
    $quotation_new = $quotation_new['total'] ?? 0;
    
    $quotation_total = Database::fetchOne(
        "SELECT COUNT(*) as total FROM quotations"
    );
    $quotation_total = $quotation_total['total'] ?? 0;
    
    $contact_new = Database::fetchOne(
        "SELECT COUNT(*) as total FROM contacts WHERE status = ?",
        ['new']
    );
    $contact_new = $contact_new['total'] ?? 0;
    
    $contact_total = Database::fetchOne(
        "SELECT COUNT(*) as total FROM contacts"
    );
    $contact_total = $contact_total['total'] ?? 0;
    
    $complaint_new = Database::fetchOne(
        "SELECT COUNT(*) as total FROM complaints WHERE status = ?",
        ['new']
    );
    $complaint_new = $complaint_new['total'] ?? 0;
    
    $complaint_total = Database::fetchOne(
        "SELECT COUNT(*) as total FROM complaints"
    );
    $complaint_total = $complaint_total['total'] ?? 0;

    // Get recent submissions (last 10)
    $recent = Database::fetchAll(
        "SELECT 'quotation' as type, id, name, email, status, created_at FROM quotations 
         UNION ALL
         SELECT 'contact' as type, id, name, email, status, created_at FROM contacts
         UNION ALL
         SELECT 'complaint' as type, id, name, email, status, created_at FROM complaints
         ORDER BY created_at DESC LIMIT 10"
    );

} catch (Exception $e) {
    error_log('Dashboard error: ' . $e->getMessage());
    $quotation_new = $quotation_total = 0;
    $contact_new = $contact_total = 0;
    $complaint_new = $complaint_total = 0;
    $recent = [];
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - DIMA</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: #f5f7fa;
            color: #333;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
        }

        header {
            background: white;
            padding: 20px;
            border-bottom: 1px solid #e0e0e0;
            margin-bottom: 20px;
            border-radius: 4px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        h1 {
            font-size: 24px;
            color: #1a1a1a;
        }

        .user-info {
            font-size: 14px;
            color: #666;
        }

        .logout-btn {
            background: #dc3545;
            color: white;
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            text-decoration: none;
            font-size: 14px;
        }

        .logout-btn:hover {
            background: #c82333;
        }

        nav {
            background: white;
            padding: 15px 20px;
            border-bottom: 1px solid #e0e0e0;
            margin-bottom: 20px;
            border-radius: 4px;
        }

        nav a {
            display: inline-block;
            padding: 8px 16px;
            margin-right: 10px;
            background: #f0f0f0;
            color: #333;
            text-decoration: none;
            border-radius: 4px;
            font-size: 14px;
        }

        nav a:hover {
            background: #e0e0e0;
        }

        nav a.active {
            background: #007bff;
            color: white;
        }

        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .card {
            background: white;
            padding: 20px;
            border-radius: 4px;
            border: 1px solid #e0e0e0;
        }

        .card h3 {
            font-size: 14px;
            color: #666;
            margin-bottom: 10px;
            text-transform: uppercase;
        }

        .card-stat {
            font-size: 32px;
            font-weight: bold;
            color: #007bff;
            margin-bottom: 5px;
        }

        .card-substat {
            font-size: 14px;
            color: #999;
        }

        .card-link {
            display: inline-block;
            margin-top: 10px;
            color: #007bff;
            text-decoration: none;
            font-size: 14px;
        }

        .card-link:hover {
            text-decoration: underline;
        }

        .recent-section {
            background: white;
            padding: 20px;
            border-radius: 4px;
            border: 1px solid #e0e0e0;
        }

        .recent-section h2 {
            font-size: 18px;
            margin-bottom: 15px;
            color: #1a1a1a;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
        }

        th {
            background: #f5f5f5;
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #ddd;
            font-weight: 600;
        }

        td {
            padding: 10px;
            border-bottom: 1px solid #f0f0f0;
        }

        tr:hover {
            background: #fafafa;
        }

        .badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 3px;
            font-size: 12px;
            font-weight: 500;
        }

        .badge-new {
            background: #fff3cd;
            color: #856404;
        }

        .badge-viewed {
            background: #d1ecf1;
            color: #0c5460;
        }

        .badge-responded {
            background: #d4edda;
            color: #155724;
        }

        .badge-closed {
            background: #f8f9fa;
            color: #383d41;
        }

        .type-badge {
            font-size: 12px;
            padding: 3px 6px;
            border-radius: 3px;
            background: #e9ecef;
            color: #495057;
        }

        .empty-message {
            text-align: center;
            padding: 30px;
            color: #999;
        }

        .quick-actions {
            margin-bottom: 20px;
        }

        .btn {
            display: inline-block;
            padding: 10px 16px;
            background: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            font-size: 14px;
            margin-right: 10px;
            border: none;
            cursor: pointer;
        }

        .btn:hover {
            background: #0056b3;
        }

        .btn-secondary {
            background: #6c757d;
        }

        .btn-secondary:hover {
            background: #5a6268;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Admin Dashboard</h1>
            <div style="display: flex; gap: 20px; align-items: center;">
                <span class="user-info">Logged in as: Admin</span>
                <a href="/admin/logout.php" class="logout-btn">Logout</a>
            </div>
        </header>

        <nav>
            <a href="/admin/" class="active">Dashboard</a>
            <a href="/admin/submissions.php">Submissions</a>
            <a href="/admin/forms.php">Forms</a>
            <a href="/admin/content.php">Content</a>
        </nav>

        <div class="quick-actions">
            <a href="/admin/submissions.php?type=quotation&status=new" class="btn">View New Quotations</a>
            <a href="/admin/submissions.php?type=contact&status=new" class="btn">View New Contacts</a>
            <a href="/admin/submissions.php?type=complaint&status=new" class="btn">View New Complaints</a>
        </div>

        <div class="grid">
            <div class="card">
                <h3>Quotations</h3>
                <div class="card-stat"><?php echo $quotation_new; ?></div>
                <div class="card-substat">New / <?php echo $quotation_total; ?> Total</div>
                <a href="/admin/submissions.php?type=quotation" class="card-link">View All →</a>
            </div>

            <div class="card">
                <h3>Contact Requests</h3>
                <div class="card-stat"><?php echo $contact_new; ?></div>
                <div class="card-substat">New / <?php echo $contact_total; ?> Total</div>
                <a href="/admin/submissions.php?type=contact" class="card-link">View All →</a>
            </div>

            <div class="card">
                <h3>Complaints & Appeals</h3>
                <div class="card-stat"><?php echo $complaint_new; ?></div>
                <div class="card-substat">New / <?php echo $complaint_total; ?> Total</div>
                <a href="/admin/submissions.php?type=complaint" class="card-link">View All →</a>
            </div>
        </div>

        <div class="recent-section">
            <h2>Recent Submissions</h2>
            <?php if (!empty($recent)): ?>
                <table>
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($recent as $item): ?>
                            <tr>
                                <td><span class="type-badge"><?php echo ucfirst($item['type']); ?></span></td>
                                <td><?php echo SecurityHelper::escapeHTML($item['name']); ?></td>
                                <td><?php echo SecurityHelper::escapeHTML($item['email']); ?></td>
                                <td>
                                    <span class="badge badge-<?php echo strtolower($item['status']); ?>">
                                        <?php echo ucfirst(str_replace('_', ' ', $item['status'])); ?>
                                    </span>
                                </td>
                                <td><?php echo date('M d, Y', strtotime($item['created_at'])); ?></td>
                                <td>
                                    <a href="/admin/submission-view.php?type=<?php echo $item['type']; ?>&id=<?php echo $item['id']; ?>" 
                                       style="color: #007bff; text-decoration: none;">View</a>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            <?php else: ?>
                <div class="empty-message">
                    <p>No submissions yet.</p>
                </div>
            <?php endif; ?>
        </div>
    </div>
</body>
</html>
