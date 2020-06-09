import { RouteComponentProps } from '@reach/router';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import { useTypedSelector } from '../../store/helpers';
import { AppDispatch } from '../../store/types';
import { decrement, increment, reset } from './actions';

interface Props extends RouteComponentProps {
  someValue?: string;
}

const Counter: FC<Props> = () => {
  const { count } = useTypedSelector((state) => state.counter);

  const dispatch = useDispatch<AppDispatch>();

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

export default Counter;
