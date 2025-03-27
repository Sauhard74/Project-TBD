import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AnnouncementNHomeworkList from '../../screens/shared/AnnouncementNHomework/AnnouncementNHomeworkList';
import AnnouncementNHomeworkView from '../../screens/shared/AnnouncementNHomework/AnnouncementNHomeworkView';
import MediaView from '../../screens/shared/media/MediaView';

interface AnnouncementNHomeworkViewNListType {
  _id?: { $oid: string };
  isNotified?: boolean;
  nofetch?: boolean;
  page: 'announcement' | 'homework';
}

export type AnnouncementNHomeworkStackParamList = {
  AnnouncementNHomeworkList: AnnouncementNHomeworkViewNListType;
  AnnouncementNHomeworkView: AnnouncementNHomeworkViewNListType;
  AnnouncementNHomeworkAddNEdit: { id?: string; page: 'announcement' | 'homework' };
  MediaView: { media: MediaDetailType; source: string; mediaList: MediaDetailType[] };
};

const Stack = createNativeStackNavigator<AnnouncementNHomeworkStackParamList>();

const AnnouncementStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true
      }}
      initialRouteName="AnnouncementNHomeworkList">
      <Stack.Screen
        name="AnnouncementNHomeworkList"
        component={AnnouncementNHomeworkList}
        initialParams={{ page: 'announcement' }}
      />
      <Stack.Screen name="AnnouncementNHomeworkView" component={AnnouncementNHomeworkView} />
      <Stack.Screen name="MediaView" component={MediaView} />
    </Stack.Navigator>
  );
};

export default AnnouncementStack;
