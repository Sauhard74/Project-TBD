import React, { useRef, useState, useContext, useMemo, useCallback } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  Pressable,
  ColorValue,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ActivityIndicator
} from 'react-native';
import { GlobalStyles, textStyle } from '../../../constants/GlobalStyles';
import Header from '../../../components/headers/Header';
import { Icon } from '@rneui/themed';
import moment from 'moment';
import { Colors } from '../../../constants/Colors';
import CustomAddButton from '../../../components/layout/CustomAddButton';
import DaysGrid from './modules/DaysGrid';
import MonthScrollBar from './modules/MonthScrollBar';
import { CALENDAR_EVENTS } from '../../../constants/Constant';
import EventCreation from './modules/EventCreation';
import CustomBottomSheet from '../../../components/layout/CustomBottomSheet';
import { AuthContext } from '../../../context/AuthContext';
import { fetchYearlyNdMonthlyEvents } from '../../../apis/Calendar';
import * as Sentry from '@sentry/react-native';
import { getEventColor } from '../../../utilities/colorsUtils';
import EventActionSheet from './modules/EventActionSheet';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CalendarStackParamList } from '../../../navigation/CalendarStack';
import BottomSheet from '@gorhom/bottom-sheet';
import {
  getCurrentMonthMomentsIndex,
  getMonthsOfAcademicYear
} from '../../../utilities/calendar.utils';
import { useFocusEffect } from '@react-navigation/native';

const MonthlyCalendar = ({
  navigation,
  route
}: NativeStackScreenProps<CalendarStackParamList, 'MonthlyCalendar'>) => {
  const { classId, isParent, academicYearOfClass } = useContext(AuthContext);
  const { month, year } = route.params;
  const eventSheetRef = useRef<BottomSheet>(null);
  const eventSnapPoints = ['40%', '80%'];
  const flatListRef = useRef<FlatList>(null);
  const [selectedMonth, setSelectedMonth] = useState(month);
  const [showEventModal, setShowEventModal] = useState(false);
  const [events, setEvents] = useState<EventType[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventType>();
  const [selectedYear, setSelectedYear] = useState(year);
  const [eventsLoading, setEventsLoading] = useState(false);

  const reversedEvents = useMemo(() => events.reverse(), [events]);
  const width = Dimensions.get('window').width - 40; // 40 - 20 (left and right padding)

  useFocusEffect(
    useCallback(() => {
      onSwitchMonth(selectedMonth, selectedYear);
    }, [])
  );

  const onSwitchMonth = (month: number, year: number, index?: number) => {
    if (index !== undefined) {
      flatListRef.current?.scrollToIndex({ index, animated: true });
    }
    setEventsLoading(true);
    setSelectedMonth(month);
    setSelectedYear(year);
    getEventsOftheMonth(month, year);
  };

  const handleOpenEventSheet = () => {
    eventSheetRef.current?.snapToIndex(0);
  };

  const getEventsOftheMonth = async (month: number, year: number) => {
    try {
      if (!classId) return;
      setEventsLoading(true);
      const response = await fetchYearlyNdMonthlyEvents(classId, { year: year, month: month + 1 });
      if (response.result) {
        setEvents(response.result);
      }
    } catch (error) {
      Sentry.captureException(error);
    } finally {
      setEventsLoading(false);
    }
  };

  const onToggleEvent = (event: EventType) => {
    setSelectedEvent(event);
    handleOpenEventSheet();
  };

  const getDateFormat = useCallback((date: string) => moment(date).format('MMM DD, YYYY'), []);

  const onAddEvent = () => {
    setSelectedEvent({
      start_date: { $date: selectedMoment.date(1) },
      end_date: { $date: selectedMoment.date(1) }
    } as unknown as EventType);
    setShowEventModal(true);
  };

  const onEditEvent = (event: EventType) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const onSuccessfullEventUpdate = () => {
    eventSheetRef.current?.close(); // closing the event action sheet on successful update
    getEventsOftheMonth(selectedMonth, selectedYear);
  };

  const onSuccessfulEventDelete = () => {
    eventSheetRef.current?.close(); // closing the event action sheet on successful update
    getEventsOftheMonth(selectedMonth, selectedYear);
  };

  const academicYear = academicYearOfClass && classId ? academicYearOfClass[classId] : undefined;
  const monthMoments = useMemo(() => getMonthsOfAcademicYear(academicYear), [academicYear]);
  const selectedMoment = moment().month(selectedMonth).year(selectedYear);
  const currentMonthIndex = useMemo(
    () => getCurrentMonthMomentsIndex(monthMoments, selectedMoment),
    [monthMoments, selectedMoment]
  );

  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const currentPage = Math.round(offsetX / width);
    const currentMonth = monthMoments.at(currentPage);
    if (!currentMonth) return;
    if (currentMonth.isSame(selectedMoment, 'month')) return;
    onSwitchMonth(currentMonth.month(), currentMonth.year());
  };

  return (
    <SafeAreaView style={[GlobalStyles.container]}>
      <Header title={'📆 Monthly Calendar'} onPress={() => navigation.goBack()} />

      {/* ### MONTHL SCROLL ### */}
      <View style={styles.extraTopSpacing} />
      <View style={[GlobalStyles.innerContainer]}>
        <MonthScrollBar
          selectedMoment={selectedMoment}
          setSelectedMonthNYear={(month, year, index) => {
            if (moment().month(month).year(year).isSame(selectedMoment, 'month')) return;
            onSwitchMonth(month, year, index);
          }}
        />
        <View style={styles.extraTopSpacing} />
        {/* ### SELECTED MONTH ### */}
        <FlatList
          ref={flatListRef}
          showsHorizontalScrollIndicator={false}
          horizontal
          pagingEnabled
          initialScrollIndex={currentMonthIndex}
          data={monthMoments}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          keyExtractor={(item, i) => `monthly_calendars_${item.format('DD-MM-YYYY')}_${i}`}
          getItemLayout={(data, index) => ({
            length: width,
            offset: width * index,
            index
          })}
          renderItem={({ item, index }) => (
            <View style={{ flexDirection: 'row', width: width }}>
              <DaysGrid
                events={eventsLoading ? [] : events}
                month={item}
                weekdayText={13}
                dayText={18}
                calendar={'Month'}
                dayFont={'400'}
                navigation={navigation}
                dayWidth={width / 7 - 0.1}
              />
            </View>
          )}
        />

        <View style={styles.extraTopSpacing} />
        {/* #### EVENTS #### */}
        <View>
          <Text style={[textStyle(18, '600')]}>Events for this months</Text>
        </View>
        <View style={[GlobalStyles.alignCenterContainer, styles.eventsContainer]}>
          {CALENDAR_EVENTS.map((el, i) => (
            <View key={i} style={[GlobalStyles.alignCenterContainer]}>
              <Icon
                name={'square-sharp'}
                type={'ionicon'}
                size={10}
                color={el.color}
                style={styles.icon}
              />
              <Text
                style={[
                  styles.eventType,
                  textStyle(12, '500', '#333'),
                  { textTransform: 'capitalize' }
                ]}>
                {el.title}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <ScrollView>
        <View style={[GlobalStyles.innerContainer]}>
          <View style={styles.extraTextSpacing} />
          {eventsLoading ? (
            <View style={styles.noEventConatiner}>
              <ActivityIndicator size={'small'} color={'#000'} />
            </View>
          ) : reversedEvents.length > 0 ? (
            reversedEvents.map((el, i) => (
              <Pressable onPress={() => onToggleEvent(el)} key={i} style={styles.eventLayout}>
                <View
                  style={[
                    styles.sideBar,
                    { borderColor: getEventColor(el?.category) as ColorValue }
                  ]}
                />
                <View style={styles.eventRightContent}>
                  <View style={[GlobalStyles.alignBtwContainer, styles.extraTextSpacing]}>
                    <View style={[GlobalStyles.alignCenterContainer, styles.eventDateCtn]}>
                      <Icon
                        name={'circle'}
                        type={'material-community'}
                        size={10}
                        color={getEventColor(el?.category) as ColorValue}
                        style={styles.icon}
                      />
                      <Text
                        style={[
                          GlobalStyles.text(12, 'AvenirNext', 'rgba(119, 119, 119, 1)', '500')
                        ]}>
                        {el.start_date?.$date === el.end_date?.$date
                          ? getDateFormat(el.start_date?.$date)
                          : `${getDateFormat(el.start_date?.$date)} - ${getDateFormat(
                              el.end_date?.$date
                            )}`}
                      </Text>
                    </View>
                    {!isParent && (
                      <Icon
                        name={'pencil-outline'}
                        type={'material-community'}
                        size={22}
                        color={'rgba(51, 51, 51, 1)'}
                        onPress={() => onEditEvent(el)}
                      />
                    )}
                  </View>
                  <Text style={[styles.extraTextSpacing, textStyle(16, '600', '#333')]}>
                    {el?.event_name}
                  </Text>
                  <Text
                    style={[
                      styles.extraTextSpacing,
                      GlobalStyles.text(12, 'AvenirNext', 'rgba(119, 119, 119, 1)', '400')
                    ]}>
                    {el?.description && el.description.length > 50
                      ? el.description.substring(0, 50)
                      : el.description}
                  </Text>
                </View>
              </Pressable>
            ))
          ) : (
            <View style={styles.noEventConatiner}>
              <Text style={textStyle(14, '500', Colors.Gray)}>No Events added to display</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {!isParent && (
        <EventCreation
          event={selectedEvent}
          visible={showEventModal}
          onClose={() => setShowEventModal(false)}
          onSuccess={onSuccessfullEventUpdate}
        />
      )}

      {!isParent && <CustomAddButton onPress={onAddEvent} />}

      <CustomBottomSheet sheetRef={eventSheetRef} snapPoints={eventSnapPoints}>
        <EventActionSheet
          selectedEvent={selectedEvent}
          onEdit={() => setShowEventModal(true)}
          onDelete={onSuccessfulEventDelete}
        />
      </CustomBottomSheet>
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
  eventsContainer: {
    marginTop: 10
  },
  extraTopSpacing: {
    margin: '3%'
  },
  extraBottomSpacing: {
    margin: '6%'
  },
  icon: {
    paddingRight: 5
  },
  eventType: {
    paddingRight: 10
  },
  eventLayout: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  sideBar: {
    height: 86,
    width: 2,
    borderWidth: 2
  },
  eventRightContent: {
    paddingLeft: 16
  },
  eventDateCtn: {
    width: '90%'
  },
  extraTextSpacing: {
    paddingVertical: 2
  },
  event: {
    padding: 4,
    borderRadius: 16
  },
  seperator: {
    marginVertical: '4%',
    marginHorizontal: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(221, 221, 221, 0.5)'
  },
  noEventConatiner: {
    alignItems: 'center',
    marginVertical: '16%'
  }
});

export default MonthlyCalendar;
