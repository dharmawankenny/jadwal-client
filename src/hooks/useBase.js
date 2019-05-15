import { useEffect } from 'react';
import { useStore, useDispatch } from '../store/Store';
import { hydrateBase, initialState } from '../reducers/base';

const BASE_STORAGE_KEY = 'JADWAL_LOCAL_STORAGE_BASE_DATA';
let storage;

if (typeof (window.localStorage) !== 'undefined') {
  storage = window.localStorage;
}

export default function useBase() {
  const store = useStore();
  const dispatch = useDispatch();

  useEffect(
    () => {
      async function hydrate() {
        if (storage) {
          const hydrationData = storage.getItem(BASE_STORAGE_KEY);

          if (hydrationData && hydrationData !== '') {
            dispatch(hydrateBase(JSON.parse(hydrationData)));
          } else {
            dispatch(hydrateBase(initialState.base));
          }
        } else {
          dispatch(hydrateBase(initialState.base));
        }
      }

      hydrate();
    },
    []
  );

  useEffect(
    () => {
      if (store.base.hydrated) {
        storage.setItem(BASE_STORAGE_KEY, JSON.stringify(store.base));
      }
    },
    [store.base]
  );

  return store.base;
}
