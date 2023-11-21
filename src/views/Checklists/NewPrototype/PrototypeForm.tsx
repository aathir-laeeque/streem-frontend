import { AddNewItem, Avatar, Button, Select, Textarea, TextInput, Option } from '#components';
import { ComposerEntity } from '#PrototypeComposer/types';
import { defaultParams, OtherUserState, User, useUsers } from '#services/users';
import { useTypedSelector } from '#store/helpers';
import { ALL_FACILITY_ID, DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '#utils/constants';
import { Error, FilterOperators, fetchDataParams } from '#utils/globalTypes';
import { getFullName } from '#utils/stringUtils';
import { Close, Error as ErrorIcon } from '@material-ui/icons';
import { navigate } from '@reach/router';
import { debounce, isEmpty, keyBy, pick } from 'lodash';
import React, { FC, FormEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { addNewPrototype, updatePrototype } from './actions';
import { Author, FormErrors, FormMode, FormValues, KeyValue, Props } from './types';
import { fetchChecklists } from '../ListView/actions';
import { showNotification } from '#components/Notification/actions';
import { NotificationType } from '#components/Notification/types';
import { Checklist } from '#PrototypeComposer/checklist.types';

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

  values.properties.map((el) => {
    if (values.property && values.property[el.id] && values.property[el.id].value) {
      el.value = values.property[el.id].label;
    }
  });

  if (!values.name) {
    isValid = false;
    formErrors.name = 'Process name is required';
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
  const { listById } = useTypedSelector((state) => state.properties[ComposerEntity.CHECKLIST]);
  const { selectedFacility: { id: facilityId = '' } = {} } = useTypedSelector(
    (state) => state.auth,
  );
  const {
    pageable,
    currentPageData,
    loading: checklistDataLoading,
  } = useTypedSelector((state) => state.checklistListView);

  const { users, usersById, loadMore } = useUsers({
    userState:
      facilityId === ALL_FACILITY_ID ? OtherUserState.AUTHORS_GLOBAL : OtherUserState.AUTHORS,
    params: { ...defaultParams(false) },
  });

  const { profile, selectedUseCase } = useTypedSelector((state) => state.auth);

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
    property: {},
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({
    name: '',
    properties: {},
  });

  useEffect(() => {
    fetchChecklistData({ page: 0 });
  }, []);

  const getPrefillPropertyDetails = (values) => {
    let obj = {};
    for (let key in values) {
      if (formData?.properties?.find((el) => el.id === values[key].id)?.value) {
        obj[key] = {
          value: values[key].id,
          label: formData?.properties?.find((el) => el.id === values[key].id)?.value ?? '',
        };
      }
    }
    return obj;
  };

  useEffect(() => {
    if (!isEmpty(listById)) {
      setFormValues((values) => ({
        ...values,
        property: getPrefillPropertyDetails(listById),
        properties: Object.values(listById).map((property) => ({
          id: property.id,
          label: property.label,
          mandatory: property.mandatory,
          name: property.name,
          placeHolder: property.placeHolder,
          value: formData?.properties?.find((el) => el.id === property.id)?.value ?? '',
        })),
      }));
    }
  }, [listById]);

  // TODO Create a single global error handler for apis
  const getApiFormErrors = (apiFormErrors: Error[]) => {
    const updatedFormErrors = { ...formErrors };
    if (apiFormErrors && apiFormErrors.length) {
      apiFormErrors.forEach((formError) => {
        if (formError.code === 'E124') {
          updatedFormErrors.authors = formError;
        }
        if (formError.code === 'E143') {
          updatedFormErrors.properties[formError.id.toString()] = formError.message;
        }
      });
      setFormErrors(updatedFormErrors);
    }
  };

  const fetchChecklistData = ({
    page = DEFAULT_PAGE_NUMBER,
    size = DEFAULT_PAGE_SIZE,
    query = '',
    propertyId,
  }: fetchDataParams) => {
    const filters = JSON.stringify({
      op: FilterOperators.AND,
      fields: [
        ...(propertyId
          ? [
              {
                field: 'checklistPropertyValues.facilityUseCasePropertyMapping.propertiesId',
                op: FilterOperators.EQ,
                values: [propertyId],
              },
            ]
          : [{}]),
        { field: 'checklistPropertyValues.value', op: FilterOperators.LIKE, values: [query] },
        {
          field: 'useCaseId',
          op: FilterOperators.EQ,
          values: [selectedUseCase!.id],
        },
      ],
    });
    if (query && propertyId) {
      setFormValues((values) => ({
        ...values,
        property: {
          ...formValues.property,
          [propertyId]: { value: query, label: query },
        },
      }));
    }
    dispatch(fetchChecklists({ page, size, filters, sort: 'id' }, page === 0));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { isValid, formErrors } = validateForm(formValues);

    if (isValid) {
      if (formMode === FormMode.ADD) {
        dispatch(
          addNewPrototype(
            {
              ...formValues,
              authors: formValues.authors.map((author) => author.id),
              useCaseId: selectedUseCase!.id,
            },
            getApiFormErrors,
          ),
        );
      } else if (formMode === FormMode.EDIT) {
        dispatch(
          updatePrototype(
            {
              ...formValues,
              authors: formValues.authors.map((author) => author.id),
              useCaseId: selectedUseCase!.id,
            },
            formData?.prototypeId,
            formData?.authors?.map((author) => author.id),
            getApiFormErrors,
          ),
        );
      }
    } else {
      setFormErrors(formErrors);
    }
  };

  const handleOnScroll = () => {
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

  const filterProperties = (values: Checklist[], propertyId: string) => {
    const arr = values.map((value) => {
      const data = keyBy(value.properties, 'id');
      return {
        label: data[propertyId]?.value,
        value: data[propertyId]?.id,
      };
    });
    return arr;
  };

  const checkUniquenessData = (values: Checklist[], propertyId: string, typeValue: KeyValue) => {
    if (values.length) {
      values.map((value) => {
        const data = keyBy(value.properties, 'id');
        if (
          data[propertyId] &&
          typeValue &&
          data[propertyId].value.trim().toLowerCase() === typeValue.value.trim().toLowerCase()
        ) {
          dispatch(
            showNotification({
              type: NotificationType.WARNING,
              msg: 'The value entered is not unique',
            }),
          );
        }
      });
    } else {
      if (typeValue) {
        dispatch(
          showNotification({
            type: NotificationType.SUCCESS,
            msg: 'The value entered is unique',
          }),
        );
      }
    }
  };

  if (!users.length) {
    return null;
  }

  return (
    <form className="prototype-form" onSubmit={handleSubmit}>
      <h3 className="heading">New Process Prototype</h3>

      <div className="left-side">
        {formData.revisedCode && (
          <>
            <div className="input-field">
              <h5 className="label">Process Being Revised</h5>
              <h4 className="value">{formData.revisedName}</h4>
            </div>
            <div className="input-field">
              <h5 className="label">Process ID</h5>
              <h4 className="value">{formData.revisedCode}</h4>
            </div>
          </>
        )}
        <div className={formData.revisedCode ? 'owner revised' : 'owner'}>
          <h5 className={formData.revisedCode ? 'label-light' : 'label'}>
            {formData.revisedCode ? 'Being Revised by' : 'Process Owner'}
          </h5>
          <div className="container">
            <Avatar user={formValues.createdBy} />
            <div className="owner-details">
              <div className="owner-id">{formValues.createdBy.employeeId}</div>
              <div className="owner-name">{getFullName(formValues.createdBy)}</div>
            </div>
          </div>
        </div>

        <TextInput
          defaultValue={formValues.name}
          error={formErrors.name}
          label="Process Name"
          disabled={formMode === FormMode.VIEW}
          name="name"
          onChange={debounce(({ name, value }) => {
            setFormErrors((errors) => ({ ...errors, name: '' }));
            setFormValues((values) => ({ ...values, [name]: value }));
          }, 500)}
        />
        {formValues.properties.map((property, index) => (
          <div style={{ margin: '10px 0' }}>
            <Select
              key={index}
              placeholder={property.placeHolder}
              label={property.label}
              isClearable
              isLoading={checklistDataLoading}
              value={formValues.property && formValues.property[property.id]}
              onBlur={() =>
                checkUniquenessData(
                  currentPageData,
                  property.id,
                  formValues.property && formValues.property[property.id],
                )
              }
              onChange={(selectedOption) => {
                setFormValues((values) => ({
                  ...values,
                  property: {
                    ...formValues.property,
                    [property.id]: selectedOption,
                  },
                }));
                if (selectedOption) {
                  dispatch(
                    showNotification({
                      type: NotificationType.WARNING,
                      msg: 'The value entered is not unique.',
                    }),
                  );
                }
              }}
              onMenuScrollToBottom={() => {
                if (!pageable.last) {
                  fetchChecklistData({
                    page: pageable.page + 1,
                    propertyId: property.id,
                  });
                }
              }}
              onInputChange={debounce((value, actionMeta) => {
                if (actionMeta.prevInputValue !== value)
                  fetchChecklistData({
                    query: value,
                    propertyId: property.id,
                  });
              }, 500)}
              error={formErrors && formErrors.properties[property.id]}
              options={filterProperties(currentPageData, property.id)}
            />
          </div>
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

        {formErrors.authors && (
          <FormError>
            <ErrorIcon className="form-error-icon" />
            {formErrors.authors.message}
          </FormError>
        )}

        {formValues.authors.map((author, index) => {
          return (
            <div key={`${index}-${author.id}`} className="author">
              <Select
                style={{ width: '100%' }}
                value={
                  // This check is required to create a unselected select component on click of Add New ie line no : 303.
                  author.id !== '0'
                    ? {
                        label: `${getFullName(author)}, ID : ${author.employeeId}`,
                        value: author.id,
                      }
                    : undefined
                }
                placeholder="Choose Users"
                isDisabled={formMode === FormMode.VIEW}
                onMenuScrollToBottom={handleOnScroll}
                options={filterUsers(users)}
                onChange={(selectedOption: any) => {
                  const selectedUser = usersById?.[selectedOption.value];
                  setFormValues((values) => ({
                    ...values,
                    authors: [
                      ...values.authors.slice(0, index),
                      selectedUser as unknown as Author,
                      ...values.authors.slice(index + 1),
                    ],
                  }));
                  // reset authors related form errors
                  if (formErrors.authors) {
                    setFormErrors({ ...formErrors, authors: undefined });
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
                    if (formErrors.authors) {
                      setFormErrors({ ...formErrors, authors: undefined });
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
        <Button color="red" variant="secondary" onClick={() => navigate(-1)}>
          Cancel
        </Button>
        {formMode !== FormMode.VIEW && <Button type="submit">Submit</Button>}
      </div>
    </form>
  );
};

export default PrototypeForm;
