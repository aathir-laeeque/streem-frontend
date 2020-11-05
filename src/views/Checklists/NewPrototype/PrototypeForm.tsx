import {
  AddNewItem,
  Avatar,
  Button1,
  Select,
  Textarea,
  TextInput,
} from '#components';
import { ComposerEntity } from '#Composer-new/types';
import { useProperties } from '#services/properties';
import { defaultParams, useUsers } from '#services/users';
import { useTypedSelector } from '#store/helpers';
import { getFullName } from '#utils/stringUtils';
import { Close } from '@material-ui/icons';
import { navigate } from '@reach/router';
import { debounce, isEmpty, pick } from 'lodash';
import React, { FC, FormEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { addNewPrototype, updatePrototype } from './actions';
import { FormErrors, FormMode, FormValues, Props } from './types';

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

  const { users, usersById } = useUsers({
    params: { ...defaultParams, size: 100 },
  });

  const { profile } = useTypedSelector((state) => state.auth);

  const [formValues, setFormValues] = useState<FormValues>({
    authors: [
      ...(formData?.authors
        ?.filter((author) => !author.primary)
        .map((author) => author.id) ?? ['0']),
    ],
    description: '',
    name: formData?.name ?? '',
    primaryAuthor: formData?.authors?.filter(
      (author) => author?.primary,
    )[0] ?? {
      ...pick(profile, ['id', 'employeeId', 'firstName', 'lastName', 'email']),
      primary: true,
    },
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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { isValid, formErrors } = validateForm(formValues);

    if (isValid) {
      if (formMode === FormMode.ADD) {
        dispatch(addNewPrototype(formValues));
      } else if (formMode === FormMode.EDIT) {
        dispatch(
          updatePrototype(
            formValues,
            formData?.prototypeId,
            formData?.authors
              ?.filter((author) => !author.primary)
              .map((author) => author.id),
          ),
        );
      }
    } else {
      setFormErrors(formErrors);
    }
  };

  if (!users.length || !Object.values(listById).length) {
    return null;
  }

  return (
    <form className="prototype-form" onSubmit={handleSubmit}>
      <h3 className="heading">New Checklist Prototype</h3>

      <div className="left-side">
        <div className="owner">
          <h5 className="label">Checklist Owner</h5>

          <div className="container">
            <Avatar user={formValues.primaryAuthor} />
            <div className="owner-details">
              <div className="owner-id">
                {formValues.primaryAuthor.employeeId}
              </div>
              <div className="owner-name">
                {getFullName(formValues.primaryAuthor)}
              </div>
            </div>
          </div>
        </div>

        <TextInput
          defaultValue={formValues.name}
          error={formErrors.name}
          label="Checklist Name"
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
          name="description"
          onChange={debounce(({ name, value }) => {
            setFormValues((val) => ({ ...val, [name]: value }));
          }, 500)}
          rows={3}
        />

        <label className="new-form-field-label">
          Select Authors <span className="optional-badge">Optional</span>
        </label>

        {formValues.authors.map((authorId, index) => {
          const author = usersById[authorId];

          return (
            <div key={`${index}-${authorId}`} className="author">
              <Select
                selectedValue={
                  !!parseInt(authorId)
                    ? {
                        label: `${getFullName(author)}, ID : ${
                          author.employeeId
                        }`,
                        value: authorId,
                      }
                    : undefined
                }
                placeHolder="Choose Users"
                options={users
                  .filter((user) => user.id !== formValues.primaryAuthor.id)
                  .map((user) => ({
                    label: `${getFullName(user)}, ID : ${user.employeeId}`,
                    value: user.id,
                  }))}
                onChange={(selectedOption: any) => {
                  const selectedUser = usersById[selectedOption.value];

                  setFormValues((values) => ({
                    ...values,
                    authors: [
                      ...values.authors.slice(0, index),
                      selectedUser.id,
                      ...values.authors.slice(index + 1),
                    ],
                  }));
                }}
              />
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
                }}
              />
            </div>
          );
        })}

        <AddNewItem
          onClick={() => {
            setFormValues((values) => ({
              ...values,
              authors: [...values.authors, '0'],
            }));
          }}
        />
      </div>

      <div className="form-submit-buttons">
        <Button1 color="red" variant="secondary" onClick={() => navigate(-1)}>
          Cancel
        </Button1>
        <Button1 type="submit">Submit</Button1>
      </div>
    </form>
  );
};

export default PrototypeForm;
