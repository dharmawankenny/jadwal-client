export const StateKey = 'base';

const BaseActionTypes = {
  hydrate: `${StateKey}_HYDRATE`,
  selectMajor: `${StateKey}_SELECT_MAJOR`,
  setSchedule: `${StateKey}_SET_SCHEDULE`,
  deleteSchedule: `${StateKey}_DELETE_SCHEDULE`,
};

export const initialState = {
  hydrated: false,
  selectedMajor: '',
  selectedSchedule: {},
};

export function hydrateBase(payload) {
  return ({ type: BaseActionTypes.hydrate, payload });
}

export function selectBaseMajor(selectedMajor) {
  return ({ type: BaseActionTypes.selectMajor, payload: { selectedMajor } });
}

export function setSchedule(payload) {
  return ({ type: BaseActionTypes.setSchedule, payload });
}

export function deleteSchedule(payload) {
  return ({ type: BaseActionTypes.deleteSchedule, payload });
}

export default {
  [BaseActionTypes.hydrate]: (_, payload) => ({
    ...payload,
    hydrated: true,
  }),
  [BaseActionTypes.selectMajor]: (prevState, payload) => {
    const selectedSchedule = { ...prevState.selectedSchedule };

    if (!selectedSchedule[payload.selectedMajor]) {
      selectedSchedule[payload.selectedMajor] = {};
    }

    return {
      ...prevState,
      ...payload,
      selectedSchedule,
    };
  },
  [BaseActionTypes.setSchedule]: (prevState, payload) => {
    return {
      ...prevState,
      selectedSchedule: {
        ...prevState.selectedSchedule,
        [prevState.selectedMajor]: {
          ...prevState.selectedSchedule[prevState.selectedMajor],
          [payload.courseId]: payload.classId,
        },
      },
    };
  },
  [BaseActionTypes.deleteSchedule]: (prevState, payload) => {
    const selectedMajorSchedule = { ...prevState.selectedSchedule[prevState.selectedMajor] };
    delete selectedMajorSchedule[payload.courseId];

    return {
      ...prevState,
      selectedSchedule: {
        ...prevState.selectedSchedule,
        [prevState.selectedMajor]: {
          ...selectedMajorSchedule,
        },
      },
    };
  },
};
