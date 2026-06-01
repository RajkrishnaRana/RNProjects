import { Model } from '@nozbe/watermelondb';
import { field, date, readonly } from '@nozbe/watermelondb/decorators';

export default class SectionMaster extends Model {
    static table = 'section_master';

    @field('section_id') sectionId;
    @field('section_code') sectionCode;
    @field('section_name') sectionName;
    @field('section_is_active') sectionIsActive;

    @readonly @date('created_at') createdAt;
    @readonly @date('updated_at') updatedAt;
}
