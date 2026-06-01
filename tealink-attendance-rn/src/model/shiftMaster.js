import { Model } from '@nozbe/watermelondb';
import { date, field, readonly } from '@nozbe/watermelondb/decorators';

export default class ShiftMaster extends Model {
    static table = 'shift_master';

    @field('shift_id') shiftId;
    @field('shift_code') shiftCode;
    @field('kamjari_id') kamjariId;

    @readonly @date('created_at') createdAt;
    @readonly @date('updated_at') updatedAt;
}
