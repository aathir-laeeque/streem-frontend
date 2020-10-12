import { isEmpty } from 'lodash';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { useTypedSelector } from '../helpers';
import { fetchProperties } from './actions';
import { usePropertiesArgs } from './types';

export const useProperties = ({ entity }: usePropertiesArgs) => {
  const properties = useTypedSelector((state) => state.properties[entity]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (isEmpty(properties)) {
      dispatch(fetchProperties({ type: entity }));
    }
  }, []);

  return properties;
};
