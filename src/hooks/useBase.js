import { useEffect } from 'react';
import { useStore, useDispatch } from '../store/Store';
import { hydrateBase, selectBaseMajor, setSchedule, deleteSchedule, initialState } from '../reducers/base';
import useSchedules from './useSchedules';

const BASE_STORAGE_KEY = 'JADWAL_LOCAL_STORAGE_BASE_DATA';
let storage;

if (typeof (window.localStorage) !== 'undefined') {
  storage = window.localStorage;
}

export default function useBase() {
  const store = useStore();
  const dispatch = useDispatch();

  return [
    store.base,
    {
      hydrateBase: payload => dispatch(hydrateBase(payload)),
      selectBaseMajor: payload => dispatch(selectBaseMajor(payload)),
      setSchedule: payload => dispatch(setSchedule(payload)),
      deleteSchedule: payload => dispatch(deleteSchedule(payload)),
    },
  ];
}

export function useBaseInitiation() {
  const [_, { hydrateBase }] = useBase();

  useEffect(
    () => {
      async function hydrate() {
        if (storage) {
          const hydrationData = storage.getItem(BASE_STORAGE_KEY);

          if (hydrationData && hydrationData !== '') {
            hydrateBase(JSON.parse(hydrationData));
          } else {
            hydrateBase(initialState);
          }
        } else {
          hydrateBase(initialState);
        }
      }

      hydrate();
    },
    []
  );
}

export function useBaseWatcher() {
  const [base] = useBase();

  useEffect(
    () => {
      if (base.hydrated) {
        storage.setItem(BASE_STORAGE_KEY, JSON.stringify(base));
      }
    },
    [base]
  );
}

export function useValidateBase() {
  const [base, { deleteSchedule }] = useBase();
  const [{ schedules }] = useSchedules();

  useEffect(
    () => {
      if (base.selectedSchedule[base.selectedMajor]) {
        const invalidCourses = [];
        
        Object.entries(base.selectedSchedule[base.selectedMajor])
          .forEach(([courseId, className]) => {
            if (
              schedules[base.selectedMajor] &&
              schedules[base.selectedMajor].courses &&
              !schedules[base.selectedMajor].courses[courseId]
            ) {
              invalidCourses.push(courseId);
            } else if (
              schedules[base.selectedMajor] &&
              schedules[base.selectedMajor].courses &&
              schedules[base.selectedMajor].courses[courseId] &&
              schedules[base.selectedMajor].courses[courseId].courseClasses &&
              !schedules[base.selectedMajor].courses[courseId].courseClasses[className]
            ) {
              invalidCourses.push(courseId);
            }
          });
        
        invalidCourses.forEach(courseId => deleteSchedule({ courseId }));
      }
    },
    [base, schedules]
  );
}
