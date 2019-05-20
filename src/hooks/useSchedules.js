import { useEffect } from 'react';
import { useStore, useDispatch } from '../store/Store';
import { loadSchedules, fetchSchedules } from '../reducers/schedules';

export default function useSchedules() {
  const store = useStore();
  const dispatch = useDispatch();

  return [
    store.schedule,
    {
      loadSchedules: () => dispatch(loadSchedules()),
      fetchSchedules: async () => dispatch(await fetchSchedules()),
    },
  ];
}

export function useSchedulesInitiation() {
  const [_, { loadSchedules, fetchSchedules }] = useSchedules();

  useEffect(() => {
    loadSchedules();
    fetchSchedules();
  }, []);
}
