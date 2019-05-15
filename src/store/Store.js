import React, { createContext, useContext, useReducer } from 'react';

import reducers, { initialState } from '../reducers/reducers';

const StoreContext = createContext(initialState);
const DispatchContext = createContext(() => console.error('Dispatch provider does not exist, make sure you wrap your root component with it'));

export default function Store(props) {
  const [state, dispatch] = useReducer(reducers, initialState);

  return (
    <StoreContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {props.children}
      </DispatchContext.Provider>
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}

export function useDispatch() {
  return useContext(DispatchContext);
}
