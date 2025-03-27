import { Icon } from '@rneui/themed';
import BottomSheet from '@gorhom/bottom-sheet';
import React, { useContext, useEffect, useRef } from 'react';
import { Dimensions, SafeAreaView, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { RouteProp } from '@react-navigation/native';
// Utilities
import { StoryLibContext } from '../context/StoryLibContext';
import { getPrimaryUserDetails } from '../utilities/user.utils';
// Components
import Header from '../components/headers/Header';
import StoryTabBar from '../screens/teacher/story-library/StoryStageTabs';
import DraftStoryLibrary from '../screens/teacher/story-library/DraftStoryLibrary';
import ReviewStoryLibrary from '../screens/teacher/story-library/ReviewStoryLibrary';
import PublishedStoryLibrary from '../screens/teacher/story-library/PublishedStoryLibrary';
import CustomBottomSheet from '../components/layout/CustomBottomSheet';
import StoryLibFilterSheet from '../components/stories/StoryLibFilterSheet';

export type StoryLibTabsParamList = {
  Draft: undefined;
  'In Review': undefined;
  Published: undefined;
};

const Tab = createMaterialTopTabNavigator<StoryLibTabsParamList>();

const StoryStageTabs = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <StoryTabBar {...props} />}
      initialLayout={{ width: Dimensions.get('window').width }}>
      <Tab.Screen name="Published" component={PublishedStoryLibrary} />
      <Tab.Screen name="In Review" component={ReviewStoryLibrary} />
      <Tab.Screen name="Draft" component={DraftStoryLibrary} />
    </Tab.Navigator>
  );
};

const StoryLibraryTabs = ({
  navigation,
  route
}: NativeStackScreenProps<StoryLibTabsParamList, any>) => {
  const { showFilter, setShowFilter } = useContext(StoryLibContext);
  const { isSchoolSuperAdmin } = getPrimaryUserDetails('teacher') as any;

  const filterRef = useRef<BottomSheet>(null);

  useEffect(() => {
    if (showFilter) filterRef?.current?.snapToIndex(0);
    else filterRef?.current?.close();
  }, [showFilter]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title="Story Library" onPress={() => navigation.goBack()}>
        <TouchableOpacity onPress={() => setShowFilter(!showFilter)} className="p-3">
          <Icon name={'filter'} type="feather" color="#777" size={20} />
        </TouchableOpacity>
      </Header>

      {isSchoolSuperAdmin ? (
        <StoryStageTabs />
      ) : (
        <PublishedStoryLibrary
          navigation={navigation}
          route={route as RouteProp<StoryLibTabsParamList, 'Published'>}
        />
      )}

      <CustomBottomSheet
        sheetRef={filterRef}
        snapPoints={['90%']}
        onCloseSheet={() => setShowFilter(false)}
        background={undefined}
        removeBackDropOpacity={undefined}>
        <StoryLibFilterSheet />
      </CustomBottomSheet>
    </SafeAreaView>
  );
};

export default StoryLibraryTabs;
