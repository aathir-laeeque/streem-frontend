import { TextInput } from '#components';
import { CalendarToday } from '@material-ui/icons';
import React, { FC, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { updateActivityApi } from './actions';
import ActivityLabelInput from './ActivityLabelInput';
import { TextboxWrapper } from './styles';
import { ActivityProps } from './types';

const DateActivity: FC<Omit<ActivityProps, 'taskId'>> = ({ activity }) => {
  const dispatch = useDispatch();
  const componentLoaded = useRef<boolean>(false);
  useEffect(() => {
    if (componentLoaded.current) {
      dispatch(updateActivityApi(activity));
    } else if (activity) {
      componentLoaded.current = true;
    }
  }, [activity]);

  return (
    <TextboxWrapper>
      <label>Date Activity</label>
      <ActivityLabelInput activity={activity} isControlled />
      <div style={{ paddingBlock: 20 }}>
        <TextInput
          disabled={true}
          type="date"
          AfterElement={CalendarToday}
          afterElementWithoutError
          afterElementClass=""
        />
      </div>
    </TextboxWrapper>
  );
};

export default DateActivity;
