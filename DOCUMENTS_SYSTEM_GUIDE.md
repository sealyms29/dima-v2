# DIMA Admin Panel - Documents System Implementation

## Overview
Replaced the web forms module with a comprehensive Documents Management System. Admin can now manage downloadable PDFs and external resources for ISO and MSPO certification programmes.

---

## Files Changed/Added/Removed

### NEW FILES CREATED (Backend)
1. **`/includes/DocumentsManager.php`** - Document operations helper class
2. **`/api/admin-documents.php`** - Documents CRUD API endpoints
3. **`/api/admin-documents-upload.php`** - File upload handler
4. **`/api/admin-documents-replace.php`** - File replacement handler
5. **`/admin/documents.php`** - Admin Documents management page (full UI)
6. **`database_migration_documents.sql`** - Database migration script
7. **`database_setup_documents.sql`** - Complete setup guide with sample data

### FILES MODIFIED
1. **`/admin/index.php`** - Updated navigation: "Forms" → "Documents"
2. **`/admin/content.php`** - Updated navigation link
3. **`/public/downloadable-forms.php`** - Updated to fetch from `documents` table
4. **`/includes/bootstrap.php`** - Added global `log_activity()` function

### FILES REMOVED
1. **`/admin/forms.php`** - Old web forms management page (DELETED)
2. **`/api/admin-forms.php`** - Old web forms API (DELETED)

---

## Database Changes

### New Table: `documents`
```sql
CREATE TABLE documents (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description LONGTEXT,
    category ENUM('MSPO', 'ISO9001', 'ISO14001', 'ISO45001', 'General'),
    type ENUM('PDF', 'ExternalLink'),
    file_path VARCHAR(500),  -- For PDFs
    external_url VARCHAR(500),  -- For links
    status ENUM('Active', 'Archived'),
    version VARCHAR(50),
    file_size INT UNSIGNED,
    mime_type VARCHAR(100),
    download_count INT UNSIGNED DEFAULT 0,
    updated_at TIMESTAMP,
    created_at TIMESTAMP
);
```

### Sample Data Inserted
- ISO 9001 Application Form
- ISO 9001 Pre-Audit Questionnaire
- ISO 14001 Application Form
- ISO 45001 Application Form
- MSPO Initial Assessment Document
- MSPO Surveillance Audit Checklist
- General Audit Schedule Template

---

## How to Setup

### Step 1: Database Migration
```bash
# Run the migration script in phpMyAdmin or command line:
mysql -u root -p dima_production < database_migration_documents.sql
```

### Step 2: Create Upload Directory
```bash
# Create documents upload directory
mkdir -p /var/www/html/DIMA/uploads/documents
chmod 755 /var/www/html/DIMA/uploads/documents
```

On Windows (PowerShell):
```powershell
New-ItemProperty -Path "c:\xampp\htdocs\DIMA\uploads\" -Name "documents" -ItemType Directory -Force
```

### Step 3: Verify Files
```bash
# Check that new files exist:
ls /var/www/html/DIMA/admin/documents.php
ls /var/www/html/DIMA/api/admin-documents.php
ls /var/www/html/DIMA/includes/DocumentsManager.php
```

### Step 4: Test the Admin Panel
1. Navigate to `http://localhost/DIMA/admin/`
2. Login with credentials: `admin` / `admin123`
3. Click on "Documents" tab (replaces "Forms")
4. You should see the sample documents listed

---

## Admin Panel Features

### Documents Management Page (`/admin/documents.php`)
Features:
- **View all documents** organized by category
- **Filter by**: Category, Status, Type, Title (search)
- **Upload new document**: 
  - Title, Description, Category, Version
  - PDF file validation (max 10MB)
  - Automatic filename sanitization
- **Edit document metadata**:
  - Update title, description, category, status, version
  - Replace PDF file (for PDF type documents)
  - Delete document
- **Preview PDFs** directly in browser
- **Copy public link** for sharing
- **Track downloads** count for each document
- **Toggle Active/Archived** status

### File Management
- Max file size: 10MB
- Allowed types: PDF only
- Files stored in: `/uploads/documents/`
- Safe filenames: Sanitized + timestamp
- Files served with stable URLs: `/DIMA/uploads/documents/filename.pdf`

---

## API Endpoints

### GET /api/admin-documents.php
List documents with optional filters
```bash
?category=ISO9001
?status=Active
?type=PDF
?search=formname (searches title)
```

### POST /api/admin-documents.php
Create document record (metadata only)
```json
{
    "title": "Document Title",
    "description": "...",
    "category": "ISO9001",
    "type": "PDF|ExternalLink",
    "status": "Active|Archived",
    "version": "1.0"
}
```

### POST /api/admin-documents-upload.php
Upload new document with file
```
FormData:
- title (required)
- description
- category (required)
- version
- file (PDF file, required)
```

### PATCH /api/admin-documents.php
Update document metadata
```
Fields: id, title, description, category, status, version
```

### POST /api/admin-documents-replace.php
Replace PDF file for existing document
```
FormData:
- id (document ID)
- file (new PDF file)
```

### DELETE /api/admin-documents.php?id=123
Delete document and file

---

## Public Pages Updated

### /public/downloadable-forms.php
**Before**: Fetched from nonexistent `downloadable_forms` table
**After**: 
- Fetches from new `documents` table
- Displays by category (MSPO, ISO9001, ISO14001, ISO45001, General)
- Shows title, description, version, update date
- Links for PDF downloads or external links
- Clean, organized layout with cards

**URL**: `http://localhost/DIMA/public/downloadable-forms.php`

### /public/mspo-notifications.php
**Status**: Unchanged (still uses separate mspo_notifications table)
**Note**: Can be extended to reference documents for MSPO reports/resources

### /public/mspo-reports.php
**Status**: Unchanged (separate table for reports)

---

## Authentication

### Current Setup (Development)
- Simple hardcoded credentials in `/admin/login.php`
- Username: `admin`
- Password: `admin123`
- Session-based authentication

### For Production
- Use database-backed authentication with `admin_users` table
- Implement password hashing (bcrypt)
- Upgrade to multi-user with roles (admin, reviewer, viewer)
- Implement 2FA using TOTP/OATH tokens

---

## Activity Logging

Admin actions are logged to `admin_logs` table:
- Document uploads
- File replacements
- Metadata edits
- Document deletions
- Timestamp, user ID, IP address recorded

Query recent activity:
```sql
SELECT * FROM admin_logs 
WHERE table_name = 'documents' 
ORDER BY created_at DESC 
LIMIT 20;
```

---

## DocumentsManager Class API

### Static Methods

**Validation**
```php
DocumentsManager::isValidCategory($category)
DocumentsManager::isValidType($type)
DocumentsManager::isValidStatus($status)
```

**File Operations**
```php
DocumentsManager::ensureUploadDir()
DocumentsManager::generateSafeFilename($original_name)
DocumentsManager::validateUploadedFile($file)
DocumentsManager::saveUploadedFile($file)
DocumentsManager::deleteFile($file_path)
DocumentsManager::replaceDocumentFile($id, $file)
```

**Document CRUD**
```php
DocumentsManager::getDocuments($filters)
DocumentsManager::getDocumentById($id)
DocumentsManager::createDocument($data)
DocumentsManager::updateDocument($id, $data)
DocumentsManager::deleteDocument($id)
DocumentsManager::getPublicUrl($id)
DocumentsManager::incrementDownloadCount($id)
```

---

## Error Handling

### File Upload Validation
- File size check (max 10MB)
- MIME type verification (application/pdf)
- Magic bytes check (%PDF signature)
- Filename sanitization

### Database Operations
- Transaction support for data integrity
- Foreign key constraints
- Prepared statements (SQL injection prevention)
- Detailed error logging

### API Responses
```json
{
    "success": true/false,
    "message": "Human readable message",
    "data": {...},
    "errors": {...}
}
```

---

## Security Features

1. **Session Security**
   - Secure cookies (HTTPOnly, SameSite=Strict)
   - Session timeout (1 hour)
   - HTTPS support (configurable)

2. **File Security**
   - PDF-only validation
   - Malware scanning (optional via integration)
   - Filename sanitization
   - Subdirectory isolation (/uploads/documents/)

3. **API Security**
   - Authentication check on all endpoints
   - Input validation and sanitization
   - Output escaping
   - Prepared statements (PDO)

4. **Database Security**
   - PDO prepared statements
   - Type casting for IDs (intval)
   - HTML entity escaping on output

---

## Testing Checklist

- [ ] Database migration completed
- [ ] `/uploads/documents/` directory created with 755 permissions
- [ ] Admin login works with admin/admin123
- [ ] Documents tab visible in admin navigation
- [ ] Can upload a sample PDF
- [ ] Document appears in the list
- [ ] Can edit document metadata
- [ ] Can delete a document
- [ ] Public page `/public/downloadable-forms.php` loads
- [ ] Public page displays documents by category
- [ ] PDF download links work
- [ ] Admin activity logged to `admin_logs` table

---

## Troubleshooting

### "File upload failed"
- Check `/uploads/documents/` directory exists and is writable
- Verify PDF file is valid (not corrupted)
- Check max file size setting in config.php (currently 10MB)

### "Unauthorized" on API
- Verify admin session is active
- Check cookie settings in config.php
- Clear browser cookies and re-login

### Documents not showing in public page
- Verify status is set to "Active"
- Check database connection in downloadable-forms.php
- Verify MySQL user has SELECT permission on documents table

### File path broken on public page
- If using external server, update file path in document record
- Check web server document root matches assumptions
- Verify public URL rewriting (htaccess) if needed

---

## Migration Path from Old Forms

If you had web forms before:
1. Keep `admin_forms` table for archive
2. Manually create `documents` records for existing forms
3. Update any code referencing `admin_forms` to use `documents`
4. Eventually deprecate and remove `admin_forms` table

---

## Future Enhancements

1. **Document Versioning**
   - Track multiple versions of same document
   - Show version history
   - Easy rollback to previous version

2. **Access Control**
   - Multi-user admin with roles
   - Document category-specific permissions
   - Download tracking by user

3. **Document Organization**
   - Tags in addition to categories
   - Nested categories/folders
   - Custom metadata fields

4. **Integration**
   - Audit trail integration
   - Automated PDF generation
   - Email notifications on new documents

5. **Advanced Search**
   - Full-text search in PDF content
   - Autocomplete suggestions
   - Search history tracking

---

## Support

For issues or questions:
1. Check error logs: `/logs/error.log`
2. Review database: SELECT * FROM admin_logs WHERE action LIKE '%document%'
3. Check browser console for JavaScript errors
4. Verify database schema matches migration script

---

## Version History

**v1.0** - Initial implementation
- Documents table created
- Admin management page implemented
- Public display page updated
- PDF upload and file management
- Sample documents inserted

---
