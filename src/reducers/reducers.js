import baseReducer, { initialState as baseInitialState } from './base';
import majorReducer, { initialState as majorInitialState } from './majors';

export const initialState = {
  ...baseInitialState,
  ...majorInitialState,
};

const reducerMap = {
  ...baseReducer,
  ...majorReducer,
};

export default function reducers(state, action) {
  const actor = reducerMap[action.type];
  const update = actor(state, action.payload);

  return { ...state, ...update };
}
