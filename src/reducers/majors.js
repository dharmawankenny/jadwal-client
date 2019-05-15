const MajorActionTypes = {
  load: 'MAJOR_LOAD',
  loadFinished: 'MAJOR_LOAD_FINISHED',
};

export const initialState = {
  major: {
    isLoading: false,
    majors: [],
  },
};

export function loadMajor() {
  return ({ type: MajorActionTypes.load });
}

export function loadMajorFinished(payload) {
  return ({ type: MajorActionTypes.load, payload });
}

export default {
  [MajorActionTypes.load]: state => ({
    major: {
      ...state.major,
      isLoading: true,
    },
  }),
  [MajorActionTypes.loadFinished]: (state, payload) => ({
    major: {
      ...state.major,
      isLoading: false,
      majors: payload,
    },
  }),
};
