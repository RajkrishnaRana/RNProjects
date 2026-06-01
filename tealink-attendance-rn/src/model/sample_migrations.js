import { addColumns, createTable, schemaMigrations, unsafeExecuteSql } from '@nozbe/watermelondb/Schema/migrations';
import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const migrations = schemaMigrations({
    migrations: [
        {
            toVersion: 2,
            steps: [
                createTable({
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
                }),
                createTable({
                    name: 'section_master',
                    columns: [
                        { name: 'section_id', type: 'string', isIndexed: true },
                        { name: 'section_code', type: 'string' },
                        { name: 'section_name', type: 'string' },
                        { name: 'section_is_active', type: 'boolean' },
                        { name: 'created_at', type: 'number' },
                        { name: 'updated_at', type: 'number' },
                    ],
                }),
                createTable({
                    name: 'book_master',
                    columns: [
                        { name: 'book_id', type: 'string', isIndexed: true },
                        { name: 'book_name', type: 'string' },
                        { name: 'created_at', type: 'number' },
                        { name: 'updated_at', type: 'number' },
                    ],
                }),
            ],
        },
        {
            toVersion: 3,
            steps: [
                /* 1. kamjari_master – add temp column */
                addColumns({
                    table: 'kamjari_master',
                    columns: [{ name: 'temp_column', type: 'string', isOptional: true }],
                }),

                /* 2. section_master – rename section_name → section_description */

                /* 3. book_master – drop book_name column */
            ],
        },
        {
            toVersion: 4,
            steps: [
                /* 1. create the new table (helper) */
                createTable({
                    name: 'book_master_new',
                    columns: [
                        { name: 'book_id', type: 'string', isIndexed: true },
                        { name: 'created_at', type: 'number' },
                        { name: 'updated_at', type: 'number' },
                    ],
                }),

                /* 2. copy rows (raw SQL – no helper exists) */
                unsafeExecuteSql(`
                    INSERT INTO book_master_new (id, book_id, created_at, updated_at)
                    SELECT id, book_id, created_at, updated_at
                    FROM book_master;
                `),

                /* 3. drop old table (helper) */
                unsafeExecuteSql(`DROP TABLE book_master;`),

                /* 4. rename new table (raw SQL – no helper exists) */
                unsafeExecuteSql(`ALTER TABLE book_master_new RENAME TO book_master;`),

                /* 5. recreate index (raw SQL – no helper exists) */
                unsafeExecuteSql(`CREATE INDEX book_master_book_id_index ON book_master (book_id);`),
            ],
        },
    ],
});

// TABLE SCHEMA
const workerMaster = tableSchema({
    name: 'worker_master',
    columns: [
        { name: 'worker_id', type: 'string', isIndexed: true },
        { name: 'worker_name', type: 'string' },
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

const sectionMaster = tableSchema({
    name: 'section_master',
    columns: [
        { name: 'section_id', type: 'string', isIndexed: true },
        { name: 'section_code', type: 'string' },
        { name: 'section_name', type: 'string' },
        { name: 'section_is_active', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
    ],
});

const bookMaster = tableSchema({
    name: 'book_master',
    columns: [
        { name: 'book_id', type: 'string', isIndexed: true },
        { name: 'book_name', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
    ],
});

const bookMasterNew = tableSchema({
    name: 'book_master_new',
    columns: [
        { name: 'book_id', type: 'string', isIndexed: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
    ],
});

export default appSchema({
    version: 4,
    tables: [workerMaster, kamjariMaster, sectionMaster, bookMaster, bookMasterNew],
});

// This file is sample migration file for the watermelon db
