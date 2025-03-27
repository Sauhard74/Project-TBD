import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import YearlyCalendar from '../screens/shared/Calendar/Yearly';
import MonthlyCalendar from '../screens/shared/Calendar/Monthly';

export type CalendarStackParamList = {
  YearlyCalendar: undefined;
  MonthlyCalendar: {
    month: number;
    year: number;
  };
};

const Stack = createNativeStackNavigator<CalendarStackParamList>();

const CalendarStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}>
      <Stack.Screen name="YearlyCalendar" component={YearlyCalendar} />
      <Stack.Screen name="MonthlyCalendar" component={MonthlyCalendar} />
    </Stack.Navigator>
  );
};

export default CalendarStack;
