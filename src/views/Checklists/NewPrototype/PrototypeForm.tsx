import {
  AddNewItem,
  Avatar,
  Button1,
  Select,
  Textarea,
  TextInput
} from '#components';
import { Option } from '#components/shared/Select';
import { ComposerEntity } from '#PrototypeComposer/types';
import { useProperties } from '#services/properties';
import { defaultParams, OtherUserState, User, useUsers } from '#services/users';
import { useTypedSelector } from '#store/helpers';
import { Error } from '#utils/globalTypes';
import { getFullName } from '#utils/stringUtils';
import { Close, Error as ErrorIcon } from '@material-ui/icons';
import { navigate } from '@reach/router';
import { debounce, isEmpty, pick } from 'lodash';
import React, { FC, FormEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { addNewPrototype, updatePrototype } from './actions';
import { Author, FormErrors, FormMode, FormValues, Props } from './types';

const FormError = styled.div`
  align-items: center;
  color: #eb5757;
  display: flex;
  font-size: 12px;
  justify-content: flex-start;
  margin-top: 5px;
  margin-bottom: 10px;

  form-error-icon {
        font-size: 16px;
        color: #eb5757;
        margin-right: 5px;
  }
`;


const validateForm = (values: FormValues) => {
  const formErrors: FormErrors = { name: '', properties: {} };
  let isValid = true;

  if (!values.name) {
    isValid = false;
    formErrors.name = 'Checklist name is required';
  }

  values.properties.map((property) => {
    if (property.mandatory && !property.value) {
      isValid = false;
      formErrors.properties[property.id.toString()] = 'Property is required';
    }
  });

  return { isValid, formErrors };
};

const PrototypeForm: FC<Props> = (props) => {
  const { formMode, formData } = props;

  const dispatch = useDispatch();

  const { listById } = useProperties(ComposerEntity.CHECKLIST);

  const { users, usersById, loadMore } = useUsers({
    userState: OtherUserState.AUTHORS,
    params: { ...defaultParams(false) },
  });

  const { profile } = useTypedSelector((state) => state.auth);

  /*
    The UI receives createdBy only after making the API call hence when the user clicks on the "Start a Prototype" the owner details are blank. 
    The user creating the Prototype is the owner.
  */
  const [formValues, setFormValues] = useState<FormValues>({
    authors: formData?.authors ?? [],
    description: formData.description ?? '',
    name: formData?.name ?? '',
    createdBy: pick(formData.createdBy ?? profile, [
      'id',
      'employeeId',
      'firstName',
      'lastName',
      'email',
    ]),
    properties: [],
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({
    name: '',
    properties: {},
  });

  useEffect(() => {
    if (!isEmpty(listById)) {
      setFormValues((values) => ({
        ...values,
        properties: Object.values(listById)
          .sort((a, b) => a.orderTree - b.orderTree)
          .map((property) => ({
            id: property.id,
            mandatory: property.mandatory,
            name: property.name,
            placeHolder: property.placeHolder,
            value:
              formData?.properties?.find((el) => el.id === property.id)
                ?.value ?? '',
          })),
      }));
    }
  }, [listById]);

  // TODO Create a single global error handler for apis  
  const getApiFormErrors = (apiFormErrors: Error[]) => {
    const updatedFormErrors = { ...formErrors };
    if(apiFormErrors && apiFormErrors.length) {
      apiFormErrors.forEach((formError)=> {
        if(formError.code === "E124") {
          updatedFormErrors.authors = formError;
        }
      })
      setFormErrors(updatedFormErrors);
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { isValid, formErrors } = validateForm(formValues);

    if (isValid) {
      if (formMode === FormMode.ADD) {
        dispatch(
          addNewPrototype({
            ...formValues,
            authors: formValues.authors.map((author) => author.id),
          }),
        );
      } else if (formMode === FormMode.EDIT) {
        dispatch(
          updatePrototype(
            {
              ...formValues,
              authors: formValues.authors.map((author) => author.id),
            },
            formData?.prototypeId,
            formData?.authors?.map((author) => author.id),
            getApiFormErrors
          ),
        );
      }
    } else {
      setFormErrors(formErrors);
    }
  };

  const handleOnScroll = (e: React.UIEvent<HTMLElement>) => {
    e.stopPropagation();
    const { scrollHeight, scrollTop, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - clientHeight * 0.7)
      loadMore();
  };

  const filterUsers = (users: User[]) => {
    const filteredUsers = users.reduce<Option[]>((acc, user) => {
      if (
        user.id !== formValues.createdBy.id &&
        !formValues.authors.some((author) => author.id === user.id)
      ) {
        acc.push({
          label: `${getFullName(user)}, ID : ${user.employeeId}`,
          value: user.id,
        });
      }
      return acc;
    }, []);

    // This has to be more than 8 as the select component shows 7 items without scroll option & because of that loadMore doesn't gets called. See Method : handleOnScroll
    if (filteredUsers.length < 9) loadMore();

    return filteredUsers;
  };

  if (!users.length || !Object.values(listById).length) {
    return null;
  }

  return (
    <form className="prototype-form" onSubmit={handleSubmit}>
      <h3 className="heading">New Checklist Prototype</h3>

      <div className="left-side">
        {formData.revisedCode && (
          <>
            <div className="input-field">
              <h5 className="label">Checklist Being Revised</h5>
              <h4 className="value">{formData.revisedName}</h4>
            </div>
            <div className="input-field">
              <h5 className="label">Checklist ID</h5>
              <h4 className="value">{formData.revisedCode}</h4>
            </div>
          </>
        )}
        <div className={formData.revisedCode ? 'owner revised' : 'owner'}>
          <h5 className={formData.revisedCode ? 'label-light' : 'label'}>
            {formData.revisedCode ? 'Being Revised by' : 'Checklist Owner'}
          </h5>
          <div className="container">
            <Avatar user={formValues.createdBy} />
            <div className="owner-details">
              <div className="owner-id">{formValues.createdBy.employeeId}</div>
              <div className="owner-name">
                {getFullName(formValues.createdBy)}
              </div>
            </div>
          </div>
        </div>

        <TextInput
          defaultValue={formValues.name}
          error={formErrors.name}
          label="Checklist Name"
          disabled={formMode === FormMode.VIEW}
          name="name"
          onChange={debounce(({ name, value }) => {
            setFormErrors((errors) => ({ ...errors, name: '' }));
            setFormValues((values) => ({ ...values, [name]: value }));
          }, 500)}
        />

        {formValues.properties.map((property, index) => (
          <TextInput
            key={index}
            defaultValue={property.value}
            disabled={formMode === FormMode.VIEW}
            error={formErrors.properties[property.id.toString()]}
            label={property.placeHolder}
            onChange={debounce(({ value }) => {
              setFormErrors((errors) => ({
                ...errors,
                properties: {
                  ...errors.properties,
                  [property.id.toString()]: '',
                },
              }));
              setFormValues((values) => ({
                ...values,
                properties: [
                  ...values.properties.slice(0, index),
                  { ...property, value },
                  ...values.properties.slice(index + 1),
                ],
              }));
            }, 500)}
          />
        ))}
      </div>

      <div className="right-side">
        <Textarea
          optional
          defaultValue={formValues.description}
          label="Add Description"
          disabled={formMode === FormMode.VIEW}
          name="description"
          onChange={debounce(({ name, value }) => {
            setFormValues((val) => ({ ...val, [name]: value }));
          }, 500)}
          rows={3}
        />

        <label className="new-form-field-label">
          Select Authors <span className="optional-badge">Optional</span>
        </label>

        {
          formErrors.authors && (
          <FormError> 
            <ErrorIcon className="form-error-icon" />
            {formErrors.authors.message}
          </FormError>
          )
        }

        {formValues.authors.map((author, index) => {
          return (
            <div key={`${index}-${author.id}`} className="author">
              <Select
                selectedValue={
                  // This check is required to create a unselected select component on click of Add New ie line no : 303.
                  author.id !== '0'
                    ? {
                        label: `${getFullName(author)}, ID : ${
                          author.employeeId
                        }`,
                        value: author.id,
                      }
                    : undefined
                }
                placeholder="Choose Users"
                disabled={formMode === FormMode.VIEW}
                handleOnScroll={handleOnScroll}
                options={filterUsers(users)}
                onChange={(selectedOption: any) => {
                  const selectedUser = usersById?.[selectedOption.value];
                  setFormValues((values) => ({
                    ...values,
                    authors: [
                      ...values.authors.slice(0, index),
                      (selectedUser as unknown) as Author,
                      ...values.authors.slice(index + 1),
                    ],
                  }));
                  // reset authors related form errors
                  if(formErrors.authors){
                    setFormErrors({...formErrors, authors: undefined});
                  }
                }}
              />
              {formMode !== FormMode.VIEW && (
                <Close
                  id="remove"
                  className="icon"
                  onClick={() => {
                    setFormValues((values) => ({
                      ...values,
                      authors: [
                        ...values.authors.slice(0, index),
                        ...values.authors.slice(index + 1),
                      ],
                    }));
                    // reset authors related form errors
                    if(formErrors.authors){
                      setFormErrors({...formErrors, authors: undefined});
                    }
                  }}
                />
              )}
            </div>
          );
        })}

        {formMode !== FormMode.VIEW && (
          <AddNewItem
            onClick={() => {
              setFormValues((values) => ({
                ...values,
                authors: [...values.authors, { id: '0' } as Author],
              }));
            }}
          />
        )}
      </div>

      <div className="form-submit-buttons">
        <Button1 color="red" variant="secondary" onClick={() => navigate(-1)}>
          Cancel
        </Button1>
        {formMode !== FormMode.VIEW && <Button1 type="submit">Submit</Button1>}
      </div>
    </form>
  );
};

export default PrototypeForm;
