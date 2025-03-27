import moment, { Moment, months } from 'moment';

/**
 * @param format - format of the date
 * @default format - "YYYY-MM-DD"
 * @returns start, end date of the default academic year
 */
export const getDefaultAcademicYear = (format = 'YYYY-MM-DD') => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  // if Month = Jan, Feb, Mar then <Prev Year>-4-1 TO <Curr Year>-3-31
  return currentMonth <= 3
    ? {
        start: moment(`${currentYear - 1}-04-01`, 'YYYY-MM-DD').format(format),
        end: moment(`${currentYear}-03-31`, 'YYYY-MM-DD').format(format)
      }
    : // else Month = Apr, May, ... Dec then <Curr Year>-4-1 TO <Next Year>-3-31
      {
        start: moment(`${currentYear}-04-01`, 'YYYY-MM-DD').format(format),
        end: moment(`${currentYear + 1}-03-31`, 'YYYY-MM-DD').format(format)
      };
};

const categoryPriorityMap: Record<string, number> = {
  Holidays: 1,
  'PT Meetings': 2,
  'Special Events': 3,
  birthday: 4
};

export const getPriority = (category: string): number => categoryPriorityMap[category] ?? 5; // Default priority is 5

interface AcademicYearDates {
  startDate: string;
  endDate: string;
}

interface AcademicYearDatesOptional {
  startDate: string | undefined;
  endDate: string | undefined;
}

type GetAcademicYearStartNEndReturnType<T extends boolean> = T extends true
  ? AcademicYearDates
  : AcademicYearDatesOptional;

/**
 * @param academicYear
 * @returns start, end date of the academic year in DD-MM-YYYY format
 */
export const getAcademicYearStartNEnd = <T extends boolean = true>(
  academicYear: string | undefined,
  format = 'DD-MM-YYYY',
  useDefault: T = true as T
): GetAcademicYearStartNEndReturnType<T> => {
  const [start, end] = academicYear?.split(' - ') || [];
  const startDate = start
    ? moment(start, 'DD-MM-YYYY').format(format)
    : useDefault
      ? getDefaultAcademicYear(format).start
      : undefined;
  const endDate = end
    ? moment(end, 'DD-MM-YYYY').format(format)
    : useDefault
      ? getDefaultAcademicYear(format).end
      : undefined;
  return { startDate, endDate } as GetAcademicYearStartNEndReturnType<T>;
};

/**
 * @param academicYear
 * @returns all months in the academic year in Moment format
 */
export const getMonthsOfAcademicYear = (academicYear: string | undefined) => {
  const { startDate, endDate } = getAcademicYearStartNEnd(academicYear);

  const startMoment = moment(startDate, 'DD-MM-YYYY'); // Parse the start date
  const endMoment = moment(endDate, 'DD-MM-YYYY'); // Parse the end date

  const monthsArray: Moment[] = [];

  const current = startMoment.clone();
  // Loop through each month from start to end date
  while (current.isSameOrBefore(endMoment, 'month')) {
    monthsArray.push(current.clone()); // Add the current month to the array
    current.add(1, 'month'); // Move to the next month
  }

  return monthsArray;
};

/**
 * @param monthMoments - array of months in the academic year
 * @param selectedMoment - the selected month
 * @returns the index of the selected month in the monthMoments array
 */
export const getCurrentMonthMomentsIndex = (monthMoments: Moment[], selectedMoment: Moment) => {
  return monthMoments.findIndex((moment) => moment.isSame(selectedMoment, 'month'));
};
