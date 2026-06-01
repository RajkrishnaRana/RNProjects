// import BackgroundJob from 'react-native-background-actions';
import Geolocation from 'react-native-geolocation-service';
import {PermissionsAndroid} from 'react-native';
import BackgroundService from 'react-native-background-actions';

// const sleep = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));

async function requestMultiplePermissions() {
  try {
    const permissions = [
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    ];

    const granted = await PermissionsAndroid.requestMultiple(permissions);
    const locationGranted =
      granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] ===
      PermissionsAndroid.RESULTS.GRANTED;
    const coarseLocationGranted =
      granted[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION] ===
      PermissionsAndroid.RESULTS.GRANTED;
    const backgroundLocationGranted =
      granted[PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION] ===
      PermissionsAndroid.RESULTS.GRANTED;
    const notificationsGranted =
      granted[PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS] ===
      PermissionsAndroid.RESULTS.GRANTED;

    if (
      locationGranted &&
      coarseLocationGranted &&
      backgroundLocationGranted &&
      notificationsGranted
    ) {
      console.log('All requested permissions granted');
    } else {
      console.log('One or more permissions denied');
    }

    // const granted = await PermissionsAndroid.request(
    //   PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    //   {
    //     title: 'Location Permission',
    //     message: 'This app requires access to your location.',
    //     buttonNeutral: 'Ask Me Later',
    //     buttonNegative: 'Cancel',
    //     buttonPositive: 'OK',
    //   },
    // );

    // if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //   console.log('Location permission granted');
    // } else {
    //   console.log('Location permission denied');
    // }
  } catch (err) {
    console.warn('Permission request error:', err);
  }
}

const sleep = (time: number) =>
  new Promise<void>(resolve => setTimeout(resolve, time));

// const taskRandom = async (taskData: any) => {
//   const {delay} = taskData;
//   await requestMultiplePermissions();
//   console.log('Delay:', delay);

//   // Define a function to get the current position
//   const getCurrentPosition = () =>
//     new Promise<void>((resolve, reject) => {
//       Geolocation.getCurrentPosition(
//         position => {
//           console.log('Current Position:', position);
//           resolve();
//         },
//         error => {
//           console.log('Geolocation error:', error.code, error.message);
//           reject(error);
//         },
//         {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
//       );
//     });

//   await new Promise<void>(resolve => {
//     const intervalId = setInterval(async () => {
//       if (!BackgroundJob.isRunning()) {
//         clearInterval(intervalId); // Stop the interval if the background job is no longer running
//         resolve();
//         return;
//       }

//       try {
//         await getCurrentPosition();
//         await BackgroundJob.updateNotification({
//           taskDesc: 'Getting position...',
//         });
//       } catch (error) {
//         console.log('Error getting position:', error);
//       }
//     }, 5000); // Get position every 5 seconds
//   });
// };

const taskRandom = async (taskData: any) => {
  const {delay} = taskData;

  // Define a function to get the current position
  const getCurrentPosition = () =>
    new Promise<void>((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          console.log('Current Position:', position);
          resolve();
        },
        error => {
          console.log('Geolocation error:', error.code, error.message);
          reject(error);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    });

  await new Promise<void>(resolve => {
    const intervalId = setInterval(async () => {
      if (!BackgroundService.isRunning()) {
        clearInterval(intervalId); // Stop the interval if the background job is no longer running
        resolve();
        return;
      }

      try {
        await getCurrentPosition();
        await BackgroundService.updateNotification({
          taskDesc: 'Getting position...',
        });
      } catch (error) {
        console.log('Error getting position:', error);
      }
    }, 5000); // Get position every 5 seconds
  });
};

const options = {
  taskName: 'Gelocation Task',
  taskTitle: 'Fetching User Location',
  taskDesc: 'Fetching User Location background and foreground',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#ff00ff',
  linkingURI: 'exampleScheme://chat/jane', // change accordingly
  parameters: {
    delay: 1000,
  },
};

// Function to start the background job
export const startBackgroundJob = async () => {
  await requestMultiplePermissions();

  try {
    console.log('Trying to start background service');
    await BackgroundService.start(taskRandom, options);
    console.log('Background service started successfully!');
  } catch (e) {
    console.log('Error starting background service:', e);
  }
};

// Function to stop the background job
export const stopBackgroundJob = async () => {
  try {
    console.log('Stopping background service');
    await BackgroundService.stop();
    console.log('Background service stopped successfully!');
  } catch (e) {
    console.log('Error stopping background service:', e);
  }
};
