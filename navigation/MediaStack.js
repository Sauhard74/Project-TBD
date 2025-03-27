import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MediaList from '../screens/shared/media/MediaList';
import CreateAvatar from '../screens/shared/media/CreateAvatar';
import UserMedia from '../screens/shared/media/UserMedia';
import MediaView from '../screens/shared/media/MediaView';

const Stack = createNativeStackNavigator();

const MediaStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true
      }}
      initialRouteName="MediaList">
      <Stack.Screen name="MediaList" component={MediaList} />
      <Stack.Screen name="CreateAvatar" component={CreateAvatar} />
      <Stack.Screen name="UserMedia" component={UserMedia} />
      <Stack.Screen name="MediaView" component={MediaView} />
    </Stack.Navigator>
  );
};

export default MediaStack;
