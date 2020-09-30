import { ComposerEntity } from '#Composer-new/types';
import { useTypedSelector } from '#store/helpers';
import { useProperties } from '#store/properties';
import { fetchUsers } from '#store/users copy/actions';
import { UserStatus } from '#store/users copy/types';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import PrototypeForm from './PrototypeForm';
import { Wrapper } from './styles';
import { Props } from './types';

const NewPrototype: FC<Props> = () => {
  const dispatch = useDispatch();

  const properties = useProperties(ComposerEntity.CHECKLIST);

  const { list } = useTypedSelector((state) => state.usersCopy.active);

  useEffect(() => {
    if (list.length === 0) {
      dispatch(
        fetchUsers(
          {
            page: 0,
            size: 50,
            sort: 'createdAt,desc',
            filters: JSON.stringify({
              op: 'AND',
              fields: [{ field: 'isArchived', op: 'EQ', values: [false] }],
            }),
          },
          UserStatus.ACTIVE,
        ),
      );
    }
  }, [list]);

  return (
    <Wrapper>
      <PrototypeForm checklistProperties={properties} users={list} />
    </Wrapper>
  );
};

export default NewPrototype;
