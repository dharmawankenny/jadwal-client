import { useEffect } from 'react';
import { useStore, useDispatch } from '../store/Store';
import { loadMajors, fetchMajors } from '../reducers/majors';

export default function useMajors() {
  const store = useStore();
  const dispatch = useDispatch();

  return [
    store.major,
    {
      loadMajors: () => dispatch(loadMajors()),
      fetchMajors: async () => dispatch(await fetchMajors()),
    },
  ];
}

export function useMajorsInitiation() {
  const [_, { loadMajors, fetchMajors }] = useMajors();

  useEffect(() => {
    loadMajors();
    fetchMajors();
  }, []);
}
