import { fetchComposerData } from '#PrototypeComposer/actions';
import { ComposerProps } from '#PrototypeComposer/types';
import { Button, Checkbox, LoadingContainer } from '#components';
import { showNotification } from '#components/Notification/actions';
import { NotificationType } from '#components/Notification/types';
import { useTypedSelector } from '#store/helpers';
import { apiHiddenParams } from '#utils/apiUrls';
import { ResponseObj } from '#utils/globalTypes';
import { request } from '#utils/request';
import { ArrowDropDown, ArrowRight } from '@material-ui/icons';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import Section, { AssignmentSectionWrapper } from './Section';

export const Wrapper = styled.div.attrs({})`
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  height: calc(100% - 40px);
  overflow: scroll;

  .header {
    align-items: center;
    background-color: #ffffff;
    display: flex;
    justify-content: space-between;
    padding: 12px 16px;

    > button {
      margin-left: auto;
    }

    .container {
      .checkmark {
        background-color: #fff;
        border-color: #333;
        border-radius: 0;
        border-width: 2px;
      }

      input:checked ~ .checkmark {
        background-color: #1d84ff;
        border: none;
      }
    }

    button {
      padding: 12px 16px;
    }
  }
`;

export type HiddenParametersStateType = Record<string, boolean>;

const HiddenParameters: FC<ComposerProps & { isReadOnly: boolean }> = ({
  id,
  entity,
  isReadOnly,
}) => {
  const dispatch = useDispatch();
  const {
    data,
    stages: { listById: stagesById, listOrder: stageOrder },
    loading,
  } = useTypedSelector((state) => state.prototypeComposer);

  const [isOpen, toggleIsOpen] = useState(true);
  const [parameterChanges, setParameterChanges] = useState<HiddenParametersStateType>({});

  useEffect(() => {
    if (id) {
      dispatch(fetchComposerData({ entity, id, setLoading: false }));
    }
  }, []);

  useEffect(() => {
    const _parameterChanges: HiddenParametersStateType = {};
    Object.values(stagesById).forEach((stage) => {
      stage.tasks.forEach((task) => {
        task.parameters.forEach((param) => {
          if (param.hidden) {
            _parameterChanges[param.id] = true;
          } else {
            _parameterChanges[param.id] = false;
          }
        });
      });
    });

    if (data?.parameters && data?.parameters?.length > 0) {
      data.parameters.forEach((param) => {
        if (param.hidden) {
          _parameterChanges[param.id] = true;
        } else {
          _parameterChanges[param.id] = false;
        }
      });
    }
    setParameterChanges(_parameterChanges);
  }, [stageOrder]);

  const saveHiddenParams = async () => {
    try {
      const response: ResponseObj<any> = await request('PATCH', apiHiddenParams(), {
        data: Object.entries(parameterChanges).reduce<{ hide: string[]; show: string[] }>(
          (acc, [id, isHidden]: [string, boolean]) => {
            if (isHidden) {
              acc.hide.push(id);
            } else {
              acc.show.push(id);
            }
            return acc;
          },
          {
            hide: [],
            show: [],
          },
        ),
      });
      if (response && id) {
        dispatch(fetchComposerData({ entity, id, setLoading: false }));
        dispatch(
          showNotification({
            type: NotificationType.SUCCESS,
            msg: 'Success',
          }),
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const updateParameterChanges = (ids: string[], value: boolean) => {
    setParameterChanges((prev) => {
      let updatedChanges = { ...prev };
      ids.forEach((id) => {
        updatedChanges = { ...updatedChanges, [id]: value };
      });
      return updatedChanges;
    });
  };

  let isWholeCjfSelected = true;
  const parameterIdsInCjf: string[] = [];
  const parameterRows = (data?.parameters || []).map((param) => {
    parameterIdsInCjf.push(param.id);
    if (!parameterChanges[param.id]) {
      isWholeCjfSelected = false;
    }
    return (
      <div className="section-task-item-param-item" key={param.id}>
        <Checkbox
          checked={parameterChanges[param.id]}
          label={param.label}
          disabled={isReadOnly}
          onClick={({ target }) => updateParameterChanges([param.id], target.checked)}
        />
      </div>
    );
  });

  return (
    <LoadingContainer
      loading={loading}
      component={
        <div style={{ padding: '8px', height: '100%' }}>
          <Wrapper>
            {!isReadOnly && (
              <div className="header">
                {!isReadOnly && (
                  <Button
                    onClick={() => {
                      saveHiddenParams();
                    }}
                  >
                    Save
                  </Button>
                )}
              </div>
            )}
            {data?.parameters && data?.parameters?.length > 0 && (
              <div>
                <AssignmentSectionWrapper>
                  <div className="section-header">
                    <div className="icon-wrapper" onClick={() => toggleIsOpen((val) => !val)}>
                      {isOpen ? (
                        <ArrowDropDown className="icon toggle-section" />
                      ) : (
                        <ArrowRight className="icon toggle-section" />
                      )}
                    </div>

                    <Checkbox
                      checked={isWholeCjfSelected}
                      disabled={isReadOnly}
                      label={
                        <div>
                          <span style={{ fontWeight: 'bold' }}>Create Job Form</span>
                        </div>
                      }
                      onClick={({ target }) =>
                        updateParameterChanges(parameterIdsInCjf, target.checked)
                      }
                    />
                  </div>
                  {isOpen && (
                    <div className="section-task-item-param section-process-items">
                      {parameterRows}
                    </div>
                  )}
                </AssignmentSectionWrapper>
              </div>
            )}
            {stageOrder.map((stageId, index) => {
              return (
                <Section
                  stage={stagesById[stageId]}
                  key={stageId}
                  parameterChanges={parameterChanges}
                  isFirst={index === 0}
                  isReadOnly={isReadOnly}
                  updateParameterChanges={updateParameterChanges}
                />
              );
            })}
          </Wrapper>
        </div>
      }
    />
  );
};

export default HiddenParameters;
