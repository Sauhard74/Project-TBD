import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ParentDashboard from '../screens/parent/ParentDashboard';
import AnnouncementStack from './parent/AnnouncementStack';
import AttendanceStack from './parent/AttendanceStack';
import JournalStack from './JournalStack';
import StoriesStack from './StoriesStack';
import MediaStack from './MediaStack';
import Settings from '../screens/shared/settings/Settings';
import NotificationSettings from '../screens/shared/Notification/Settings';
import CalendarStack from './CalendarStack';
import WeeklyPlanningStack from './teacher/WeeklyPlanningStack';
import Chat from '../screens/shared/chat/Chat';
import Messages from '../screens/shared/chat/Messages';
import ProfileView from '../screens/shared/chat/profileView/ProfileView';
import EntryDispersalStack from './EntryDispersalStack';
import AdvancedSettings from '../screens/shared/settings/AdvancedSettings';
import MediaView from '../screens/shared/media/MediaView';
import HomeworkStack from './HomeworkStack';

const Stack = createNativeStackNavigator();

const ParentNavStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}>
      <Stack.Screen name="Dashboard" component={ParentDashboard} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="AdvancedSettings" component={AdvancedSettings} />
      <Stack.Screen name="Calendar" component={CalendarStack} />
      <Stack.Screen name="ParentAttendance" component={AttendanceStack} />
      <Stack.Screen
        name="Announcement"
        component={AnnouncementStack}
        options={{ gestureEnabled: true }}
      />
      <Stack.Screen name="Journal" component={JournalStack} options={{ gestureEnabled: true }} />
      <Stack.Screen name="Stories" component={StoriesStack} options={{ gestureEnabled: true }} />
      <Stack.Screen name="Media" component={MediaStack} options={{ gestureEnabled: true }} />
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="Messages" component={Messages} />
      <Stack.Screen name="MediaView" component={MediaView} />
      <Stack.Screen name="ProfileView" component={ProfileView} />
      <Stack.Screen name="Notification" component={NotificationSettings} />
      <Stack.Screen name="WeeklyPlanning" component={WeeklyPlanningStack} />
      <Stack.Screen
        name="EntryDispersal"
        component={EntryDispersalStack}
        initialParams={{ role: 'parent' }}
      />
      <Stack.Screen name="Homework" component={HomeworkStack} />
    </Stack.Navigator>
  );
};

export default ParentNavStack;
