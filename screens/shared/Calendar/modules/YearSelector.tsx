import { Icon } from '@rneui/base';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { textStyle } from '../../../../constants/GlobalStyles';

type Props = {
  selectedYear: number;
  setSelectedYear: (year: number) => void;
};

const YearSelector = ({ selectedYear, setSelectedYear }: Props) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // getMonth() returns 0-11, so add 1

  // current year and next year if current month is more than 3
  const defaultAcademicYears =
    currentMonth <= 3
      ? [(currentYear - 1).toString(), currentYear.toString()]
      : [currentYear.toString(), (currentYear + 1).toString()];

  return (
    <View
      className={`flex flex-row items-center ${defaultAcademicYears.includes(`${selectedYear - 1}`) && 'pr-6'} `}>
      {/* ### PREV ### */}
      {defaultAcademicYears.includes(`${selectedYear - 1}`) && (
        <TouchableOpacity onPress={() => setSelectedYear(selectedYear - 1)} className="p-4 px-1.5">
          <Icon name="chevron-left" size={32} />
        </TouchableOpacity>
      )}
      {/* ### SELECTED YEAR ### */}
      <Text style={[textStyle(15, '400')]}>{selectedYear}</Text>
      {/* ### NEXT ### */}
      {defaultAcademicYears.includes(`${selectedYear + 1}`) && (
        <TouchableOpacity onPress={() => setSelectedYear(selectedYear + 1)} className="p-4 px-1.5">
          <Icon name="chevron-right" size={32} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default YearSelector;
