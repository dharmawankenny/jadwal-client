const BaseActionTypes = {
  hydrate: 'BASE_HYDRATE',
};

export const initialState = {
  base: {
    hydrated: false,
    selectedMajor: '',
    selectedSchedule: {},
  },
};

export function hydrateBase(payload) {
  return ({ type: BaseActionTypes.hydrate, payload });
}

export default {
  [BaseActionTypes.hydrate]: (_, payload) => ({
    base: {
      ...payload,
      hydrated: true,
    },
  }),
};
