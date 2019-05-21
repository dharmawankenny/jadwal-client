import baseReducer, { StateKey as BaseStateKey, initialState as baseInitialState } from './base';
import majorReducer, { StateKey as MajorStateKey, initialState as majorInitialState } from './majors';
import scheduleReducer, { StateKey as ScheduleStateKey, initialState as scheduleInitialState } from './schedules';

export const initialState = {
  [BaseStateKey]: baseInitialState,
  [MajorStateKey]: majorInitialState,
  [ScheduleStateKey]: scheduleInitialState,
};

const reducerMap = {
  ...baseReducer,
  ...majorReducer,
  ...scheduleReducer,
};

export default function reducers(state, action) {
  const actor = reducerMap[action.type];
  const stateKey = action.type.split('_')[0];
  const update = actor(state[stateKey], action.payload);

  if (process.env.NODE_ENV !== 'production') {
    console.log('prev state: ', state);
    console.log('next state: ', {
      ...state,
      [stateKey]: {
        ...state[stateKey],
        ...update,
      },
    });
  }

  return {
    ...state,
    [stateKey]: {
      ...state[stateKey],
      ...update,
    },
  };
}
