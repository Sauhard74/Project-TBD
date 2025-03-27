import { Platform } from 'react-native';
import { Dimensions } from 'react-native';

export const imageQuality = 0.8;
export const IMAGE = {
  maxWidth: 2000,
  maxHeight: 2000
};

export const messageLimit = 20;
export const windowWidth = Dimensions.get('window').width;
export const windowHeight = Dimensions.get('window').height;
export const isIos = Platform.OS === 'ios';

export const imageSizeLimit = 20000000; // 20 mb
export const videoSizeLimit = 100000000; // 100 mb
export const selectionLimit = 100; // Users can select upto 100 files to upload
export const toasterVisibleTime = 1500;
export const mediaSkeletonCircles = 5;
export const mediaSkeletonRects = 4;
export const videoPlayerScreenHeight = 300;
export const HomeIconSvgWidth = (Dimensions.get('window').width - 80) * 0.5; // To fit the home icons based on the device width
// Predefined colors to show the selected items in dropdown
export const drpDwnColorSet = ['#938BE6', '#FFD361', '#FF99BA', '#00C2FF'];

// Predefined colors to show the avatars of classes & children in switch panel
export const switchPanelDrpDwnColors = [
  'rgba(209, 109, 154, 1)',
  'rgba(209, 109, 154, 1)',
  'rgba(209, 109, 154, 1)',
  'rgba(0, 177, 177, 1)'
];

export const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];

// For Weekly Planning
export const SCHEDULE_TYPE = [
  { key: 'Today', label: 'Today' },
  { key: 'Academic', label: 'Full Academic Year' },
  { key: 'Custom', label: 'Select Date(s)' }
];

export const AcademicYear = {
  startDate: '01-06-2023',
  endDate: '30-04-2024'
};

// Predefined Colors to display the created periods
export const PERIOD_COLORS = [
  { key: 'bg-pink-accent', container: 'rgba(248, 235, 241, 1)', text: 'rgba(209, 109, 154, 1)' },
  { key: 'bg-indigo-accent', container: 'rgba(233, 232, 253, 1)', text: 'rgba(147, 139, 230, 1)' },
  { key: 'bg-yellow-accent', container: 'rgba(255, 251, 218, 1)', text: 'rgba(255, 192, 45, 1)' },
  { key: 'bg-green-accent', container: 'rgba(207, 255, 241, 1)', text: 'rgba(0, 177, 177, 1)' }
];

// Menu options for announcement
export const ANNOUNCEMENT_MENU = [
  `Parent's First Name`,
  `Parent's Last Name`,
  `Child's First Name`,
  `Child's Last Name`,
  `Class Name`
];

export const ACTIVITY_COLORS = [
  'rgba(209, 109, 154, 1)',
  'rgba(147, 139, 230, 1)',
  'rgba(255, 192, 45, 1)',
  'rgba(0, 177, 177, 1)'
];

export const CALENDAR_EVENTS = [
  { color: 'rgba(255, 211, 97, 1)', title: 'Holidays' },
  { color: 'rgba(0, 177, 177, 1)', title: 'PT Meetings' },
  { color: 'rgba(254, 149, 24, 1)', title: 'Special Events' },
  { color: 'rgba(119, 209, 246, 1)', title: 'birthday' }
];

export const screenEnum = {
  Groups: 'Groups',
  Families: 'Families',
  CoWorkers: 'CoWorkers',
  profileView: 'ProfileView'
};
