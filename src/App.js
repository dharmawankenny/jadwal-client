import React from 'react';

import useBase, { useBaseInitiation, useBaseWatcher } from './hooks/useBase';
import useMajors, { useMajorsInitiation } from './hooks/useMajors';
import useSchedules, { useSchedulesInitiation } from './hooks/useSchedules';

import PageLoader from './components/PageLoader';

import MajorSelection from './containers/MajorSelection';
import ScheduleSelection from './containers/ScheduleSelection';

export default function App() {
  useBaseInitiation();
  useMajorsInitiation();
  useSchedulesInitiation();
  useBaseWatcher();

  const [baseState] = useBase();
  const [majorsState] = useMajors();
  const [schedulesState] = useSchedules();

  const isLoading = !baseState.hydrated || majorsState.isLoading || schedulesState.isLoading;

  return (
    <>
      <PageLoader isLoading={isLoading} />
      {baseState.selectedMajor === '' && <MajorSelection />}
      {baseState.selectedMajor !== '' && <ScheduleSelection />}
    </>
  );
}