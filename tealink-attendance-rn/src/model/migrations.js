import { schemaMigrations, unsafeExecuteSql } from '@nozbe/watermelondb/Schema/migrations';

export default schemaMigrations({
    migrations: [
        {
            toVersion: 2,
            steps: [
                unsafeExecuteSql('DROP INDEX IF EXISTS sync_master_sync_id;'),
                unsafeExecuteSql('DROP INDEX IF EXISTS worker_type_master_worketype_id;'),
                unsafeExecuteSql('DROP INDEX IF EXISTS authorized_user_master_authorized_user_id;'),
                unsafeExecuteSql('DROP INDEX IF EXISTS batch_master_batch_id;'),
                unsafeExecuteSql('DROP INDEX IF EXISTS book_master_book_id;'),
                unsafeExecuteSql('DROP INDEX IF EXISTS config_master_config_id;'),
                unsafeExecuteSql('DROP INDEX IF EXISTS file_upload_master_file_id;'),
                unsafeExecuteSql('DROP INDEX IF EXISTS notification_master_notification_id;'),
                unsafeExecuteSql('DROP INDEX IF EXISTS plucked_quantity_master_plucked_quantity_id;'),
                unsafeExecuteSql('DROP INDEX IF EXISTS section_master_section_id;'),
                unsafeExecuteSql('DROP INDEX IF EXISTS shift_master_shift_id;'),
                unsafeExecuteSql('CREATE INDEX IF NOT EXISTS attendance_master_attendance_date ON attendance_master(attendance_date);'),
                unsafeExecuteSql('CREATE INDEX IF NOT EXISTS plucked_quantity_master_worker_id ON plucked_quantity_master(worker_id);'),
                unsafeExecuteSql('CREATE INDEX IF NOT EXISTS plucked_quantity_master_record_date ON plucked_quantity_master(record_date);'),
                unsafeExecuteSql('CREATE INDEX IF NOT EXISTS worker_master_worker_name ON worker_master(worker_name);'),
            ],
        },
        {
            toVersion: 3,
            steps: [
                unsafeExecuteSql('ALTER TABLE attendance_master ADD COLUMN shift_id string;'),
                unsafeExecuteSql('ALTER TABLE plucked_quantity_master ADD COLUMN kamjari_id string;'),
                unsafeExecuteSql('ALTER TABLE plucked_quantity_master ADD COLUMN shift_id string;'),
                unsafeExecuteSql('ALTER TABLE plucked_quantity_master ADD COLUMN batch_id string;'),
            ],
        },
    ],
});
