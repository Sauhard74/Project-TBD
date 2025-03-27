import { switchPanelDrpDwnColors } from '../constants/Constant';
import moment from 'moment';

export const minifyString = (text, count) => {
  return text.length > count ? `${text.substr(0, count)}...` : text;
};

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// To replace text in a string
export const replaceText = (textContent, arrStr) => {
  arrStr.forEach((el) => {
    textContent = textContent?.replace(new RegExp(escapeRegExp(el), 'g'), '');
  });
  return textContent;
};

// To display the initials in user avatar
export const getInitials = (fullName) => {
  const [firstName, lastName] = fullName.split(' ');
  return lastName
    ? `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
    : firstName.substring(0, 2).toUpperCase();
};

// To assign random color to the user avatar
export const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * switchPanelDrpDwnColors.length);
  return switchPanelDrpDwnColors[randomIndex];
};

// To get the academic year of the class
export const getAcademicYears = (classId, academicYear) => {
  if (academicYear && classId) {
    const yearRegex = /\b\d{4}\b/g; // To extract the year from date string
    const years = academicYear.match(yearRegex);
    return years;
  }
  return null;
};

// format the date string
export const onDateFormat = (date, type) => {
  return moment(date).format(type);
};

export const isAnnouncementScheduled = (announcement) => {
  const announcementDateTime = moment(
    `${announcement?.date?.$date.split('T')[0]}T${moment(announcement?.time, 'hh:mm A').format(
      'HH:mm:ss'
    )}`,
    'YYYY-MM-DD hh:mm A' // indicating the format of the date & time, we are passing
  );
  // checking if announcement is scheduled for later and if the scheduled time is after the current time
  return announcement.schedule_later && announcementDateTime.isAfter(moment());
};

// To remove html tags from text content
export const removeHtmlTags = (html) => {
  return html.replace(/<\/?[^>]+(>|$)/g, '');
};

// To make the first letter of a text uppercase
export const capitalizeFirstLetter = (text) => {
  if (text?.length > 0) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
  return '';
};

export const replaceBlockquotesWithParagraphs = (html) => {
  // Define a regular expression to match the pattern of two <blockquote><br></blockquote> tags
  const regex = /<blockquote><br><\/blockquote>\s*<blockquote><br><\/blockquote>/g;

  // Replace the matched pattern with <p><br></p>
  const replacedHtml = html.replace(regex, '<p><br></p>');

  return replacedHtml;
};
