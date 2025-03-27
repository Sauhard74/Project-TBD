import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainStack from './MainStack';
import AuthStack from './AuthStack';
import { AuthContext } from '../context/AuthContext';
import store from '../redux/store';
import { navigationRef } from '../components/bottomsheet/SwitchPanel';

const Routes = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const isParent = store.getState().parent.isParent;

  // Any url related agastya.app will be re directed to the app
  const linking = {
    prefixes: ['https://agastya.app', 'agastya://'],
    config: {
      screens: {
        [isParent ? 'Parent' : 'Teacher']: {
          path: 'housekeeping',
          screens: {
            // Based on the url directing the navigation to respective screens
            Announcement: {
              screens: {
                AnnouncementList: 'announcements'
              }
            }
          }
        }
      }
    }
  };

  return (
    <NavigationContainer ref={navigationRef} linking={linking}>
      {!isAuthenticated ? <AuthStack /> : <MainStack />}
    </NavigationContainer>
  );
};

export default Routes;
