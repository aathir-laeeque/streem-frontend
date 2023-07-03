import React, { FC, useEffect } from 'react';
import { Button, useDrawer } from '#components';
import { defaultParams, useUsers } from '#services/users';
import { Select } from '#components';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { FilterOperators } from '#utils/globalTypes';
import { InputActionMeta } from 'react-select';
import { debounce } from 'lodash';

const AddUserFormWrapper = styled.div`
  width: 100%;
  margin-top: 16px;
`;

const AddUserDrawer: FC<{
  onCloseDrawer: React.Dispatch<React.SetStateAction<boolean | string>>;
  label: string | boolean;
}> = ({ onCloseDrawer, label }) => {
  const form = useForm<{
    user: Record<string, any>;
  }>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
  });

  const {
    register,
    handleSubmit,
    formState: { isDirty, isValid },
    setValue,
    watch,
    getValues,
    // errors,
    reset,
  } = form;

  register('user', { required: true });

  const user = watch('user');

  const setUser = (data: any) => {
    if (data) {
      setValue('user', data.value, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  useEffect(() => {
    setDrawerOpen(true);
  }, [onCloseDrawer]);

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => {
      onCloseDrawer(false);
    }, 200);
  };

  const { users, loadAgain, loadMore } = useUsers({
    params: { ...defaultParams(false) },
  });

  const { StyledDrawer, setDrawerOpen } = useDrawer({
    title: 'Add User',
    hideCloseIcon: true,
    bodyContent: (
      <AddUserFormWrapper>
        <Select
          placeholder="Select"
          label="Select user"
          options={
            users?.map((user) => ({
              value: user.id,
              label: user?.firstName + ' ' + user?.lastName,
              externalId: <div>&nbsp;(ID: {user?.employeeId})</div>,
            })) as any
          }
          onInputChange={debounce((newValue: string, actionMeta: InputActionMeta) => {
            if (newValue !== actionMeta.prevInputValue) {
              loadAgain({
                newParams: {
                  ...defaultParams(),
                  filters: JSON.stringify({
                    op: 'OR',
                    fields: [
                      {
                        field: 'firstName',
                        op: FilterOperators.LIKE,
                        values: [newValue],
                      },
                      {
                        field: 'lastName',
                        op: FilterOperators.LIKE,
                        values: [newValue],
                      },
                      {
                        field: 'employeeId',
                        op: FilterOperators.LIKE,
                        values: [newValue],
                      },
                    ],
                  }),
                },
              });
            }
          }, 500)}
          onChange={(data) => setUser(data)}
          filterOption={() => true}
          onMenuScrollToBottom={loadMore}
        />
      </AddUserFormWrapper>
    ),
    footerContent: (
      <>
        <Button variant="secondary" style={{ marginLeft: 'auto' }} onClick={handleCloseDrawer}>
          Cancel
        </Button>

        <Button type="submit" disabled={!isDirty || !isValid} onClick={() => console.log('saved')}>
          Save
        </Button>
      </>
    ),
  });

  return StyledDrawer;
};

export default AddUserDrawer;
