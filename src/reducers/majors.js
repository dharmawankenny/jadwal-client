export const StateKey = 'major';

const MajorActionTypes = {
  load: `${StateKey}_LOAD`,
  loadFinished: `${StateKey}_LOAD_FINISHED`,
};

/**
 * majors: [
 *  {
 *    id: string;
 *    faculty: string;
 *    major: string;
 *  },
 * ] 
 */
export const initialState = {
  isLoading: true,
  majors: [],
};

export function loadMajors() {
  return ({ type: MajorActionTypes.load });
}

export function loadMajorsFinished(payload) {
  return ({ type: MajorActionTypes.loadFinished, payload });
}

export async function fetchMajors() {
  // replace this later
  await new Promise(resolve => setTimeout(resolve, 1000));
  const majors = [
    {
      id: 'ilkom',
      faculty: 'Fasilkom',
      major: 'Ilmu Komputer',
    },
    {
      id: 'si',
      faculty: 'Fasilkom',
      major: 'Sistem Informasi',
    },
  ];

  return loadMajorsFinished(majors);
}

export default {
  [MajorActionTypes.load]: state => ({
    ...state,
    isLoading: true,
  }),
  [MajorActionTypes.loadFinished]: (state, payload) => ({
    ...state,
    isLoading: false,
    majors: payload,
  }),
};
