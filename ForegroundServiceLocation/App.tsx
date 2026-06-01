import React, {useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {startBackgroundJob, stopBackgroundJob} from './utils'; // Import functions
import BackgroundService from 'react-native-background-actions';

const App: React.FC = () => {
  const [playing, setPlaying] = useState(false);

  // const toggleBackground = async () => {
  //   setPlaying(!playing);

  //   if (!playing) {
  //     await startBackgroundJob();
  //   } else {
  //     await stopBackgroundJob();
  //   }
  // };

  const sleep = time =>
    new Promise<void>(resolve => setTimeout(() => resolve(), time));

  const veryIntensiveTask = async taskDataArguments => {
    const {delay} = taskDataArguments;
    let counter = 0;
    while (BackgroundService.isRunning()) {
      counter++;
      console.log(`Background task running: Count ${counter}`);
      await sleep(delay);
    }
  };

  const options = {
    taskName: 'Example',
    taskTitle: 'ExampleTask Running',
    taskDesc: 'Tap to open app',
    taskIcon: {
      name: 'ic_launcher',
      type: 'mipmap',
    },
    color: '#ff00ff',
    linkingURI: 'yourSchemeHere://home', // Deep link back to app
    parameters: {
      delay: 1000,
    },
    allowExecutionInForeground: true, // Prevent Android from killing it
  };

  const toggleBackground = async () => {
    try {
      setPlaying(!playing);

      if (!playing) {
        await BackgroundService.start(veryIntensiveTask, options);
        await BackgroundService.updateNotification({
          taskDesc: 'New ExampleTask description',
        });
      } else {
        await BackgroundService.stop();
      }
    } catch (error) {
      console.error('Background Service Error:', error);
    }
  };

  return (
    <View style={styles.body}>
      <Text style={{marginBottom: 20, fontSize: 18}}>
        {playing ? 'Background Task Running' : 'Background Task Stopped'}
      </Text>
      <TouchableOpacity style={styles.button} onPress={toggleBackground}>
        <Text style={styles.buttonText}>
          {playing ? 'Stop Background Task' : 'Start Background Task'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    height: 50,
    width: 200,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;
