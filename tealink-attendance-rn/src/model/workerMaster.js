// src/model/WorkerMaster.js
import { Model } from '@nozbe/watermelondb';
import { field, date, readonly } from '@nozbe/watermelondb/decorators';

export default class WorkerMaster extends Model {
    static table = 'worker_master';

    @field('worker_id') workerId;
    @field('worker_name') workerName;
    @field('worker_code') workerCode;
    @field('worker_gender') workerGender;
    @field('worker_type_id') workerType;
    @field('worker_type_name') workerTypeName;
    @field('worker_subtype_id') workerSubType;
    @field('worker_subtype_name') workerSubTypeName;
    @field('worker_book_id') workerBookId;
    @field('worker_book_name') workerBookName;
    @field('worker_kamjari_id') workerKamjariId;
    @field('worker_kamjari_name') workerKamjariName;
    @field('worker_section_id') workerSectionId;
    @field('worker_section_name') workerSectionName;
    @field('worker_emp_number') workerEmpNo;
    @field('worker_division') workerDivision;
    @field('worker_book_emp_number') workerBookEmpNo;
    @field('worker_default_kamjari') workerDefaultKamjari;
    @field('worker_image_path') workerImagePath;
    @field('profile_image') profileImage;

    @readonly @date('created_at') createdAt;
    @readonly @date('updated_at') updatedAt;
}
