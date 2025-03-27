import { combineReducers } from 'redux';
import toast from './reducers/toast';
import progress from './reducers/Progress';
import staff from './reducers/Staff';
import attendance from './reducers/Attendance';
import announcement from './reducers/Announcement';
import classes from './reducers/Classes';
import parent from './reducers/Parent';
import media from './reducers/Media';
import uploadProgressBar from './reducers/uploadProgressBar';
import chat from './reducers/Chat';
import assessment from './reducers/Assessment';
import journal from './reducers/Journal';
import mediaProcessCount from './reducers/MediaProcessing';

const rootReducer = combineReducers({
  toast,
  progress,
  staff,
  attendance,
  announcement,
  classes,
  parent,
  media,
  chat,
  uploadProgressBar,
  assessment,
  journal,
  mediaProcessCount
});


export default rootReducer;
