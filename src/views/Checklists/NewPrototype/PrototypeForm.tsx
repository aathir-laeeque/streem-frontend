import { AddNewItem, Avatar, Button1, Dropdown } from '#components';
import { useTypedSelector } from '#store/helpers';
import { getFullName } from '#utils/stringUtils';
import { Close } from '@material-ui/icons';
import { isEmpty, pick } from 'lodash';
import React, { FC, useEffect } from 'react';
import { useFieldArray, useForm, Controller } from 'react-hook-form';
import Select from 'react-select';

import { FormInput, PrototypeFormProps, Author } from './types';
import { useDispatch } from 'react-redux';
import { createNewPrototype } from './actions';

const PrototypeForm: FC<PrototypeFormProps> = ({
  checklistProperties,
  users,
}) => {
  const dispatch = useDispatch();

  const { profile } = useTypedSelector((state) => state.auth);

  const defaultValues: FormInput = {
    authors: [],
    name: '',
    properties: checklistProperties,
  };

  const { control, errors, handleSubmit, register, reset } = useForm<FormInput>(
    { defaultValues },
  );

  const authors = useFieldArray({ control, name: 'authors' });

  const properties = useFieldArray({ control, name: 'properties' });

  useEffect(() => {
    if (checklistProperties.length) {
      reset(defaultValues);
    }
  }, [checklistProperties]);

  const onSubmit = (data: FormInput) => {
    if (isEmpty(errors)) {
      console.log('data onSubmit :: ', data);
      const authorsIds = (data.authors ?? []).map((el) => parseInt(el.value));

      dispatch(
        createNewPrototype({
          ...data,
          authors: users
            .filter(({ id }) => authorsIds.includes(id))
            .map((user) => ({
              ...pick(user, ['id', 'firstName', 'lastName', 'employeeId']),
            })),
          properties: data.properties?.map((property) => ({
            ...property,
            id: parseInt(property.id.toString()),
          })),
        }),
      );
    }
  };

  return (
    <form className="prototype-form" onSubmit={handleSubmit(onSubmit)}>
      <h3 className="heading">New Checklist Prototype</h3>

      <div className="left-side">
        <div className="owner">
          <h5 className="label">Checklist Owner</h5>

          <div className="container">
            <Avatar user={profile} />
            <div className="owner-details">
              <div className="owner-id">{profile?.employeeId}</div>
              <div className="owner-name">{getFullName(profile)}</div>
            </div>
          </div>
        </div>

        <div className="new-form-field">
          <label className="new-form-field-label">Checklist Name</label>
          <input
            className={`new-form-field-input ${
              errors.name?.message ? 'error' : ''
            }`}
            name="name"
            placeholder="Checklist Name"
            ref={register({ required: 'Checklist name is required' })}
            type="text"
          />

          {errors.name?.message ? (
            <span className="field-error">{errors.name?.message}</span>
          ) : null}
        </div>

        {properties.fields.map((property, index) => (
          <div className="new-form-field" key={index}>
            <label className="new-form-field-label">
              {property.placeHolder}
            </label>
            {/* Hidden field as this value is needed on form submit */}
            <input
              className="new-form-field-input hide"
              defaultValue={property.id}
              name={`properties[${index}].id`}
              ref={register}
              type="text"
            />
            {/* Hidden field as this value is needed on form submit */}
            <input
              className="new-form-field-input hide"
              defaultValue={property.name}
              name={`properties[${index}].name`}
              ref={register}
              type="text"
            />
            <input
              className="new-form-field-input"
              name={`properties[${index}].value`}
              placeholder={property.placeHolder}
              ref={register}
              type="text"
            />
          </div>
        ))}
      </div>

      <div className="right-side">
        <div className="new-form-field">
          <label className="new-form-field-label">
            Select Authors <span className="optional-badge">Optional</span>
          </label>

          <ol className="author-list">
            {authors.fields.map((field, index) => (
              <li className="author-list-item" key={index}>
                {/* <Controller
                  as={Select}
                  control={control}
                  id={`authors[${index}]`}
                  name={`authors[${index}].value`}
                  options={users?.map((user) => ({
                    label: `${getFullName(user)}, ID : ${user.employeeId}`,
                    value: user.id,
                  }))}
                /> */}

                <Dropdown
                  name={`authors[${index}].value`}
                  options={users?.map((user) => ({
                    label: `${getFullName(user)}, ID : ${user.employeeId}`,
                    value: user.id,
                  }))}
                  ref={register}
                />
                <Close className="icon" onClick={() => authors.remove(index)} />
              </li>
            ))}

            <AddNewItem onClick={() => authors.append({})} />
          </ol>
        </div>
      </div>

      <div className="form-submit-buttons">
        <Button1
          color="red"
          variant="secondary"
          onClick={() => console.log('cancel action of form')}
        >
          Cancel
        </Button1>
        <Button1 type="submit">Submit</Button1>
      </div>
    </form>
  );
};

export default PrototypeForm;
