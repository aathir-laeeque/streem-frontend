import { Avatar, BaseModal, Checkbox, TextInput } from '#components';
import { CommonOverlayProps } from '#components/OverlayContainer/types';
import { defaultParams, OtherUserState, User, useUsers } from '#services/users';
import { apiAssignUsersForChecklist, apiGetAllUsersAssignedToChecklistTask } from '#utils/apiUrls';
import { FilterOperators } from '#utils/globalTypes';
import { request } from '#utils/request';
import { getFullName } from '#utils/stringUtils';
import { usePrevious } from '#utils/usePrevious';
import { Search } from '@material-ui/icons';
import { debounce } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Wrapper } from '#views/Jobs/Assignment/styles';
import { Checklist } from '#views/Checklists/types';

type Props = {
  checklistId: Checklist['id'];
  selectedTasks: string[];
  onClose: () => void;
};

type ListItemProps = {
  user: User;
  selected: boolean;
  partialSelected?: boolean;
  onClick: () => void;
};

const ListItem = ({ user, selected, partialSelected = false, onClick }: ListItemProps) => (
  <div className="list-item">
    <Checkbox onClick={onClick} label="" checked={selected} partial={partialSelected} />
    <Avatar user={user} size="large" />
    <div className="user-detail">
      <span className="user-id">{user.employeeId}</span>
      <span className="user-name">{getFullName(user)}</span>
    </div>
  </div>
);

const ChecklistUserAssignment: FC<CommonOverlayProps<Props>> = ({
  closeAllOverlays,
  closeOverlay,
  props: { checklistId, selectedTasks = [], onClose } = {},
}) => {
  // users that are already selected
  const [preAssignedUsers, setPreAssignedUsers] = useState<User[]>([]);
  // users that are newly selected or selected after unselecting
  const [assignedUserList, setAssignedUserList] = useState<User[]>([]);
  // users that are unselected
  const [unAssignedUserList, setUnAssignedUserList] = useState<User[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const prevQuery = usePrevious(searchQuery);

  const { users, loadMore, loadAgain } = useUsers({
    userState: OtherUserState.TASKS,
    params: defaultParams(false),
  });

  useEffect(() => {
    (async () => {
      try {
        const data = await request('POST', apiGetAllUsersAssignedToChecklistTask(checklistId!), {
          data: selectedTasks.map((taskId) => taskId),
        });

        setPreAssignedUsers(data.data);
        setAssignedUserList(data.data);
      } catch (error) {
        console.log('error came apiGetAllUsersAssignedToChecklistTask :: ', error);
      }
    })();
  }, []);

  useEffect(() => {
    if (prevQuery !== searchQuery) {
      loadAgain({
        newParams: {
          ...defaultParams(false),
          filters: JSON.stringify({
            op: FilterOperators.AND,
            fields: [
              {
                field: 'firstName',
                op: FilterOperators.LIKE,
                values: [searchQuery],
              },
            ],
          }),
        },
      });
    }
  }, [searchQuery]);

  const assignUsers = async (notify = true) => {
    const assignedUsers = assignedUserList.filter(
      (user) =>
        !preAssignedUsers.some(
          (_user) => _user.id === user.id && _user.completelyAssigned === user.completelyAssigned,
        ),
    );

    const unassignedUsers = unAssignedUserList.filter((user) =>
      preAssignedUsers.some((_user) => _user.id === user.id),
    );

    await request('PATCH', apiAssignUsersForChecklist(checklistId as string), {
      data: {
        taskIds: selectedTasks,
        assignedUserIds: assignedUsers.map((user) => user.id),
        unassignedUserIds: unassignedUsers.map((user) => user.id),
      },
      params: { notify },
    });

    closeOverlay();
    onClose && onClose();
  };

  const handleOnScroll = (e: React.UIEvent<HTMLElement>) => {
    e.stopPropagation();
    const { scrollHeight, scrollTop, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - clientHeight * 0.7) loadMore();
  };

  return (
    <Wrapper>
      <BaseModal
        closeAllModals={closeAllOverlays}
        closeModal={closeOverlay}
        title="Assign Users"
        primaryText="Confirm"
        secondaryText="Cancel"
        onPrimary={assignUsers}
        modalFooterOptions={
          <span
            style={{
              color: `#1d84ff`,
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 14,
            }}
            onClick={() => assignUsers(false)}
          >
            Confirm Without Notifying
          </span>
        }
      >
        <div className="list-controller">
          <TextInput
            AfterElement={Search}
            afterElementWithoutError
            afterElementClass="search"
            defaultValue={searchQuery}
            name="search-filter"
            onChange={debounce(({ value }) => setSearchQuery(value), 500)}
            placeholder="Search with First Name"
          />

          <span
            className="deselect"
            onClick={() => {
              setUnAssignedUserList([...unAssignedUserList, ...assignedUserList]);
              setAssignedUserList([]);
            }}
          >
            Deselect All
          </span>
        </div>

        <div className="users-list" onScroll={handleOnScroll}>
          {assignedUserList.map((user) => (
            <ListItem
              key={user.id}
              onClick={() => {
                if (!!user.completelyAssigned) {
                  // unselect user
                  setAssignedUserList((_users) => _users.filter((_user) => _user.id !== user.id));

                  setUnAssignedUserList((_users) => [..._users, user]);
                } else {
                  // user partial selected make him complete selected
                  setAssignedUserList((_users) =>
                    _users.map((_user) => ({
                      ..._user,
                      ...(_user.id === user.id ? { completelyAssigned: true } : {}),
                    })),
                  );
                }
              }}
              selected={!!user.completelyAssigned}
              partialSelected={!user.completelyAssigned}
              user={user}
            />
          ))}

          {[...users.filter((user) => !assignedUserList.some((_user) => _user.id === user.id))].map(
            (user) => (
              <ListItem
                user={user}
                key={user.id}
                selected={false}
                partialSelected={false}
                onClick={() => {
                  setUnAssignedUserList((_users) => _users.filter((_user) => _user.id !== user.id));
                  setAssignedUserList((_users) => [
                    ..._users,
                    { ...user, completelyAssigned: true },
                  ]);
                }}
              />
            ),
          )}
        </div>
      </BaseModal>
    </Wrapper>
  );
};

export default ChecklistUserAssignment;
