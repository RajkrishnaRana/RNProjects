import { Model } from '@nozbe/watermelondb';
import { date, field, readonly } from '@nozbe/watermelondb/decorators';

export default class AttendanceMaster extends Model {
    static table = 'attendance_master';

    @field('attendance_worker_id') workerId;
    @field('batch_id') batchId;
    @field('shift_id') shiftId;
    @field('section_id') sectionId;
    @field('kamjari_id') kamjariId;
    @field('attendance_date') attendanceDate;
    @field('attendance_time') attendanceTime;

    @readonly @date('created_at') createdAt;
    @readonly @date('updated_at') updatedAt;
}
