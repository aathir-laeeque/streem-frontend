import { AddNewItem, Avatar, Button1, Select, TextInput } from '#components';
import { ComposerEntity } from '#Composer-new/types';
import { useProperties } from '#services/properties';
import { defaultParams, useUsers } from '#services/users';
import { useTypedSelector } from '#store/helpers';
import { getFullName } from '#utils/stringUtils';
import { Close } from '@material-ui/icons';
import { navigate } from '@reach/router';
import { debounce, isEmpty } from 'lodash';
import React, { FC, FormEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { addNewPrototype, updatePrototype } from './actions';
import { FormErrors, FormMode, FormValues, Props } from './types';

const generateNewAuthor = () => ({
  email: '',
  employeeId: '',
  firstName: '',
  id: 0,
  lastName: '',
  primary: false,
});

const validateForm = (values: FormValues) => {
  const formErrors: FormErrors = { name: '', properties: {} };
  let isValid = true;

  if (!values.name) {
    isValid = false;
    formErrors.name = 'Checklist name is required';
  }

  values.properties.map((property) => {
    if (property.mandatory && !property.value) {
      formErrors.properties[property.id.toString()] = 'Property is required';
    }
  });

  return { isValid, formErrors };
};

const PrototypeForm: FC<Props> = (props) => {
  const { formMode, formData } = props;

  const dispatch = useDispatch();

  const { listById } = useProperties(ComposerEntity.CHECKLIST);

  const { users } = useUsers({
    params: { ...defaultParams, size: 100 },
  });

  const { profile } = useTypedSelector((state) => state.auth);

  const [formValues, setFormValues] = useState<FormValues>({
    authors: [...(formData?.authors ?? [generateNewAuthor()])],
    name: formData?.name ?? '',
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
        dispatch(updatePrototype(formValues, formData?.prototypeId));
      }
    } else {
      setFormErrors(formErrors);
    }
  };

  return (
    <form className="prototype-form" onSubmit={handleSubmit}>
      <h3 className="heading">New Checklist Prototype</h3>

      <div className="left-side">
        <div className="owner">
          <h5 className="label">Checklist Owner</h5>

          {profile ? (
            <div className="container">
              <Avatar user={profile} />
              <div className="owner-details">
                <div className="owner-id">{profile.employeeId}</div>
                <div className="owner-name">{getFullName(profile)}</div>
              </div>
            </div>
          ) : null}
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
        <label className="new-form-field-label">
          Select Authors <span className="optional-badge">Optional</span>
        </label>

        {formValues.authors.map((author, index) => (
          <div key={index} className="author">
            <Select
              selectedValue={
                !!author.id
                  ? {
                      label: `${getFullName(author)}, ID : ${
                        author.employeeId
                      }`,
                      value: author.id,
                    }
                  : undefined
              }
              placeHolder="Choose Users"
              options={users.map((user) => ({
                label: `${getFullName(user)}, ID : ${user.employeeId}`,
                value: user.id,
                id: user.id,
                employeeId: user.employeeId,
                firstName: user.firstName,
                lastName: user.lastName,
              }))}
              onChange={(selectedOption: any) => {
                setFormValues((values) => ({
                  ...values,
                  authors: [
                    ...values.authors.slice(0, index),
                    { ...selectedOption },
                    ...values.authors.slice(index + 1),
                  ],
                }));
              }}
            />
            <Close
              id="remove"
              className="icon"
              onClick={() =>
                setFormValues((values) => ({
                  ...values,
                  authors: [
                    ...values.authors.slice(0, index),
                    ...values.authors.slice(index + 1),
                  ],
                }))
              }
            />
          </div>
        ))}

        <AddNewItem
          onClick={() => {
            setFormValues((values) => ({
              ...values,
              authors: [...values.authors, generateNewAuthor()],
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
