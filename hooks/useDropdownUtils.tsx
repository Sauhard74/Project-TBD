import UserSvg from '../assets/privacylevel-svgs/User.svg';
import LockSvg from '../assets/privacylevel-svgs/Lock.svg';
import ClassroomSvg from '../assets/privacylevel-svgs/classroom.svg';
import EveryoneSvg from '../assets/privacylevel-svgs/everyone.svg';
import { AuthContext } from '../context/AuthContext';
import { getPrimaryUserDetails } from '../utilities/user.utils';
import { useContext } from 'react';

const useDropdownUtils = () => {
  const { isParent } = useContext(AuthContext);
  const { isSoloEducator } = getPrimaryUserDetails(isParent ? 'parent' : 'teacher') as {
    isSoloEducator: boolean | undefined;
  };

  const getPrivacyOptions = () => {
    return [
      { key: 'Private', value: 'Private', icon: 'lock', svg: <LockSvg width={15} height={15} /> },
      {
        key: `Student's Family`,
        value: `Student's Family`,
        icon: 'people',
        svg: <UserSvg width={18} height={18} />
      },
      {
        key: 'Whole Class',
        value: 'Whole Class',
        icon: 'notebook',
        svg: <ClassroomSvg width={18} height={18} />
      },
      ...(!isSoloEducator
        ? [
            {
              key: 'Whole School',
              value: 'Whole School',
              icon: 'globe',
              svg: <EveryoneSvg width={18} height={18} />
            }
          ]
        : [])
    ];
  };

  return { getPrivacyOptions };
};

export default useDropdownUtils;
