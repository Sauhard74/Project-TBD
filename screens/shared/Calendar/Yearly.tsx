import { Moment } from 'moment';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
// Components
import Header from '../../../components/headers/Header';
import CustomAddButton from '../../../components/layout/CustomAddButton';
import DaysGrid from './modules/DaysGrid';
import EventCreation from './modules/EventCreation';
// Utilities
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { captureException } from '@sentry/react-native';
import { useDispatch } from 'react-redux';
import { fetchYearlyNdMonthlyEvents } from '../../../apis/Calendar';
import { Colors } from '../../../constants/Colors';
import { GlobalStyles, textStyle } from '../../../constants/GlobalStyles';
import { AuthContext } from '../../../context/AuthContext';
import { CalendarStackParamList } from '../../../navigation/CalendarStack';
import { showToast } from '../../../redux/reducers/toast';
import { getMonthsOfAcademicYear } from '../../../utilities/calendar.utils';

const YearlyCalendar = ({
  navigation
}: NativeStackScreenProps<CalendarStackParamList, 'YearlyCalendar'>) => {
  const dispatch = useDispatch();
  const screenWidth = Dimensions.get('window').width;
  const dayWidth = useMemo(() => (screenWidth * 0.47 - 20) / 7, [screenWidth]);
  const { classId, academicYearOfClass, isParent } = useContext(AuthContext);
  const academicYear = useMemo(
    () => (academicYearOfClass && classId ? academicYearOfClass[classId] : undefined),
    [academicYearOfClass, classId]
  );

  const [showEventModal, setShowEventModal] = useState(false);
  const [events, setEvents] = useState<{ [key: string]: EventType[] }>({});
  const [yearLoader, setYearLoader] = useState(false);
  const [refetch, setRefetch] = useState(false);

  // Memoize the months array based on the academic year
  const months = useMemo(() => getMonthsOfAcademicYear(academicYear), [academicYear]);

  // Memoize the unique years from the months array
  const uniqueYears = useMemo(() => {
    return [...new Set(months.map((m) => m.year()))]; // Extract unique years from the months array
  }, [months]);

  const getEventsForAllYears = async () => {
    const allEvents: { [key: number]: EventType[] } = {};

    // looping through each year in academic period
    const eventsPromises = uniqueYears.map(async (year) => {
      const response = await fetchYearlyNdMonthlyEvents(classId, { year });
      return { year, events: (response.result || []) as EventType[] };
    });

    const eventsResults = await Promise.all(eventsPromises);

    eventsResults.forEach(({ year, events }) => {
      allEvents[year] = events;
    });

    return allEvents;
  };

  // destructuring events based on months
  const mapEventsToMonthDict = (
    monthsArray: Moment[],
    allEvents: {
      [key: number]: EventType[];
    }
  ) => {
    const eventMap: { [key: string]: EventType[] } = {};
    monthsArray.forEach((m) => {
      const year = m.year();
      const month = m.month(); // zero-based month
      const key = `${year}-${month}`;
      const yearEvents = allEvents[year] || [];
      // Pre-filter once
      eventMap[key] = yearEvents.filter((evt) => {
        const startDate = new Date(evt.start_date.$date);
        const endDate = new Date(evt.end_date.$date);
        return m.isBetween(startDate, endDate, 'month', '[]');
      });
    });
    return eventMap;
  };

  const fetchEvents = async () => {
    if (!classId) return;
    try {
      setYearLoader(true);
      const allEvents = await getEventsForAllYears();
      const eventMap = mapEventsToMonthDict(months, allEvents);
      setEvents(eventMap);
    } catch (error) {
      captureException(error);
      dispatch(
        showToast({
          text: 'Failed to fetch events. Please try again later.',
          type: 'error'
        })
      );
    } finally {
      setYearLoader(false);
      setRefetch(false); // Reset refetch after fetching
    }
  };

  useEffect(() => {
    // Fetch on mount and whenever refetch is true
    if (!yearLoader && (refetch || !events?.length)) {
      fetchEvents();
    }
  }, [refetch]);

  const renderItem = useCallback(
    ({ item, index }: { item: Moment; index: number }) => {
      const eventsForMonth = events[`${item.year()}-${item.month()}`] || [];

      return (
        <View key={`month_${index}`} style={styles.monthContainer}>
          <Text style={[textStyle(13, '500', '#333')]}>
            {item.format('MMMM, YYYY').toUpperCase()}
          </Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('MonthlyCalendar', {
                month: item.month(),
                year: item.year()
              })
            }>
            <DaysGrid
              month={item}
              events={eventsForMonth}
              weekdayText={8}
              dayText={10}
              dayFont={'500'}
              dayWidth={dayWidth}
              calendar="Year"
            />
          </TouchableOpacity>
        </View>
      );
    },
    [events, navigation]
  );

  return (
    <SafeAreaView style={[GlobalStyles.container]}>
      <Header title={'📆 Yearly Calendar'} onPress={() => navigation.goBack()} />

      {yearLoader ? (
        <View style={styles.loader}>
          <ActivityIndicator size={'large'} color={Colors.Primary} />
        </View>
      ) : (
        <>
          <View style={[GlobalStyles.innerContainer]}>
            <FlatList
              data={months}
              numColumns={2}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              columnWrapperStyle={{ justifyContent: 'space-between' }}
              ListHeaderComponent={<View style={styles.extraTopSpacing} />}
              ListFooterComponent={<View style={styles.extraBottomSpacing} />}
              renderItem={renderItem}
            />
          </View>

          {!isParent && (
            <EventCreation
              visible={showEventModal}
              onClose={() => setShowEventModal(false)}
              // TODO: Keeping it temporarily, will remove this once all modes have been fixed
              onSuccess={() => {
                setRefetch(true);
              }}
              event={undefined}
            />
          )}

          {!isParent && <CustomAddButton onPress={() => setShowEventModal(true)} />}
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  yearContainer: {
    ...GlobalStyles.alignCenterContainer,
    paddingVertical: 4,
    paddingLeft: 10,
    paddingRight: 4,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: 'rgba(170, 170, 170, 1)'
  },
  monthContainer: {
    width: Dimensions.get('window').width * 0.48 - 20,
    marginBottom: 20
  },
  extraTopSpacing: {
    margin: '4%'
  },
  extraBottomSpacing: {
    margin: '6%'
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  weekdayContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 6,
    marginVertical: 3
  },
  weekdayText: {
    //width: (Dimensions.get('window').width - 40) / 18,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  dayText: {
    width: (Dimensions.get('window').width * 0.48 - 20) / 7,
    textAlign: 'center',
    padding: 5
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center'
  }
});

export default YearlyCalendar;
