import { useCallback, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import useSWR from 'swr';
import {
  filterAssessment,
  getScheduledActivities,
  getUnscheduledActivities
} from '../apis/Assessment.api';
import { AuthContext } from '../context/AuthContext';
import { showToast } from '../redux/reducers/toast';
import { ASSESSMENTS_PER_PAGE } from '../utilities/constants';
import { useFocusEffect } from '@react-navigation/native';

type Tab = 'Unscheduled' | 'Upcoming' | 'To Do' | 'Done' | 'Journaled';

const useAssessment = (searchTerm: string) => {
  const { classId } = useContext(AuthContext);

  const [unscheduledAssessments, setUnscheduledAssessments] = useState<AssessmentActivityType[]>(
    []
  );
  const [upcomingAssessments, setUpcomingAssessments] = useState<AssessmentActivityType[]>([]);
  const [toDoAssessments, setToDoAssessments] = useState<AssessmentActivityType[]>([]);
  const [doneAssessments, setDoneAssessments] = useState<AssessmentActivityType[]>([]);
  const [journaledAssessments, setJournaledAssessments] = useState<AssessmentActivityType[]>([]);

  const [unscheduledPage, setUnscheduledPage] = useState(1);
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [toDoPage, setToDoPage] = useState(1);
  const [donePage, setDonePage] = useState(1);
  const [journaledPage, setJournaledPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const stateOfTabs = {
    Unscheduled: [
      unscheduledAssessments,
      setUnscheduledAssessments,
      unscheduledPage,
      setUnscheduledPage
    ] as const,
    Upcoming: [upcomingAssessments, setUpcomingAssessments, upcomingPage, setUpcomingPage] as const,
    'To Do': [toDoAssessments, setToDoAssessments, toDoPage, setToDoPage] as const,
    Done: [doneAssessments, setDoneAssessments, donePage, setDonePage] as const,
    Journaled: [
      journaledAssessments,
      setJournaledAssessments,
      journaledPage,
      setJournaledPage
    ] as const
  };

  const handlePagination = (
    tab: Tab,
    data: {
      _id: string | null;
      activities: AssessmentActivityType[];
    }[]
  ) => {
    if (!data) return;

    const [_, setAssessment, page, setPage] = stateOfTabs[tab];
    const assessments = data?.at(0)?.activities || [];

    if (page === 1) {
      setAssessment(assessments);
    } else {
      setAssessment((prev) => [...prev, ...assessments]);
    }

    if (assessments.length < ASSESSMENTS_PER_PAGE) {
      setPage(-1);
    }
  };

  const fetchAssessments = async (tab: Tab) => {
    const [_, __, page] = stateOfTabs[tab];
    if (page <= -1) return;
    setLoading(true);
    let fetcher: Promise<
      {
        _id: string | null;
        activities: AssessmentActivityType[];
      }[]
    >;

    searchTerm = searchTerm.trim();

    if (searchTerm) {
      if (tab === 'To Do') {
        fetcher = filterAssessment(classId!, searchTerm, undefined, 'TODO', page);
      } else {
        fetcher = filterAssessment(
          classId!,
          searchTerm,
          undefined,
          tab.toUpperCase() as 'UNSCHEDULED' | 'UPCOMING' | 'DONE' | 'JOURNALED',
          page
        );
      }
    } else {
      if (tab === 'Unscheduled') {
        fetcher = getUnscheduledActivities(classId!, unscheduledPage);
      } else if (tab === 'To Do') {
        fetcher = getScheduledActivities(classId!, 'TODO', page);
      } else {
        fetcher = getScheduledActivities(
          classId!,
          tab.toUpperCase() as 'UPCOMING' | 'DONE' | 'JOURNALED',
          page
        );
      }
    }

    return fetcher?.finally(() => setLoading(false));
  };

  // when search term changes, reset the page to 1
  useEffect(() => {
    Object.keys(stateOfTabs).forEach((tab) => {
      const [_, __, page, setPage] = stateOfTabs[tab as Tab];
      if (page !== 1) {
        setPage(1);
      }
    });
  }, [searchTerm]);

  // ##### UNSCHEDULED ASSESSMENTS ######
  const { data: swrUnscheduled, mutate: mutateUnscheduled } = useSWR(
    // tab - 0 : Unscheduled
    classId ? ['unscheduled_assessment', classId, unscheduledPage, searchTerm] : null,
    () => fetchAssessments('Unscheduled'),
    {
      onError: (error) => {
        dispatch(showToast({ text: 'Failed to fetch Unscheduled Assessments', type: 'error' }));
      }
    }
  );

  useEffect(() => {
    if (swrUnscheduled) {
      handlePagination('Unscheduled', swrUnscheduled);
    }
  }, [swrUnscheduled]);

  // ##### UPCOMING ASSESSMENTS ######
  const { data: swrUpcoming, mutate: mutateUpcoming } = useSWR(
    // tab - 1 : Upcoming
    classId ? ['upcoming_assessment', classId, upcomingPage, searchTerm] : null,
    () => fetchAssessments('Upcoming'),
    {
      onError: (error) => {
        dispatch(showToast({ text: 'Failed to fetch Upcoming Assessments', type: 'error' }));
      }
    }
  );

  useEffect(() => {
    if (swrUpcoming) {
      handlePagination('Upcoming', swrUpcoming);
    }
  }, [swrUpcoming]);

  // #### TO DO ASSESSMENTS ####
  const { data: swrToDo, mutate: mutateToDo } = useSWR(
    // tab - 2 : To Do
    classId ? ['toDo_assessment', classId, toDoPage, searchTerm] : null,
    () => fetchAssessments('To Do'),
    {
      onError: (error) => {
        dispatch(showToast({ text: 'Failed to fetch To Do Assessments', type: 'error' }));
      }
    }
  );

  useEffect(() => {
    if (swrToDo) {
      handlePagination('To Do', swrToDo);
    }
  }, [swrToDo]);

  // #### DONE ASSESSMENTS ####
  const { data: swrDone, mutate: mutateDone } = useSWR(
    // tab - 3 : Done
    classId ? ['done_assessment', classId, donePage, searchTerm] : null,
    () => fetchAssessments('Done'),
    {
      onError: (error) => {
        dispatch(showToast({ text: 'Failed to fetch Done Assessments', type: 'error' }));
      }
    }
  );

  useEffect(() => {
    if (swrDone) {
      handlePagination('Done', swrDone);
    }
  }, [swrDone]);

  // #### JOURNALED ASSESSMENTS ####
  const { data: swrJournaled, mutate: mutateJournaled } = useSWR(
    // tab - 4: Journaled
    classId ? ['journaled_assessment', classId, journaledPage, searchTerm] : null,
    () => fetchAssessments('Journaled'),
    {
      onError: (error) => {
        dispatch(showToast({ text: 'Failed to fetch Journaled Assessments', type: 'error' }));
      }
    }
  );

  useEffect(() => {
    if (swrJournaled) {
      handlePagination('Journaled', swrJournaled);
    }
  }, [swrJournaled]);

  useFocusEffect(
    useCallback(() => {
      setUnscheduledPage(1);
      setUpcomingPage(1);
      setToDoPage(1);
      setDonePage(1);
      setJournaledPage(1);

      mutateUnscheduled();
      mutateUpcoming();
      mutateToDo();
      mutateDone();
      mutateJournaled();
    }, [])
  );

  return {
    stateOfTabs,
    loading
  };
};

export default useAssessment;
