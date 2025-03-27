import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import JournalList from '../screens/shared/Journal/JournalList';
import CreatePost from '../screens/shared/Journal/CreatePost';
import MediaView from '../screens/shared/media/MediaView';

const Stack = createNativeStackNavigator();

const JournalStack = ({ route }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true
      }}>
      <Stack.Screen name="JournalList" component={JournalList} initialParams={route.params} />
      <Stack.Screen name="CreatePost" component={CreatePost} initialParams={route.params} />
      <Stack.Screen name="MediaView" component={MediaView} />
    </Stack.Navigator>
  );
};

export default JournalStack;
