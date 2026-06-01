import { ToastAndroid } from 'react-native';
import { mmkv } from '../store/mmkvStorage';
import { postData } from './apiServices';
import { trigger } from 'react-native-haptic-feedback';

interface CreatedObj {
    tag: string | undefined;
    sectionId: string | undefined;
    time: Date;
    location: Location[];
}

export const storageServices = {
    saveToOfflineStorage: (newObj2: CreatedObj) => {
        try {
            const existingData = mmkv.getString('offlineData');
            const existingArray = existingData ? JSON.parse(existingData) : [];
            existingArray.push(newObj2);
            console.log('When Offline o/p------------', existingArray);
            mmkv.set('offlineData', JSON.stringify(existingArray));
            trigger('impactLight');
            ToastAndroid.show('Data saved offline', ToastAndroid.SHORT);
            mmkv.delete('backgroundLocations'); // wipe background locations data after saving
        } catch (error) {
            console.error('Error saving data offline:', error);
        }
    },

    offlineStorageToUpload: async (baseURL: string, token: string) => {
        try {
            const existingData = mmkv.getString('offlineData');
            const existingArray = existingData ? JSON.parse(existingData) : [];
            console.log('When Offline o/p------------', existingArray);

            if (existingArray?.length > 0) {
                for (let index = 0; index < existingArray.length; index++) {
                    try {
                        const url = `${baseURL}/log-geofencing.json`;
                        console.log('dataWithUpdatedToken', { token, ...existingArray[index] });
                        const response = await postData(url, { token, ...existingArray[index] });

                        if (!response.status) {
                            console.error('Response', response);
                            console.error(`Failed to upload object ${index}:`, response.statusText);
                            return; // Stop the loop if an error occurs
                        }

                        console.log(`Object ${index} uploaded successfully.`);
                    } catch (error) {
                        if (error instanceof TypeError) {
                            console.error(`Network error occurred while uploading object ${index}:`, error.message);

                            if (existingArray) {
                                console.log(index);
                                if (index < existingArray.length - 1) existingArray.splice(0, index + 1);

                                mmkv.delete('offlineData');
                                console.log(existingArray);
                                mmkv.set('offlineData', JSON.stringify(existingArray));
                                trigger('impactLight');
                                ToastAndroid.show('The remaining data saved offline', ToastAndroid.SHORT);
                            } else {
                                console.log('No offline data to upload.');
                            }
                        } else {
                            console.error(`Error uploading object ${index}:`, error);
                        }
                        return; // Stop the loop if an error occurs
                    }
                }

                trigger('impactLight');
                ToastAndroid.show('Data uploaded successfully', ToastAndroid.SHORT);
                mmkv.delete('offlineData');
            } else {
                console.log('No offline data to upload.');
            }
        } catch (error) {
            console.error('Error fetching or uploading data:', error);
        }
    },
};
