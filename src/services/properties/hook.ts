import { ComposerEntity } from '#PrototypeComposer/types';
import { useTypedSelector } from '#store';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { fetch } from './actions';

const useProperties = (entity: ComposerEntity) => {
  const entityProperties = useTypedSelector(
    (state) => state.propertiesService[entity],
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (!entityProperties.list.length) {
      dispatch(fetch(entity));
    }
  }, []);

  return { ...entityProperties };
};

export { useProperties };
