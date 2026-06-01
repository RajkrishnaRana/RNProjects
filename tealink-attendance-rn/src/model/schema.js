import { appSchema, tableSchema } from '@nozbe/watermelondb';

// TABLE SCHEMA
const attendanceMaster = tableSchema({
    name: 'attendance_master',
    columns: [
        { name: 'attendance_worker_id', type: 'string' },
        { name: 'batch_id', type: 'string' },
        { name: 'shift_id', type: 'string' },
        { name: 'section_id', type: 'string' },
        { name: 'kamjari_id', type: 'string' },
        { name: 'attendance_date', type: 'string', isIndexed: true },
        { name: 'attendance_time', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
    ],
});

const authorizedUserMaster = tableSchema({
    name: 'authorized_user_master',
    columns: [
        { name: 'authorized_user_id', type: 'string' },
        { name: 'authorized_user_name', type: 'string' },
        { name: 'authorized_user_email', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
    ],
});

const batchMaster = tableSchema({
    name: 'batch_master',
    columns: [
        { name: 'batch_id', type: 'string' },
        { name: 'batch_name', type: 'string' },
        { name: 'div_id', type: 'string' },
        { name: 'shift_id', type: 'string' },
        { name: 'batch_type', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
    ],
});

const bookMaster = tableSchema({
    name: 'book_master',
    columns: [
        { name: 'book_id', type: 'string' },
        { name: 'book_name', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
    ],
});

const configMaster = tableSchema({
    name: 'config_master',
    columns: [
        { name: 'config_id', type: 'string' },
        { name: 'config_value', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
    ],
});

const fileUploadMaster = tableSchema({
    name: 'file_upload_master',
    columns: [
        { name: 'file_id', type: 'string' },
        { name: 'request_id', type: 'number', isIndexed: true },
        { name: 'file_path', type: 'string' },
        { name: 'file_path_second', type: 'string' },
        { name: 'file_name', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
    ],
});

const kamjariMaster = tableSchema({
    name: 'kamjari_master',
    columns: [
        { name: 'kamjari_id', type: 'string', isIndexed: true },
        { name: 'kamjari_code', type: 'string' },
        { name: 'kamjari_name', type: 'string' },
        { name: 'kamjari_is_active', type: 'boolean' },
        { name: 'kamjari_parent_id', type: 'string' },
        { name: 'kamjari_type', type: 'string' },
        { name: 'kamjari_is_default', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
    ],
});

const notificationMaster = tableSchema({
    name: 'notification_master',
    columns: [
        { name: 'notification_id', type: 'string' },
        { name: 'notification_header', type: 'string' },
        { name: 'notification_body', type: 'string' },
        { name: 'notification_time_stamp', type: 'number' },
        { name: 'notification_read', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
    ],
});

const offlineMaster = tableSchema({
    name: 'offline_master',
    columns: [
        { name: 'request_id', type: 'number', isIndexed: true },
        { name: 'request_type', type: 'string' },
        { name: 'request_url', type: 'string' },
        { name: 'request_body', type: 'string' },
        { name: 'request_idendtifier', type: 'string' },
        { name: 'under_processing', type: 'boolean' },
        { name: 'retry_count', type: 'number' },
        { name: 'delete_file', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
    ],
});

const pluckedQuantityMaster = tableSchema({
    name: 'plucked_quantity_master',
    columns: [
        { name: 'plucked_quantity_id', type: 'string' },
        { name: 'worker_id', type: 'string', isIndexed: true },
        { name: 'batch_id', type: 'string' },
        { name: 'shift_id', type: 'string' },
        { name: 'kamjari_id', type: 'string' },
        { name: 'record_date', type: 'string', isIndexed: true },
        { name: 'record_quantity', type: 'number' },
        { name: 'weighment_number', type: 'number' },
        { name: 'section_code', type: 'string' },
        { name: 'record_time', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
    ],
});

const requestHeaderMaster = tableSchema({
    name: 'request_header_master',
    columns: [
        { name: 'request_id', type: 'number', isIndexed: true },
        { name: 'header_name', type: 'string' },
        { name: 'header_value', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
    ],
});

const requestParamMaster = tableSchema({
    name: 'request_param_master',
    columns: [
        { name: 'request_id', type: 'number', isIndexed: true },
        { name: 'param_name', type: 'string' },
        { name: 'param_value', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
    ],
});

const sectionMaster = tableSchema({
    name: 'section_master',
    columns: [
        { name: 'section_id', type: 'string' },
        { name: 'section_code', type: 'string' },
        { name: 'section_name', type: 'string' },
        { name: 'section_is_active', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
    ],
});

const shiftMaster = tableSchema({
    name: 'shift_master',
    columns: [
        { name: 'shift_id', type: 'string' },
        { name: 'shift_code', type: 'string' },
        { name: 'kamjari_id', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
    ],
});

const syncMaster = tableSchema({
    name: 'sync_master',
    columns: [
        { name: 'sync_id', type: 'string' },
        { name: 'last_sync_date', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
    ],
});

const workerMaster = tableSchema({
    name: 'worker_master',
    columns: [
        { name: 'worker_id', type: 'string', isIndexed: true },
        { name: 'worker_name', type: 'string', isIndexed: true },
        { name: 'worker_code', type: 'string' },
        { name: 'worker_gender', type: 'string' },
        { name: 'worker_type_id', type: 'string' },
        { name: 'worker_type_name', type: 'string' },
        { name: 'worker_subtype_id', type: 'string' },
        { name: 'worker_subtype_name', type: 'string' },
        { name: 'worker_book_id', type: 'string' },
        { name: 'worker_book_name', type: 'string' },
        { name: 'worker_kamjari_id', type: 'string' },
        { name: 'worker_kamjari_name', type: 'string' },
        { name: 'worker_section_id', type: 'string' },
        { name: 'worker_section_name', type: 'string' },
        { name: 'worker_emp_number', type: 'number' },
        { name: 'worker_division', type: 'string' },
        { name: 'worker_book_emp_number', type: 'string' },
        { name: 'worker_default_kamjari', type: 'string' },
        { name: 'worker_image_path', type: 'string', isOptional: true },
        { name: 'profile_image', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
    ],
});

const workerTypeMaster = tableSchema({
    name: 'worker_type_master',
    columns: [
        { name: 'workertype_id', type: 'string' },
        { name: 'workertype_name', type: 'string' },
        { name: 'workertype_subtype', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
    ],
});

export default appSchema({
    version: 3,
    tables: [
        attendanceMaster,
        authorizedUserMaster,
        batchMaster,
        bookMaster,
        configMaster,
        fileUploadMaster,
        kamjariMaster,
        notificationMaster,
        offlineMaster,
        pluckedQuantityMaster,
        requestHeaderMaster,
        requestParamMaster,
        sectionMaster,
        shiftMaster,
        syncMaster,
        workerMaster,
        workerTypeMaster,
    ],
});
