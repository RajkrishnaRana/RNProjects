import { Model } from '@nozbe/watermelondb';
import { date, field, readonly } from '@nozbe/watermelondb/decorators';

export default class PluckedQuantityMaster extends Model {
    static table = 'plucked_quantity_master';

    @field('plucked_quantity_id') pluckedQuantityId;
    @field('worker_id') workerId;
    @field('batch_id') batchId;
    @field('shift_id') shiftId;
    @field('kamjari_id') kamjariId;
    @field('record_date') recordDate;
    @field('record_quantity') recordQuantity;
    @field('weighment_number') weighmentNumber;
    @field('section_code') sectionCode;
    @field('record_time') recordTime;

    @readonly @date('created_at') createdAt;
    @readonly @date('updated_at') updatedAt;
}
