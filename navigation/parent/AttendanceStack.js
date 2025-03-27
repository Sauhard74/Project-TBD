import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ParentAttendanceScreen from '../../screens/parent/attendance/ParentAttendanceScreen';
import ParentRequestExcusal from '../../screens/parent/attendance/ParentRequestExcusal';
import ParentAttendanceStatusView from '../../screens/parent/attendance/ParentAttendanceStatusView';

const Stack = createNativeStackNavigator();

const AttendanceStack = ({ route }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
      initialRouteName="ParentAttendanceStatusView">
      <Stack.Screen
        name="ParentAttendanceScreen"
        component={ParentAttendanceScreen}
        initialParams={route.params}
      />
      <Stack.Screen
        name="ParentAttendanceStatusView"
        component={ParentAttendanceStatusView}
        initialParams={{ ...route.params, isExcusal: true }} // Configured the excusal screen as default
      />
      <Stack.Screen name="ParentRequestExcusal" component={ParentRequestExcusal} />
    </Stack.Navigator>
  );
};

export default AttendanceStack;
