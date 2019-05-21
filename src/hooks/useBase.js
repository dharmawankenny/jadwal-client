import { useEffect } from 'react';
import { useStore, useDispatch } from '../store/Store';
import { hydrateBase, selectBaseMajor, setSchedule, deleteSchedule, initialState } from '../reducers/base';

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
