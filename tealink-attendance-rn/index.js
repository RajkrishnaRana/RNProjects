/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import schema from './src/model/schema';
import migrations from './src/model/migrations';
import WorkerMaster from './src/model/workerMaster';
import KamjariMaster from './src/model/kamjariMaster';
import BookMaster from './src/model/bookMaster';
import SectionMaster from './src/model/sectionMaster';
import AttendanceMaster from './src/model/attendanceMaster';
import AuthorizedUserMaster from './src/model/authorizedUserMaster';
import ConfigMaster from './src/model/configMaster';
import FileUploadMaster from './src/model/fileUploadMaster';
import NotificationMaster from './src/model/notificationMaster';
import OfflineMaster from './src/model/offlineMaster';
import PluckedQuantityMaster from './src/model/pluckedQuantityMaster';
import RequestHeaderMaster from './src/model/requestHeaderMaster';
import RequestParamMaster from './src/model/requestParamMaster';
import ShiftMaster from './src/model/shiftMaster';
import SyncMaster from './src/model/syncMaster';
import WorkerTypeMaster from './src/model/workerTypeMaster';
import BatchMaster from './src/model/batchMaster';
// import { enableScreens } from 'react-native-screens';

// enableScreens(false);

let database;

// WatermelonDB SQLiteAdapter uses native/JSi. Avoid instantiating it in Jest.
if (process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID) {
    database = {};
} else {
    const adapter = new SQLiteAdapter({
        schema,
        migrations,
        jsi: true,
        onSetUpError: error => {
            console.log(error);
        },
    });

    // Then, make a Watermelon database from it!
    database = new Database({
        adapter,
        modelClasses: [
            AttendanceMaster,
            AuthorizedUserMaster,
            BatchMaster,
            BookMaster,
            ConfigMaster,
            FileUploadMaster,
            KamjariMaster,
            NotificationMaster,
            OfflineMaster,
            PluckedQuantityMaster,
            RequestHeaderMaster,
            RequestParamMaster,
            SectionMaster,
            ShiftMaster,
            SyncMaster,
            WorkerMaster,
            WorkerTypeMaster,
        ],
    });
}

export { database };

AppRegistry.registerComponent(appName, () => App);
