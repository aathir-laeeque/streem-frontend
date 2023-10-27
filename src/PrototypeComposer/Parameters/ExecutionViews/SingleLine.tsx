import { FormGroup } from '#components';
import { showNotification } from '#components/Notification/actions';
import { NotificationType } from '#components/Notification/types';
import { ParameterProps } from '#PrototypeComposer/Activity/types';
import { useTypedSelector } from '#store';
import { InputTypes } from '#utils/globalTypes';
import { getErrorMsg } from '#utils/request';
import { getObjectData } from '#views/Ontology/utils';
import { LinkOutlined } from '@material-ui/icons';
import React, { FC, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

const valueChecker = (value: string, type: InputTypes) => {
  switch (type) {
    case InputTypes.DATE:
      return parseInt(value);
    case InputTypes.DATE_TIME:
      return parseInt(value);
    case InputTypes.SINGLE_LINE:
    case InputTypes.MULTI_LINE:
    case InputTypes.NUMBER:
      return value;
    default:
      return;
  }
};

const SingleLineTaskView: FC<Omit<ParameterProps, 'taskId'>> = ({ parameter, form }) => {
  const dispatch = useDispatch();
  const { setValue, watch, clearErrors, setError, trigger } = form;
  const { autoInitialize, type, label } = parameter;
  const parameterType = type as unknown as InputTypes;
  const parameterInForm = watch(parameter.id, {});
  const dependentParameter = watch(autoInitialize?.parameterId);
  const autoInitializePoll = useRef<number | undefined>(undefined);
  const { list: parametersList } = useTypedSelector(
    (state) => state.prototypeComposer.parameters.parameters,
  );
  const linkedResourceParameter = useRef(
    parametersList.find((p) => p?.id === autoInitialize?.parameterId),
  );

  useEffect(() => {
    autoInitializePoll.current = window.setInterval(() => {
      if (linkedResourceParameter.current) {
        if (dependentParameter?.data?.choices?.length) {
          handleAutoInitialize();
        }
      }
    }, 1000);
    return () => {
      clearInterval(autoInitializePoll.current);
    };
  }, [dependentParameter]);

  const handleAutoInitialize = async () => {
    const objectId = dependentParameter?.data?.choices[0]?.objectId;
    const collection = dependentParameter?.data?.choices[0]?.collection;
    try {
      if (dependentParameter && objectId && collection) {
        const object = await getObjectData({ id: objectId, collection });
        const property = object?.properties?.find((p) => p.id === autoInitialize?.property?.id);
        handleOnChange(property?.value);
        if (!property?.value && parameter.mandatory) {
          throw `${label} has invalid value`;
        }
      } else {
        throw `${linkedResourceParameter.current?.label} must be selected before selecting ${label} parameter`;
      }
    } catch (e: any) {
      clearInterval(autoInitializePoll.current);
      dispatch(
        showNotification({
          type: NotificationType.ERROR,
          msg: typeof e !== 'string' ? getErrorMsg(e) : e,
        }),
      );
    }
  };

  const handleOnChange = (value?: any) => {
    const isValueValid = value && value.toString().trim() !== '';
    setValue(parameter.id, {
      ...parameter,
      data: isValueValid ? { ...parameter.data, input: valueChecker(value, parameterType) } : {},
      response: {
        value: valueChecker(value, parameterType),
        reason: '',
        state: 'EXECUTED',
        choices: {},
        medias: [],
        parameterValueApprovalDto: null,
      },
    });
    if (isValueValid) {
      clearErrors(parameter.id);
      trigger(parameter.id);
    } else {
      setError(parameter.id, {
        type: 'manual',
        message: 'required',
      });
    }
  };
  return (
    <>
      <FormGroup
        style={{ padding: 0 }}
        inputs={[
          {
            type: parameterType,
            props: {
              onChange: (value: any) => {
                handleOnChange(value.value);
              },
              ['data-id']: parameter.id,
              ['data-type']: parameter.type,
              disabled: parameter?.autoInitialized,
              value: parameterInForm?.data?.input,
            },
          },
        ]}
      />
      {parameter?.autoInitialized && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <LinkOutlined style={{ marginRight: 8 }} /> Linked to ‘
          {linkedResourceParameter.current?.label}’
        </div>
      )}
    </>
  );
};

export default SingleLineTaskView;
