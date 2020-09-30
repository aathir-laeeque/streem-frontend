import { isEmpty } from 'lodash';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { ComposerEntity } from '../../Composer-new/types';
import { useTypedSelector } from '../helpers';
import { fetchProperties } from './actions';

export const useProperties = (entity: ComposerEntity) => {
  const properties = useTypedSelector((state) => state.properties[entity]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (isEmpty(properties)) {
      dispatch(fetchProperties({ type: entity.toUpperCase() }));
    }
  }, []);

  return properties;
};
