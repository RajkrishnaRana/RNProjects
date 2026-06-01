import { Model } from '@nozbe/watermelondb';
import { date, field, readonly } from '@nozbe/watermelondb/decorators';

export default class FileUploadMaster extends Model {
    static table = 'file_upload_master';

    @field('file_id') fileId;
    @field('request_id') requestId;
    @field('file_path') filePath;
    @field('file_path_second') filePathSecond;
    @field('file_name') fileName;

    @readonly @date('created_at') createdAt;
    @readonly @date('updated_at') updatedAt;
}
