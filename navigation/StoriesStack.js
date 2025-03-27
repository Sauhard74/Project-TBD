import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StoriesList from '../screens/shared/stories/StoriesList';
import CreateStory from '../screens/shared/stories/CreateStory';
import MediaView from '../screens/shared/media/MediaView';

const Stack = createNativeStackNavigator();

const StoriesStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true
      }}>
      <Stack.Screen name="StoriesList" component={StoriesList} />
      <Stack.Screen name="CreateStory" component={CreateStory} />
      <Stack.Screen name="MediaView" component={MediaView} />
    </Stack.Navigator>
  );
};

export default StoriesStack;
