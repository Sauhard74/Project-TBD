import { useDispatch } from 'react-redux';
import { uploadStudentWork } from '../apis/Assessment.api';
import { showToast } from '../redux/reducers/toast';
import { mutate } from 'swr';

const useEvaluation = () => {
  const dispatch = useDispatch();

  const handleUploadStudentWork = async (
    evaluationId: string,
    medias: MediaDetailType[],
    activityId: string,
    periodId: string | undefined | null,
    assessmentId: string | undefined | null
  ) => {
    try {
      for (const media of medias) {
        await uploadStudentWork(evaluationId!, {
          media_link: media.media_link!,
          media_name: media.media_name!,
          media_size: media.media_size?.toString() || '',
          media_type: media.media_type!
        });
      }
      // Refetch the data
      mutate(['assessment_students', activityId, periodId, assessmentId]);
    } catch (err) {
      dispatch(showToast({ text: 'Failed to upload student work', type: 'error' }));
    }
  };

  return { handleUploadStudentWork };
};

export default useEvaluation;
