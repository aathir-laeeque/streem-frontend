import { Button1, FormGroup, useScrollableSectionsProps } from '#components';
import { showNotification } from '#components/Notification/actions';
import { NotificationType } from '#components/Notification/types';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { RoleIdByName } from '#services/uiPermissions';
import { useTypedSelector } from '#store';
import { Facilities } from '#store/facilities/types';
import { fetchSelectedUserSuccess } from '#store/users/actions';
import { ChallengeQuestion, User, UserStates } from '#store/users/types';
import {
  apiCheckEmail,
  apiCheckEmployeeId,
  apiGetAllChallengeQuestions,
  apiUpdateChallengeQuestions,
  apiUpdatePassword,
} from '#utils/apiUrls';
import { ResponseObj, ValidatorProps } from '#utils/globalTypes';
import { getErrorMsg, request } from '#utils/request';
import { encrypt } from '#utils/stringUtils';
import { Create } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import { UseFormMethods } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { resendInvite } from '../actions';
import { RoleType, ValidateCredentialsPurpose } from '../types';
import { Credentials, CustomInputGroup, KeyGenerator } from './styles';
import { permissions, roles } from './temp';
import { EditUserRequestInputs, PAGE_TYPE, TogglesState } from './types';

export enum Toggleables {
  EDIT_PASSWORD = 'editPassword',
  EDIT_QUESTIONS = 'editQuestions',
}

type CreateSectionConfigProps = {
  pageType: PAGE_TYPE;
  isEditable: boolean;
  facilities: Facilities;
  isAccountOwner: boolean;
  formData: UseFormMethods<EditUserRequestInputs>;
  selectedUser?: User;
  rolePlaceholder?: string;
  selectedRoles?: RoleType[];
  toggles?: TogglesState;
  onFacilityChange?: (options: Option[]) => void;
  updateToggles?: (key: Toggleables) => void;
};

export const createSectionConfig = ({
  pageType,
  isEditable,
  facilities,
  formData,
  isAccountOwner,
  selectedUser,
  selectedRoles,
  rolePlaceholder = 'Role',
  toggles,
  onFacilityChange,
  updateToggles,
}: CreateSectionConfigProps) => {
  const dispatch = useDispatch();
  const { t: translate } = useTranslation(['userManagement']);
  const [validatedToken, setValidatedToken] = useState<string | undefined>();
  const { register, errors, getValues, setValue } = formData;
  const { roles: rolesValues, facilities: facilitiesValues } = getValues([
    'roles',
    'facilities',
  ]);

  const shouldShowAllFacilities = [
    RoleIdByName.ACCOUNT_OWNER,
    RoleIdByName.SYSTEM_ADMIN,
  ].includes(rolesValues as RoleIdByName);

  const config: useScrollableSectionsProps = {
    title: translate('userManagement:edit-title'),
    items: [
      {
        label: 'Basic Details',
        view: (
          <FormGroup
            inputs={[
              {
                type: 'text',
                props: {
                  placeholder: 'Enter Employee’s First Name',
                  label: 'First Name',
                  id: 'firstName',
                  name: 'firstName',
                  error: errors['firstName']?.message,
                  disabled:
                    pageType === PAGE_TYPE.PROFILE ? false : !isEditable,
                  ref: register({
                    required: true,
                  }),
                },
              },
              {
                type: 'text',
                props: {
                  placeholder: 'Enter Employee’s Last Name',
                  label: 'Last Name',
                  id: 'lastName',
                  name: 'lastName',
                  optional: true,
                  error: errors['lastName']?.message,
                  disabled:
                    pageType === PAGE_TYPE.PROFILE ? false : !isEditable,
                  ref: register,
                },
              },
            ]}
          />
        ),
      },
      {
        label: 'Work Details',
        view: (
          <FormGroup
            inputs={[
              {
                type: 'text',
                props: {
                  placeholder: 'Enter Employee’s ID',
                  label: 'Employee ID',
                  id: 'employeeId',
                  name: 'employeeId',
                  error: errors['employeeId']?.message,
                  disabled: pageType !== PAGE_TYPE.ADD,
                  ref:
                    pageType === PAGE_TYPE.ADD
                      ? register({
                          required: true,
                          maxLength: {
                            value: 45,
                            message: "Shouldn't be greater than 45 characters.",
                          },
                          validate: async (value) => {
                            const res = await request(
                              'POST',
                              apiCheckEmployeeId(),
                              {
                                data: {
                                  employeeId: value,
                                },
                              },
                            );
                            if (res?.errors?.length)
                              return (
                                res?.errors?.[0]?.message ||
                                'Employee ID already exists'
                              );
                            return true;
                          },
                        })
                      : register,
                },
              },
              {
                type: 'text',
                props: {
                  placeholder: 'Enter Employee’s Email Address',
                  label: 'Email ID',
                  id: 'email',
                  name: 'email',
                  error: errors['email']?.message,
                  disabled:
                    pageType === PAGE_TYPE.PROFILE ? false : !isEditable,
                  optional: true,
                  ref: register({
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+$/i,
                      message: 'Invalid email address',
                    },
                    validate: async (value) => {
                      if (!value || selectedUser?.email === value) return true;
                      const res = await request('POST', apiCheckEmail(), {
                        data: { email: value },
                      });
                      if (res?.errors?.length)
                        return (
                          res?.errors?.[0]?.message || 'Email ID already exists'
                        );
                      return true;
                    },
                  }),
                },
              },
              {
                type: 'text',
                props: {
                  placeholder: 'Enter Employee’s Department',
                  label: 'Department',
                  id: 'department',
                  name: 'department',
                  ref: register,
                  optional: true,
                  disabled: !isEditable,
                },
              },
            ]}
          />
        ),
      },
      ...(selectedUser?.state === UserStates.REGISTERED
        ? [
            {
              label: 'Login Credentials',
              view: (
                <KeyGenerator>
                  <h3>Username : {selectedUser?.username}</h3>
                  <Button1
                    className="primary-button"
                    variant="secondary"
                    onClick={() =>
                      dispatch(resendInvite({ id: selectedUser.id }))
                    }
                  >
                    Generate Secret Key
                  </Button1>
                  <p>
                    If the user has no access to their account, they can go to
                    the login page and choose Forgot Password option. Here the
                    user uses the Sceret Key to change their password.
                  </p>
                </KeyGenerator>
              ),
            },
          ]
        : []),
      {
        label: 'Role',
        view: (
          <FormGroup
            inputs={[
              {
                type: 'role',
                props: {
                  permissions,
                  roles,
                  id: 'roles',
                  placeHolder: rolePlaceholder,
                  selected: selectedRoles,
                  disabled: !isEditable || isAccountOwner,
                  error: errors['roles']?.message,
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    if (
                      [
                        RoleIdByName.ACCOUNT_OWNER,
                        RoleIdByName.SYSTEM_ADMIN,
                      ].includes(e.target.value as RoleIdByName)
                    ) {
                      setValue('facilities', [{ id: '-1' }], {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                    } else {
                      setValue('facilities', undefined, {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                    }
                    setValue('roles', e.target.value, {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  },
                },
              },
            ]}
          />
        ),
      },
      {
        label: 'Facility',
        view: (
          <>
            {shouldShowAllFacilities && (
              <div style={{ padding: '24px 16px' }}>
                The user with the selected role has access to all the
                facilities. Facility selection is disabled for such users.
              </div>
            )}
            <FormGroup
              inputs={[
                {
                  type: 'checkbox',
                  props: {
                    id: 'facilities',
                    isMulti: true,
                    options: shouldShowAllFacilities
                      ? [{ label: 'All Facilities', value: '-1' }]
                      : facilities.map((i) => ({
                          label: i.name,
                          value: i.id,
                        })),
                    placeholder: shouldShowAllFacilities
                      ? 'All Facilities'
                      : 'Select',
                    defaultValue: selectedUser?.facilities?.map((f) => ({
                      label: f.name,
                      value: f.id,
                    })),
                    onChange: onFacilityChange,
                    isDisabled: !isEditable || shouldShowAllFacilities,
                    ...(shouldShowAllFacilities
                      ? { value: { label: 'All Facilities', value: '-1' } }
                      : facilitiesValues === undefined
                      ? { value: [] }
                      : {}),
                  },
                },
              ]}
            />
          </>
        ),
      },
    ],
  };

  if (pageType === PAGE_TYPE.ADD) {
    config.title = translate('userManagement:add-title');
    config.items = [
      ...config.items.slice(0, 2),
      ...config.items.slice(
        selectedUser?.state === UserStates.REGISTERED ? 3 : 2,
        config.items.length,
      ),
    ];
  }

  if (pageType === PAGE_TYPE.PROFILE) {
    config.title = translate('userManagement:profile-title');
    config.items = [
      ...config.items.slice(0, 2),
      {
        label: 'Login Credentials',
        view: (
          <Credentials>
            <div className="row">
              <span className="custom-span">Password</span>
              {!toggles?.[Toggleables.EDIT_PASSWORD] ? (
                <>
                  <span className="custom-span">••••••</span>
                  <span className="custom-span">
                    <Button1
                      variant="textOnly"
                      className="with-icon"
                      onClick={() =>
                        dispatch(
                          openOverlayAction({
                            type: OverlayNames.VALIDATE_CREDENTIALS_MODAL,
                            props: {
                              purpose:
                                ValidateCredentialsPurpose.PASSWORD_UPDATE,
                              onSuccess: (token: string) => {
                                setValidatedToken?.(token);
                                updateToggles?.(Toggleables.EDIT_PASSWORD);
                              },
                            },
                          }),
                        )
                      }
                    >
                      Edit <Create />
                    </Button1>
                  </span>
                </>
              ) : (
                <UpdatePassword
                  updateToggles={updateToggles}
                  token={validatedToken as string}
                />
              )}
            </div>
            <div className="row">
              <span className="custom-span">Challenge Question</span>
              {!toggles?.[Toggleables.EDIT_QUESTIONS] ? (
                <>
                  <span className="custom-span">
                    {selectedUser?.challengeQuestion?.question || 'Not Set'}
                  </span>
                  <span className="custom-span">
                    <Button1
                      variant="textOnly"
                      className="with-icon"
                      onClick={() =>
                        dispatch(
                          openOverlayAction({
                            type: OverlayNames.VALIDATE_CREDENTIALS_MODAL,
                            props: {
                              purpose:
                                ValidateCredentialsPurpose.CHALLENGE_QUESTION_UPDATE,
                              onSuccess: (token: string) => {
                                setValidatedToken?.(token);
                                updateToggles?.(Toggleables.EDIT_QUESTIONS);
                              },
                            },
                          }),
                        )
                      }
                    >
                      {selectedUser?.challengeQuestion?.question
                        ? 'Edit '
                        : 'Set Now '}
                      <Create />
                    </Button1>
                  </span>
                </>
              ) : (
                <UpdateChallengeQuestion
                  updateToggles={updateToggles}
                  token={validatedToken as string}
                />
              )}
            </div>
          </Credentials>
        ),
      },
      ...config.items.slice(
        selectedUser?.state === UserStates.REGISTERED ? 3 : 2,
        config.items.length,
      ),
    ];
  }

  return config;
};

type Option = {
  value: string;
  label: string;
};

const UpdateChallengeQuestion = ({
  updateToggles,
  token,
}: Pick<CreateSectionConfigProps, 'updateToggles'> & { token: string }) => {
  const dispatch = useDispatch();
  const { userId } = useTypedSelector((state) => state.auth);
  const { selectedUser } = useTypedSelector((state) => state.users);
  const [state, setState] = useState<{
    answer?: string;
    questions?: Option[];
    selected?: Option;
  }>();

  useEffect(() => {
    const fetchQuestions = async () => {
      const { data }: ResponseObj<ChallengeQuestion[]> = await request(
        'GET',
        apiGetAllChallengeQuestions(),
      );

      const questions = data.map(({ question, id }) => ({
        value: id,
        label: question,
      }));

      setState({
        ...state,
        questions,
        selected: selectedUser?.challengeQuestion
          ? {
              value: selectedUser?.challengeQuestion.id,
              label: selectedUser?.challengeQuestion.question,
            }
          : questions?.[0],
      });
    };

    fetchQuestions();
  }, []);

  const onUpdate = async () => {
    if (userId && selectedUser && state?.selected) {
      await request('PATCH', apiUpdateChallengeQuestions(userId), {
        data: {
          id: state?.selected?.value,
          answer: state?.answer,
          token,
        },
      });

      dispatch(
        showNotification({
          type: NotificationType.SUCCESS,
          msg: 'Challenge Question Updated.',
        }),
      );

      dispatch(
        fetchSelectedUserSuccess({
          data: {
            ...selectedUser,
            challengeQuestion: {
              id: state?.selected?.value,
              question: state?.selected?.label,
            },
          },
        }),
      );

      updateToggles?.(Toggleables.EDIT_QUESTIONS);
    }
  };

  return (
    <CustomInputGroup>
      <FormGroup
        inputs={[
          {
            type: 'checkbox',
            props: {
              id: 'challengeQuestion',
              options: state?.questions,
              placeholder: 'Challenge Question',
              label: 'Challenge Question',
              value: state?.selected,
              onChange: (value: Option) => {
                setState({
                  ...state,
                  selected: value,
                });
              },
            },
          },
          {
            type: 'text',
            props: {
              placeholder: 'Enter Your Answer',
              label: 'Your Answer',
              id: 'challengeAnswer',
              name: 'challengeAnswer',
              onChange: ({ value }: { value: string }) => {
                setState({
                  ...state,
                  answer: value,
                });
              },
            },
          },
        ]}
      />
      <div className="actions-bar" style={{ paddingLeft: '16px' }}>
        <Button1
          color="dark"
          onClick={() => updateToggles?.(Toggleables.EDIT_QUESTIONS)}
        >
          Cancel
        </Button1>
        <Button1
          disabled={!state?.selected || !state.answer}
          onClick={onUpdate}
        >
          Update
        </Button1>
      </div>
    </CustomInputGroup>
  );
};

const UpdatePassword = ({
  updateToggles,
  token,
}: Pick<CreateSectionConfigProps, 'updateToggles'> & { token: string }) => {
  const dispatch = useDispatch();
  const { userId } = useTypedSelector((state) => state.auth);
  const [state, setState] = useState<{
    password: string;
    confirmPassword: string;
    errors: {
      password?: string[];
      confirmPassword?: string[];
    };
  }>({
    password: '',
    confirmPassword: '',
    errors: {
      password: ['smallLength', 'caseCheck', 'digitLetter', 'specialChar'],
      confirmPassword: ['passwordMatch'],
    },
  });

  const validators: {
    password: ValidatorProps;
    confirmPassword: ValidatorProps;
  } = {
    password: {
      functions: {
        smallLength: (value: string) => value.length > 7,
        caseCheck: (value: string) => /^(?=.*[a-z])(?=.*[A-Z])/.test(value),
        digitLetter: (value: string) => /[0-9]/.test(value),
        specialChar: (value: string) => /.*[!@#$%^&*() =+_-]/.test(value),
      },
      messages: {
        smallLength: '8 characters minimum',
        caseCheck: 'Upper and lowercase letters',
        digitLetter: 'At least one number',
        specialChar: 'At least one special character',
      },
    },
    confirmPassword: {
      functions: {
        passwordMatch: (value: string) =>
          state?.errors?.password?.length || value !== state?.password
            ? false
            : true,
      },
      messages: {
        passwordMatch: 'Password Match',
      },
    },
  };

  const onInputChange = (
    value: string,
    name: 'password' | 'confirmPassword',
  ) => {
    const errors: string[] = [];
    Object.keys(validators[name].functions).forEach((key) => {
      if (!validators[name].functions[key](value)) errors.push(key);
    });

    let passwordMatchError = {};
    if (name === 'password' && value !== state.confirmPassword) {
      passwordMatchError = {
        confirmPassword: ['passwordMatch'],
      };
    } else {
      passwordMatchError = {
        confirmPassword: [],
      };
    }

    setState({
      ...state,
      [name]: value,
      errors: {
        ...state.errors,
        ...passwordMatchError,
        [name]: errors,
      },
    });
  };

  const onUpdate = async () => {
    if (userId) {
      const { password, confirmPassword } = state;
      const { errors }: ResponseObj<unknown> = await request(
        'PATCH',
        apiUpdatePassword(userId),
        {
          data: {
            password: encrypt(password),
            confirmPassword: encrypt(confirmPassword),
            token,
          },
        },
      );

      if (errors) {
        const error = getErrorMsg(errors);
        dispatch(
          showNotification({
            type: NotificationType.ERROR,
            msg: error,
          }),
        );
      } else {
        dispatch(
          showNotification({
            type: NotificationType.SUCCESS,
            msg: 'Password updated successfully.',
          }),
        );

        updateToggles?.(Toggleables.EDIT_PASSWORD);
      }
    }
  };

  return (
    <CustomInputGroup>
      <FormGroup
        inputs={[
          {
            type: 'password',
            props: {
              placeholder: 'Create Password',
              label: 'Create Password',
              id: 'password',
              name: 'password',
              onChange: ({ value }: { value: string }) => {
                onInputChange(value, 'password');
              },
            },
          },
          {
            type: 'error-container',
            props: {
              messages: validators.password.messages,
              errorsTypes: state?.errors?.password,
            },
          },
          {
            type: 'password',
            props: {
              placeholder: 'Confirm New Password',
              label: 'Confirm New Password',
              id: 'confirmPassword',
              name: 'confirmPassword',
              onChange: ({ value }: { value: string }) => {
                onInputChange(value, 'confirmPassword');
              },
            },
          },
          {
            type: 'error-container',
            props: {
              messages: validators.confirmPassword.messages,
              errorsTypes: state?.errors?.confirmPassword,
            },
          },
        ]}
      />
      <div className="actions-bar">
        <Button1
          color="dark"
          onClick={() => updateToggles?.(Toggleables.EDIT_PASSWORD)}
        >
          Cancel
        </Button1>
        <Button1
          onClick={onUpdate}
          disabled={
            state?.errors?.confirmPassword?.length ||
            state?.errors?.password?.length
              ? true
              : false
          }
        >
          Update
        </Button1>
      </div>
    </CustomInputGroup>
  );
};
