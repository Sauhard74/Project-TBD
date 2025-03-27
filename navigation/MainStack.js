import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TeacherNavStack from './TeacherNavStack';
import ParentNavStack from './ParentNavStack';
import { AuthContext } from '../context/AuthContext';

const Stack = createNativeStackNavigator();

const MainStack = () => {
  const { isParent } = useContext(AuthContext);
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}>
      {isParent ? (
        <Stack.Screen name="Parent" component={ParentNavStack} />
      ) : (
        <Stack.Screen name="Teacher" component={TeacherNavStack} />
      )}
    </Stack.Navigator>
  );
};

export default MainStack;
