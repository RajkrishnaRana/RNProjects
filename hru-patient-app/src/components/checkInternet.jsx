import {Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {colors} from '../../common/colors';
import NetInfo from '@react-native-community/netinfo';

const NoInternet = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      // console.log('Connection type', state.type);
      // console.log('Is connected?', state.isConnected);
      setIsConnected(state.isConnected);

      // Hide the component after 2 seconds if it's currently visible
      if (isVisible && state.isConnected) {
        setTimeout(() => {
          setIsVisible(false);
        }, 2000);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [isVisible]);

  return isVisible ? (
    <View style={{flex: 1, backgroundColor: isConnected ? 'green' : 'red'}}>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          height: 50,
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: isConnected ? 'green' : 'red',
        }}>
        <Text style={{color: '#fff'}}>
          {' '}
          {isConnected ? 'Back Online' : 'No Internet Connection'}{' '}
        </Text>
      </View>
    </View>
  ) : null;
};

export default NoInternet;
