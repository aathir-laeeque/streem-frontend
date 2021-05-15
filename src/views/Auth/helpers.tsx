/* eslint-disable @typescript-eslint/ban-ts-comment */
import LoginBackground from '#assets/svg/LoginBackground.svg';
import RegisterBackground from '#assets/svg/RegisterBackground.svg';
import { Button1 } from '#components';
import { Option } from '#components/shared/Select';
import { useTypedSelector } from '#store';
import { switchFacility } from '#store/facilities/actions';
import { apiCheckUsername } from '#utils/apiUrls';
import { request } from '#utils/request';
import { encrypt } from '#utils/stringUtils';
import {
  additionalVerification,
  checkTokenExpiry,
  login,
  notifyAdmin,
  register as registerAction,
  resetPassword,
  resetToken,
  setChallengeQuestion,
  validateIdentity,
  validateQuestion,
} from '#views/Auth/actions';
import {
  ArrowBack,
  CheckCircle,
  LockOutlined,
  VisibilityOutlined,
  VpnKeyOutlined,
} from '@material-ui/icons';
import { Link, navigate } from '@reach/router';
import { keys } from 'lodash';
import React, { useState } from 'react';
import { UseFormMethods } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import {
  AdditionalVerificationTypes,
  BaseViewConfigType,
  CARD_POSITIONS,
  ChallengeQuestionPurpose,
  CredentialsInputs,
  EmployeeIdInputs,
  ForgotPasswordInputs,
  ForgotPasswordRecoveryInputs,
  LoginInputs,
  NewPasswordInputs,
  PAGE_NAMES,
  RecoveryInputs,
  RecoveryOptions,
  SecretKeyInputs,
  TokenTypes,
} from './types';

type CreateBaseViewConfigProps = {
  pageName: PAGE_NAMES;
  loading: boolean;
  register: UseFormMethods['register'];
  formState: UseFormMethods['formState'];
  getValues: UseFormMethods['getValues'];
  setValue: UseFormMethods['setValue'];
  setError: UseFormMethods['setError'];
  clearErrors: UseFormMethods['clearErrors'];
  questions: Option[] | undefined;
};

const LockIcon = () => (
  <div
    style={{
      display: 'flex',
      padding: '12px',
      fontSize: '18px',
      backgroundColor: '#dadada',
      borderRadius: '50%',
    }}
  >
    <LockOutlined />
  </div>
);

const leftCardConfig: BaseViewConfigType = {
  wrapperStyle: {
    background: `url(${LoginBackground}) no-repeat center center fixed`,
    backgroundSize: 'cover',
  },
  cardPosition: CARD_POSITIONS.LEFT,
  cardStyle: {
    backgroundColor: 'transparent',
  },
};

const centerCardConfig: BaseViewConfigType = {
  wrapperStyle: {
    background: `url(${RegisterBackground}) no-repeat center center fixed`,
    backgroundSize: 'cover',
  },
  cardPosition: CARD_POSITIONS.CENTER,
  cardStyle: {
    backgroundColor: '#FFF',
    borderRadius: '8px',
    boxShadow:
      '0 0 1px 0 rgba(0, 0, 0, 0.04), 0 2px 6px 0 rgba(0, 0, 0, 0.04), 0 16px 24px 0 rgba(0, 0, 0, 0.06)',
  },
};

const ContactAdminButton = styled(Button1)`
  display: inline-block;
  padding: 0;
  margin-right: 4px !important;
  font-size: inherit;
`;

export const createBaseViewConfig = ({
  pageName,
  loading,
  register,
  formState,
  getValues,
  setValue,
  setError,
  clearErrors,
  questions,
}: CreateBaseViewConfigProps) => {
  const dispatch = useDispatch();
  const {
    firstName,
    lastName,
    employeeId,
    token,
    email,
    hasSetChallengeQuestion,
    facilities,
    userId,
  } = useTypedSelector((state) => state.auth);
  const [passwordInputType, setPasswordInputType] = useState(true);

  const AfterIcon = () => (
    <VisibilityOutlined
      onClick={() => setPasswordInputType(!passwordInputType)}
      style={{ color: passwordInputType ? '#999' : '#1d84ff' }}
    />
  );

  if (
    [
      PAGE_NAMES.REGISTER_CREDENTIALS,
      PAGE_NAMES.REGISTER_EMPLOYEE_ID,
      PAGE_NAMES.REGISTER_RECOVERY,
      PAGE_NAMES.FORGOT_RECOVERY,
      PAGE_NAMES.FORGOT_QUESTIONS,
      PAGE_NAMES.FORGOT_NEW_PASSWORD,
      PAGE_NAMES.INVITATION_EXPIRED,
      PAGE_NAMES.KEY_EXPIRED,
      PAGE_NAMES.ACCOUNT_LOCKED,
    ].includes(pageName) &&
    !token
  ) {
    navigate('/auth/login');
  }

  const passwordValidators = (password: string) => ({
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
        digitLetter: 'At lest one number',
        specialChar: 'At lest one special character',
      },
    },
    confirmPassword: {
      functions: {
        passwordMatch: (value: string) =>
          formState?.errors?.password?.length || value !== password
            ? false
            : true,
      },
      messages: {
        passwordMatch: 'Password Match',
      },
    },
  });

  const reverseValidationCheckOnPasswords = (confirmPassword: string) => ({
    passwordMatch: (value: string) => {
      if (confirmPassword) {
        if (value !== confirmPassword) {
          setError('confirmPassword', {
            type: 'passwordMatch',
            message: '',
          });
        } else {
          clearErrors('confirmPassword');
        }
      }
      return true;
    },
  });

  switch (pageName) {
    case PAGE_NAMES.LOGIN:
      return {
        ...leftCardConfig,
        heading: 'Welcome User',
        subHeading: 'Provide your credentials below to login',
        formData: {
          formInputs: [
            {
              type: 'text',
              props: {
                placeholder: 'Write your Username or Email ID here',
                label: 'Username or Email ID',
                id: 'username',
                name: 'username',
                ref: register({
                  required: true,
                }),
              },
            },
            {
              type: passwordInputType ? 'password' : 'text',
              props: {
                placeholder: 'Enter your Password',
                label: 'Password',
                id: 'password',
                name: 'password',
                ref: register({
                  required: true,
                }),
                AfterElement: AfterIcon,
                afterElementWithoutError: true,
                secondaryAction: {
                  text: 'Forgot Password?',
                  action: () => {
                    navigate('/auth/forgot-password');
                  },
                },
              },
            },
          ],
          onSubmit: (data: LoginInputs) => {
            dispatch(login(data));
          },
          buttons: [
            <Button1
              key="login"
              type="submit"
              disabled={loading || !formState.isDirty || !formState.isValid}
            >
              Login
            </Button1>,
          ],
        },
        footerAction: (
          <div>
            New User ? <Link to="/auth/register">Register Yourself</Link>
          </div>
        ),
      };

    case PAGE_NAMES.FORGOT_IDENTITY:
      return {
        ...centerCardConfig,
        heading: 'Forgot Password',
        subHeading:
          'Use your Credentials to see your Recovery Options or click the option below if you already have a Secrete Key.',
        formData: {
          formInputs: [
            {
              type: 'text',
              props: {
                placeholder: 'Write your Username or Email ID here',
                label: 'Username or Email ID',
                id: 'identity',
                name: 'identity',
                ref: register({
                  required: true,
                }),
              },
            },
          ],
          onSubmit: (data: ForgotPasswordInputs) => {
            dispatch(validateIdentity(data));
          },
          buttons: [
            <Button1
              key="forgot"
              type="submit"
              disabled={loading || !formState.isDirty || !formState.isValid}
              style={{ marginLeft: 'auto' }}
            >
              Show Recovery Options
            </Button1>,
          ],
        },
        footerAction: (
          <div>
            <div>
              Already have a Secret Key?{' '}
              <Link to="/auth/forgot-password/secret-key">Click here</Link>
            </div>
            <div style={{ marginTop: 20 }}>
              Go back to <Link to="/auth/login">Login Page</Link>
            </div>
          </div>
        ),
      };

    case PAGE_NAMES.FORGOT_RECOVERY: {
      register('recoveryOption', { required: true });

      const items = [];

      if (email) {
        items.push({
          key: RecoveryOptions.EMAIL,
          label: 'Get an email',
          value: RecoveryOptions.EMAIL,
          desc: `You will receive recovery instructions to your registered email '${email}'.`,
        });
      }

      if (hasSetChallengeQuestion) {
        items.push({
          key: RecoveryOptions.CHALLENGE_QUESTION,
          label: 'Answer a Challenge Question',
          value: RecoveryOptions.CHALLENGE_QUESTION,
          desc: 'Answer to a Challenge Question that you have set.',
        });
      } else {
        items.push({
          key: RecoveryOptions.CHALLENGE_QUESTION,
          label: 'Challange Question not set',
          value: RecoveryOptions.CHALLENGE_QUESTION,
          disabled: true,
          desc: 'You have not set challange question',
        });
      }

      if (!email && !hasSetChallengeQuestion) {
        items.push({
          key: RecoveryOptions.CONTACT_ADMIN,
          label: 'Contact Administrator',
          value: RecoveryOptions.CONTACT_ADMIN,
          desc:
            'Send a request to your administrator to resest password for your account.',
        });
      }

      return {
        ...centerCardConfig,
        heading: 'Recovery Options',
        subHeading: 'Select how you want to recover your password.',
        formData: {
          formInputs: [
            {
              type: 'radio',
              props: {
                groupProps: {
                  id: 'recoveryOption',
                  name: 'recoveryOption',
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    setValue('recoveryOption', e.target.value, {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  },
                },
                items,
              },
            },
          ],
          onSubmit: (data: ForgotPasswordRecoveryInputs) => {
            if (token) {
              if (data.recoveryOption === RecoveryOptions.EMAIL) {
                dispatch(
                  resetToken({
                    token,
                  }),
                );
              } else if (
                data.recoveryOption === RecoveryOptions.CHALLENGE_QUESTION
              ) {
                navigate('/auth/forgot-password/challenge');
              } else if (
                data.recoveryOption === RecoveryOptions.CONTACT_ADMIN
              ) {
                dispatch(
                  notifyAdmin({
                    token,
                    purpose:
                      ChallengeQuestionPurpose.PASSWORD_RECOVERY_CHALLENGE_QUESTION_NOT_SET,
                  }),
                );
              }
            }
          },
          buttons: [
            <Button1
              key="forgot"
              type="submit"
              disabled={loading || !formState.isDirty || !formState.isValid}
              style={{ marginLeft: 'auto' }}
            >
              Continue
            </Button1>,
          ],
        },
        footerAction: (
          <div>
            <div>
              Go back to <Link to="/auth/login">Login Page</Link>
            </div>
          </div>
        ),
      };
    }

    case PAGE_NAMES.FORGOT_QUESTIONS: {
      register('id', { required: true });

      return {
        ...centerCardConfig,
        heading: 'Challenge Question',
        subHeading:
          'Select your Challenge Question and provide correct answer to it to set your new password.',
        formData: {
          formInputs: [
            {
              type: 'checkbox',
              props: {
                id: 'question',
                name: 'question',
                options: questions,
                placeholder: 'Select your challange question',
                label: 'Challange Question',
                onChange: (option: Option | null) => {
                  if (!option) {
                    setValue('id', undefined as any, {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  } else {
                    setValue('id', option.value as any, {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  }
                },
              },
            },
            {
              type: 'text',
              props: {
                placeholder: 'Write your Answer here',
                label: 'Enter Your Answer',
                id: 'answer',
                name: 'answer',
                ref: register({
                  required: true,
                }),
              },
            },
          ],
          onSubmit: (data: RecoveryInputs) => {
            if (token) {
              dispatch(
                validateQuestion({
                  ...data,
                  token,
                }),
              );
            }
          },
          buttons: [
            <Button1
              key="forgot"
              type="submit"
              disabled={loading || !formState.isDirty || !formState.isValid}
              style={{ marginLeft: 'auto' }}
            >
              Verify Answer
            </Button1>,
          ],
        },
        footerAction: (
          <div>
            <Link
              to="/auth/forgot-password/recovery"
              style={{
                color: '#1c1c1c',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <ArrowBack style={{ marginRight: '16px' }} /> Recovery Options
            </Link>
          </div>
        ),
      };
    }

    case PAGE_NAMES.REGISTER_SECRET_KEY:
    case PAGE_NAMES.FORGOT_SECRET_KEY:
      return {
        ...centerCardConfig,
        heading: 'Identify Yourself',
        subHeading: 'Provide your Secret Key to identify yourself',
        formData: {
          formInputs: [
            {
              type: 'text',
              props: {
                placeholder: 'Enter your Secrete Key here',
                label: 'Secrete Key',
                id: 'token',
                name: 'token',
                ref: register({
                  required: true,
                }),
              },
            },
          ],
          onSubmit: (data: SecretKeyInputs) => {
            dispatch(
              checkTokenExpiry({
                ...data,
                type:
                  pageName === PAGE_NAMES.REGISTER_SECRET_KEY
                    ? TokenTypes.REGISTRATION
                    : TokenTypes.PASSWORD_RESET,
              }),
            );
          },
          buttons: [
            <Button1
              key="forgot"
              type="submit"
              disabled={loading || !formState.isDirty || !formState.isValid}
              style={{ marginLeft: 'auto' }}
            >
              {pageName === PAGE_NAMES.REGISTER_SECRET_KEY
                ? 'Identify me'
                : 'Verify'}
            </Button1>,
          ],
        },
        footerAction:
          pageName === PAGE_NAMES.REGISTER_SECRET_KEY ? (
            <div>
              Already Registered?{' '}
              <Link to="/auth/login">Login to your Account</Link>
            </div>
          ) : (
            <div>
              Go back to <Link to="/auth/login">Login Page</Link>
            </div>
          ),
      };
    case PAGE_NAMES.ADMIN_NOTIFIED:
      return {
        ...centerCardConfig,
        footerAction: (
          <div>
            <div
              style={{
                margin: '0px 0px 64px',
                display: 'flex',
                alignItems: 'center',
                fontSize: '14px',
                lineHeight: '16px',
                letterSpacing: '0.16px',
                color: '#333333',
                fontWeight: 'bold',
              }}
            >
              <CheckCircle
                style={{
                  color: '#5AA700',
                  fontSize: '34px',
                  marginRight: '16px',
                }}
              />
              Notification is sent. <br /> Administrator will contact you soon.
            </div>
            Go back to <Link to="/auth/login">Login Page</Link>
          </div>
        ),
      };
    case PAGE_NAMES.FORGOT_EMAIL_SENT:
      return {
        ...centerCardConfig,
        footerAction: (
          <div>
            <div
              style={{
                margin: '24px 0px 64px',
                display: 'flex',
                alignItems: 'center',
                fontSize: '14px',
                lineHeight: '16px',
                letterSpacing: '0.16px',
                color: '#333333',
                fontWeight: 'bold',
              }}
            >
              <CheckCircle
                style={{
                  color: '#5AA700',
                  fontSize: '34px',
                  marginRight: '16px',
                }}
              />
              We’ve sent an email to {email} <br />
              to reset your password.
            </div>
            Go back to <Link to="/auth/login">Login Page</Link>
          </div>
        ),
      };
    case PAGE_NAMES.PASSWORD_UPDATED:
      return {
        ...centerCardConfig,
        footerAction: (
          <div>
            <div
              style={{
                margin: '24px 0px 64px',
                display: 'flex',
                alignItems: 'center',
                fontSize: '14px',
                lineHeight: '16px',
                letterSpacing: '0.16px',
                color: '#333333',
                fontWeight: 'bold',
              }}
            >
              <CheckCircle
                style={{
                  color: '#5AA700',
                  fontSize: '34px',
                  marginRight: '16px',
                }}
              />
              You have successfully set your new password.
            </div>
            Go back to <Link to="/auth/login">Login Page</Link>
          </div>
        ),
      };
    case PAGE_NAMES.FORGOT_NEW_PASSWORD: {
      const { password, confirmPassword } = getValues([
        'password',
        'confirmPassword',
      ]);
      const validators = passwordValidators(password);

      return {
        ...centerCardConfig,
        heading: 'Set New Password',
        formData: {
          formInputs: [
            {
              type: 'password',
              props: {
                placeholder: 'Enter your new Password',
                label: 'New Password',
                id: 'password',
                name: 'password',
                ref: register({
                  required: true,
                  validate: {
                    ...validators.password.functions,
                    ...reverseValidationCheckOnPasswords(confirmPassword),
                  },
                }),
              },
            },
            {
              type: 'error-container',
              props: {
                messages: validators.password.messages,
                errorsTypes: keys(formState?.errors?.password?.types) || [],
              },
            },
            {
              type: 'password',
              props: {
                placeholder: 'Enter your new Password',
                label: 'Confirm Password',
                id: 'confirmPassword',
                name: 'confirmPassword',
                ref: register({
                  required: true,
                  validate: validators.confirmPassword.functions,
                }),
              },
            },
            {
              type: 'error-container',
              props: {
                messages: validators.confirmPassword.messages,
                errorsTypes:
                  keys({
                    [formState?.errors?.confirmPassword?.type]: true,
                    ...formState?.errors?.confirmPassword?.types,
                  }) || [],
              },
            },
          ],
          onSubmit: (data: NewPasswordInputs) => {
            if (token) {
              dispatch(
                resetPassword({
                  password: encrypt(data.password),
                  confirmPassword: encrypt(data.confirmPassword),
                  token,
                }),
              );
            }
          },
          buttons: [
            <Button1
              key="forgot"
              type="submit"
              disabled={
                loading ||
                !formState.isDirty ||
                !formState.isValid ||
                password !== confirmPassword
              }
              style={{ marginLeft: 'auto' }}
            >
              Set Password
            </Button1>,
          ],
        },
      };
    }
    case PAGE_NAMES.REGISTER_EMPLOYEE_ID:
      return {
        ...centerCardConfig,
        heading: 'Nearly Done...',
        subHeading: 'Provide your Employee ID to verify yourself',
        formData: {
          formInputs: [
            {
              type: 'text',
              props: {
                placeholder: 'Enter your Employee ID',
                label: 'Employee ID',
                id: 'identifier',
                name: 'identifier',
                ref: register({
                  required: true,
                }),
              },
            },
          ],
          onSubmit: (data: EmployeeIdInputs) => {
            if (token) {
              dispatch(
                additionalVerification({
                  identifier: data.identifier,
                  type: AdditionalVerificationTypes.EMPLOYEE_ID,
                  token,
                }),
              );
            }
          },
          buttons: [
            <Button1
              key="forgot"
              type="submit"
              disabled={loading || !formState.isDirty || !formState.isValid}
              style={{ marginLeft: 'auto' }}
            >
              Verify
            </Button1>,
          ],
        },
      };
    case PAGE_NAMES.REGISTER_CREDENTIALS: {
      const { password, confirmPassword } = getValues([
        'password',
        'confirmPassword',
      ]);
      const validators = passwordValidators(password);

      return {
        ...centerCardConfig,
        heading: 'Create User Name & Password',
        formData: {
          formInputs: [
            {
              type: 'text',
              props: {
                placeholder: 'Full Name (Not Editable)',
                label: 'Full Name (Not Editable)',
                disabled: true,
                value: `${firstName} ${lastName}`,
                id: 'fullName',
                name: 'fullName',
              },
            },
            {
              type: 'text',
              props: {
                placeholder: 'Employee ID (Not Editable)',
                label: 'Employee ID (Not Editable)',
                disabled: true,
                value: employeeId,
                id: 'employeeId',
                name: 'employeeId',
              },
            },
            {
              type: 'text',
              props: {
                placeholder: 'Create Username',
                label: 'Create Username',
                id: 'username',
                name: 'username',
                error: formState.errors['username']?.message,
                ref: register({
                  required: true,
                  maxLength: {
                    value: 45,
                    message: "Shouldn't be greater than 45 characters.",
                  },
                  pattern: {
                    value: /^[a-z0-9][a-z0-9._]+$/i,
                    message: 'Invalid Username',
                  },
                  validate: async (value) => {
                    if (!value) return 'Invalid Username';
                    const res = await request('POST', apiCheckUsername(), {
                      data: {
                        username: value.toLowerCase(),
                      },
                    });
                    if (res?.errors?.length)
                      return (
                        res?.errors?.[0]?.message || 'Username Already Taken'
                      );
                    return true;
                  },
                }),
              },
            },
            {
              type: 'password',
              props: {
                placeholder: 'Enter your new Password',
                label: 'Create Password',
                id: 'password',
                name: 'password',
                ref: register({
                  required: true,
                  validate: {
                    ...validators.password.functions,
                    ...reverseValidationCheckOnPasswords(confirmPassword),
                  },
                }),
              },
            },
            {
              type: 'error-container',
              props: {
                messages: validators.password.messages,
                errorsTypes: keys(formState?.errors?.password?.types) || [],
              },
            },
            {
              type: 'password',
              props: {
                placeholder: 'Enter your new Password',
                label: 'Confirm Password',
                id: 'confirmPassword',
                name: 'confirmPassword',
                ref: register({
                  required: true,
                  validate: validators.confirmPassword.functions,
                }),
              },
            },
            {
              type: 'error-container',
              props: {
                messages: validators.confirmPassword.messages,
                errorsTypes:
                  keys({
                    [formState?.errors?.confirmPassword?.type]: true,
                    ...formState?.errors?.confirmPassword?.types,
                  }) || [],
              },
            },
          ],
          onSubmit: (data: CredentialsInputs) => {
            if (token) {
              dispatch(
                registerAction({
                  username: data.username,
                  password: encrypt(data.password),
                  confirmPassword: encrypt(data.confirmPassword),
                  token,
                }),
              );
            }
          },
          buttons: [
            <Button1
              key="forgot"
              type="submit"
              disabled={loading || !formState.isDirty || !formState.isValid}
              style={{ marginLeft: 'auto' }}
            >
              Register
            </Button1>,
          ],
        },
      };
    }
    case PAGE_NAMES.REGISTER_RECOVERY: {
      register('id', { required: true });

      return {
        ...centerCardConfig,
        heading: 'Recovery Option',
        formData: {
          formInputs: [
            {
              type: 'checkbox',
              props: {
                id: 'question',
                name: 'question',
                options: questions,
                placeholder: 'Select a Question',
                label: 'Select a Challange Question',
                onChange: (option: Option | null) => {
                  if (!option) {
                    setValue('id', undefined as any, {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  } else {
                    setValue('id', option.value as any, {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  }
                },
              },
            },
            {
              type: 'text',
              props: {
                placeholder: 'Write your Answer here',
                label: 'Enter Your Answer',
                id: 'answer',
                name: 'answer',
                ref: register({
                  required: true,
                }),
              },
            },
          ],
          onSubmit: (data: RecoveryInputs) => {
            if (token) {
              dispatch(
                setChallengeQuestion({
                  ...data,
                  token,
                }),
              );
            }
          },
          buttons: [
            <Button1
              key="forgot"
              type="submit"
              disabled={loading || !formState.isDirty || !formState.isValid}
              style={{ marginLeft: 'auto' }}
            >
              Continue
            </Button1>,
          ],
        },
      };
    }
    case PAGE_NAMES.KEY_EXPIRED:
      return {
        ...centerCardConfig,
        heading: 'Key Expired',
        headingIcon: <LockIcon />,
        subHeading:
          'Your secrete key has expired as you failed to use it under 24 hours.',
        footerAction: (
          <div>
            <ContactAdminButton
              variant="textOnly"
              onClick={() => {
                dispatch(
                  notifyAdmin({
                    token,
                    purpose:
                      ChallengeQuestionPurpose.PASSWORD_RECOVERY_KEY_EXPIRED,
                  }),
                );
              }}
            >
              Contact
            </ContactAdminButton>
            your Administrator to generate a new Secrete Key for your
            registration.
          </div>
        ),
      };
    case PAGE_NAMES.ACCOUNT_LOCKED:
      return {
        ...centerCardConfig,
        heading: 'Account Locked',
        headingIcon: <LockIcon />,
        subHeading:
          'Access to to your account has been locked due to 3 failed attempts.',
        footerAction: (
          <div>
            <ContactAdminButton
              variant="textOnly"
              onClick={() => {
                dispatch(
                  notifyAdmin({
                    token,
                    purpose:
                      ChallengeQuestionPurpose.PASSWORD_RECOVERY_ACCOUNT_LOCKED,
                  }),
                );
              }}
            >
              Contact
            </ContactAdminButton>
            your Administrator to unlock registration.
            <div style={{ marginTop: 64 }}>
              Go back to <Link to="/auth/login">Login Page</Link>
            </div>
          </div>
        ),
      };
    case PAGE_NAMES.INVITATION_EXPIRED:
      return {
        ...centerCardConfig,
        heading: 'Invitation Expired',
        headingIcon: <LockIcon />,
        subHeading: 'Your invitation expired as you failed to verify yourself.',
        footerAction: (
          <div>
            <ContactAdminButton
              variant="textOnly"
              onClick={() => {
                dispatch(
                  notifyAdmin({
                    token,
                    purpose: ChallengeQuestionPurpose.INVITE_EXPIRED,
                  }),
                );
              }}
            >
              Contact
            </ContactAdminButton>
            your Administrator to unlock registration.
          </div>
        ),
      };
    case PAGE_NAMES.PASSWORD_EXPIRED:
      return {
        ...leftCardConfig,
        heading: 'Password Expired',
        headingIcon: (
          <div
            style={{
              display: 'flex',
              padding: '12px',
              fontSize: '18px',
              backgroundColor: '#dadada',
              borderRadius: '50%',
            }}
          >
            <VpnKeyOutlined />
          </div>
        ),
        footerAction: (
          <div style={{ marginTop: '-3vh' }}>
            <div
              style={{
                fontWeight: 600,
                color: '#333333',
                marginBottom: '4vh',
                fontSize: '1.6vh',
                lineHeight: '2vh',
                letterSpacing: '0.16px',
              }}
            >
              {`You're unable to login as your password has expired. Please set a
              new password for your Account.`}
            </div>
            <Button1
              key="forgot"
              style={{ marginRight: 'auto' }}
              onClick={() => navigate('/auth/forgot-password')}
            >
              Set a New Password
            </Button1>
          </div>
        ),
      };
    case PAGE_NAMES.FACILITY_SELECTION: {
      register('id', { required: true });

      return {
        wrapperStyle: {
          background: 'none',
          backgroundSize: 'cover',
        },
        cardPosition: CARD_POSITIONS.CENTER,
        cardStyle: {
          backgroundColor: '#FFF',
          borderRadius: '8px',
          boxShadow:
            '0 0 1px 0 rgba(0, 0, 0, 0.04), 0 2px 6px 0 rgba(0, 0, 0, 0.04), 0 16px 24px 0 rgba(0, 0, 0, 0.06)',
          maxWidth: '30vw',
        },
        heading: 'Choose Facility',
        subHeading:
          'Select a facility to login to from the list of facilities give below.',
        formData: {
          formInputs: [
            {
              type: 'checkbox',
              props: {
                id: 'facility',
                name: 'facility',
                options: facilities.map((facility) => ({
                  label: facility.name,
                  value: facility.id,
                })),
                placeholder: 'Select a Facility',
                label: 'Facility',
                onChange: (option: Option | null) => {
                  if (!option) {
                    setValue('id', undefined as any, {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  } else {
                    setValue('id', option.value as any, {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  }
                },
              },
            },
          ],
          onSubmit: (data: { id: string }) => {
            if (userId) {
              dispatch(
                switchFacility({
                  facilityId: data.id,
                  loggedInUserId: userId,
                }),
              );
            }
          },
          buttons: [
            <Button1
              key="forgot"
              type="submit"
              style={{ marginLeft: 'auto' }}
              disabled={loading || !formState.isDirty || !formState.isValid}
            >
              Proceed
            </Button1>,
          ],
        },
      };
    }
    default:
      return leftCardConfig;
  }
};
