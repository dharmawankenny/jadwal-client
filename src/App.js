import React from 'react';
import { useStore } from './store/Store';
import useBase from './hooks/useBase';

export default function App() {
  const store = useStore();

  console.log(store);

  const baseState = useBase();

  console.log(baseState);

  return (
    <div>Hello</div>
  );
}
