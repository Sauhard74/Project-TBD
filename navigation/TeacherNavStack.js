import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Attendance from '../screens/teacher/attendance/AttendanceList';
import AnnouncementStack from './teacher/AnnouncementStack';
import TeacherDashboard from '../screens/teacher/TeacherDashboard';
import JournalStack from './JournalStack';
import StoriesStack from './StoriesStack';
import MediaStack from './MediaStack';
import WeeklyPlanningStack from './teacher/WeeklyPlanningStack';
import Settings from '../screens/shared/settings/Settings';
import CalendarStack from './CalendarStack';
import NotificationSettings from '../screens/shared/Notification/Settings';
import Chat from '../screens/shared/chat/Chat';
import Messages from '../screens/shared/chat/Messages';
import ProfileView from '../screens/shared/chat/profileView/ProfileView';
import ExcusalStack from './teacher/ExcusalStack';
import NewGroup from '../screens/shared/chat/NewGroup';
import AddMembers from '../screens/shared/chat/AddMembers';
import GroupSuccess from '../screens/shared/chat/GroupSuccess';
import EntryDispersalStack from './EntryDispersalStack';
import AdvancedSettings from '../screens/shared/settings/AdvancedSettings';
import StoryLibraryTabs from './StoryLibraryTabs';
import CreateStory from '../screens/shared/stories/CreateStory';
import UnitPlanningStack from './teacher/UnitPlanningStack';
import AssessmentStack from './teacher/AssessmentStack';
import MediaView from '../screens/shared/media/MediaView';

const Stack = createNativeStackNavigator();

const TeacherNavStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}>
      <Stack.Screen name="Dashboard" component={TeacherDashboard} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="AdvancedSettings" component={AdvancedSettings} />
      <Stack.Screen name="UnitPlanningStack" component={UnitPlanningStack} />
      <Stack.Screen name="WeeklyPlanning" component={WeeklyPlanningStack} />
      <Stack.Screen name="Attendance" component={Attendance} />
      <Stack.Screen
        name="Announcement"
        component={AnnouncementStack}
        options={{ gestureEnabled: true }}
      />
      <Stack.Screen name="Calendar" component={CalendarStack} />
      <Stack.Screen name="Journal" component={JournalStack} options={{ gestureEnabled: true }} />
      {/* To prevent user from going back while writing stories through back gesture action */}
      <Stack.Screen name="Stories" component={StoriesStack} options={{ gestureEnabled: true }} />
      <Stack.Screen name="Media" component={MediaStack} options={{ gestureEnabled: true }} />
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="Messages" component={Messages} options={{ gestureEnabled: false }} />
      <Stack.Screen name="MediaView" component={MediaView} />
      <Stack.Screen name="ProfileView" component={ProfileView} />
      <Stack.Screen name="NewGroup" component={NewGroup} />
      <Stack.Screen name="AddMembers" component={AddMembers} />
      <Stack.Screen name="GroupSuccess" component={GroupSuccess} />
      <Stack.Screen name="Notification" component={NotificationSettings} />
      <Stack.Screen name="Excusals" component={ExcusalStack} />
      <Stack.Screen
        name="EntryDispersal"
        component={EntryDispersalStack}
        initialParams={{ role: 'staff' }}
      />
      <Stack.Screen name="StoryLibrary" component={StoryLibraryTabs} />
      <Stack.Screen name="CreateStory" component={CreateStory} />
      <Stack.Screen name="Assessment" component={AssessmentStack} />
    </Stack.Navigator>
  );
};

export default TeacherNavStack;
