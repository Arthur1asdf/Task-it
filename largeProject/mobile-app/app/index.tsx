// app/index.tsx
import { Redirect } from 'expo-router';
import React, { useState, useCallback, useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// import { useEffect } from 'react';
// import { registerForPushNotificationsAsync, runDailyCheck } from '../utils/notifications';
// import * as Notifications from 'expo-notifications';
// import { Platform } from 'react-native';

// useEffect(() => {
//   (async () => {
//     const { status } = await Notifications.getPermissionsAsync();
//     if (status !== 'granted') {
//       await Notifications.requestPermissionsAsync();
//     }

//     if (Platform.OS === 'android') {
//       await Notifications.setNotificationChannelAsync('default', {
//         name: 'default',
//         importance: Notifications.AndroidImportance.DEFAULT,
//       });
//     }
//   })();

//   const setup = async () => {
//     await registerForPushNotificationsAsync();
//     await runDailyCheck(); // checks if user was active today
//   };
//   setup();
// }, []);

export default function Index() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Load custom fonts
        await Font.loadAsync({
          'HappyMonkey': require('../assets/fonts/HappyMonkey-Regular.ttf'),
          'Jua': require('../assets/fonts/Jua-Regular.ttf'),
          'JustAnotherHand': require('../assets/fonts/JustAnotherHand-Regular.ttf'),
          'PermanentMarker': require('../assets/fonts/PermanentMarker-Regular.ttf'),
          'Quicksand': require('../assets/fonts/Quicksand-VariableFont_wght.ttf'),
          'SpaceMono': require('../assets/fonts/SpaceMono-Regular.ttf'),
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }
  
    prepare();
  }, []);
  
  useEffect(() => {
    if (appIsReady) {
      // Hide the splash screen when the app is ready
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);
  
  if (!appIsReady) {
    return null;
  }
  
  return <Redirect href="./screens/Login" />; // Redirect to Login first
}
