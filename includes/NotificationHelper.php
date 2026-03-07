<?php
/**
 * Notification Helper
 * Creates notification records when client submissions are saved.
 * Fire-and-forget: failures are logged but never interrupt the main flow.
 */

function create_notification(string $type, int $submission_id, ?string $name = null, ?string $email = null): void {
    try {
        // Build a short human-readable message
        $typeLabels = [
            'quotation' => 'New Quotation Request',
            'contact'   => 'New Contact Request',
            'complaint' => 'New Complaint',
            'appeal'    => 'New Appeal',
            'feedback'  => 'New Feedback',
        ];
        $label = $typeLabels[$type] ?? 'New Submission';
        $msg = $label;
        if (!empty($name)) {
            $msg .= ' from ' . $name;
        }

        Database::insert('notifications', [
            'type'          => $type,
            'submission_id' => $submission_id,
            'name'          => $name,
            'email'         => $email,
            'message'       => mb_substr($msg, 0, 500),
            'read_at'       => null,
        ]);
    } catch (Exception $e) {
        error_log('Notification creation failed: ' . $e->getMessage());
    }
}
