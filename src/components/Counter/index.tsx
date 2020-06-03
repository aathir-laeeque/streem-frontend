import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../store/types';
import { decrement, increment, reset } from './actions';

const Test: FC = () => {
  const count = useSelector((state: RootState) => state.counter.count);
  const dispatch = useDispatch();

  return (
    <div>
      <div>This is Counter component connected to redux store</div>

      <div>Count : {count}</div>

      <button onClick={() => dispatch(increment())}>Increment</button>
      <button onClick={() => dispatch(decrement())}>Decrement</button>
      <button onClick={() => dispatch(reset())}>Reset</button>
    </div>
  );
};

export default Test;
