import { CheckboxWithLabel } from '#components';
import { Entity } from '#JobComposer/composer.types';
import { useTypedSelector } from '#store';
import { Close } from '@material-ui/icons';
import { get } from 'lodash';
import React, { FC, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { executeParameter, fixParameter, updateExecutedParameter } from '../actions';
import { ParameterProps, Selections } from '../types';
import { Wrapper } from './styles';

const ChecklistParameter: FC<ParameterProps> = ({ parameter, isCorrectingError }) => {
  const metaInfo = useRef<{
    shouldCallApi?: boolean;
  }>({});
  const { entity } = useTypedSelector((state) => state.composer);
  const dispatch = useDispatch();

  useEffect(() => {
    if (metaInfo.current?.shouldCallApi) {
      metaInfo.current.shouldCallApi = false;
      if (parameter?.response?.choices) {
        const data = parameter.data.map((d: any) => {
          return {
            ...d,
            state: get(parameter?.response?.choices, d.id, Selections.NOT_SELECTED),
          };
        });
        if (isCorrectingError) {
          dispatch(
            fixParameter({
              ...parameter,
              data,
            }),
          );
        } else {
          dispatch(
            executeParameter({
              ...parameter,
              data,
            }),
          );
        }
      }
    }
  }, [parameter?.response?.choices]);

  const handleExecution = (id: string, choice: Selections) => {
    metaInfo.current.shouldCallApi = true;
    dispatch(
      updateExecutedParameter({
        ...parameter,
        response: {
          ...parameter.response,
          audit: undefined,
          choices: {
            ...parameter.response?.choices,
            ...parameter.data.reduce((acc: any, d: any) => {
              if (d.id === id) {
                acc[d.id] = choice;
              }
              return acc;
            }, {}),
          },
        },
      }),
    );
  };

  if (entity === Entity.JOB) {
    return (
      <Wrapper>
        <ul className="list-container" data-id={parameter.id} data-type={parameter.type}>
          {parameter.data.map((el, index) => {
            const isItemSelected = get(parameter?.response?.choices, el.id) === Selections.SELECTED;

            return (
              <li key={index} className="list-item">
                <div
                  className="item-content"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleExecution(
                      el.id,
                      isItemSelected ? Selections.NOT_SELECTED : Selections.SELECTED,
                    );
                  }}
                >
                  <CheckboxWithLabel isChecked={isItemSelected} label={el.name} />
                </div>

                <Close className="icon" />
              </li>
            );
          })}
        </ul>
      </Wrapper>
    );
  } else {
    return null;
  }
};

export default ChecklistParameter;
