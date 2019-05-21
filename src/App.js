import React from 'react';

import useBase, { useBaseInitiation, useBaseWatcher, useValidateBase } from './hooks/useBase';
import useMajors, { useMajorsInitiation } from './hooks/useMajors';
import useSchedules, { useSchedulesInitiation } from './hooks/useSchedules';

import PageLoader from './components/PageLoader';

import MajorSelection from './containers/MajorSelection';
import ScheduleSelection from './containers/ScheduleSelection';
import ScheduleView from './containers/ScheduleView';

export default function App() {
  useBaseInitiation();
  useMajorsInitiation();
  useSchedulesInitiation();
  useBaseWatcher();
  useValidateBase();

  const [baseState] = useBase();
  const [majorsState] = useMajors();
  const [schedulesState] = useSchedules();

  const isLoading = !baseState.hydrated || majorsState.isLoading || schedulesState.isLoading;

  return (
    <>
      <PageLoader isLoading={isLoading} />
      {(baseState.selectedMajor === '' && !isLoading)  && <MajorSelection />}
      {(baseState.selectedMajor !== '' && !isLoading) && <ScheduleSelection />}
      {(baseState.selectedMajor !== '' && !isLoading)  && <ScheduleView />}
    </>
  );
}