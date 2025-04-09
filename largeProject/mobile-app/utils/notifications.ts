// import * as Notifications from 'expo-notifications';
// import * as Device from 'expo-device';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Platform } from 'react-native';

// export async function registerForPushNotificationsAsync() {
//   let token;
//   if (Device.isDevice) {
//     const { status: existingStatus } = await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;
//     if (existingStatus !== 'granted') {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }
//     if (finalStatus === 'granted') {
//       token = (await Notifications.getExpoPushTokenAsync()).data;
//       console.log("Expo push token:", token);
//     }
//   }

//   if (Platform.OS === 'android') {
//     Notifications.setNotificationChannelAsync('default', {
//       name: 'default',
//       importance: Notifications.AndroidImportance.DEFAULT,
//     });
//   }

//   return token;
// }

// const isSameDate = (date1: Date, date2: Date) =>
//   date1.toDateString() === date2.toDateString();

// export async function scheduleNotificationIfInactive() {
//   const lastActivityStr = await AsyncStorage.getItem("lastActivity");
//   const lastActivity = lastActivityStr ? new Date(lastActivityStr) : null;
//   const today = new Date();

//   if (!lastActivity || lastActivity === undefined || !isSameDate(today, lastActivity)) {
//     await Notifications.scheduleNotificationAsync({
//         content: {
//           title: "Stay on track 💪",
//           body: "You haven't logged any tasks today. Get something done!",
//         },
//         trigger: {
//           type: "calendar",
//           hour: 20,
//           minute: 0,
//           repeats: true,
//         } as Notifications.CalendarTriggerInput,
//       });
      
//       await Notifications.scheduleNotificationAsync({
//         content: {
//           title: "Reminder 🔔",
//           body: "You still haven’t checked in today. Don't break your streak!",
//         },
//         trigger: {
//           type: "calendar",
//           hour: 22,
//           minute: 0,
//           repeats: true,
//         } as Notifications.CalendarTriggerInput,
//       });      
//   }
// }

// export async function runDailyCheck() {
//   const todayStr = new Date().toDateString();
//   const lastCheck = await AsyncStorage.getItem("lastNotificationCheck");

//   if (lastCheck !== todayStr) {
//     await scheduleNotificationIfInactive();
//     await AsyncStorage.setItem("lastNotificationCheck", todayStr);
//   }
// }
