import { Button, Textarea } from '#components';
import { ParameterState, Selections } from '#types';
import { jobActions } from '#views/Job/jobStore';
import { debounce } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ParameterProps } from '../Parameter';
import ParameterVerificationView from '../Verification/ParameterVerificationView';
import { Wrapper } from './styles';

type YesNoParameterState = {
  reason: string;
  selectedId?: string;
  shouldAskForReason: boolean;
  showButtons: boolean;
  shouldCallApi?: boolean;
  isEditing?: boolean;
};

const YesNoParameter: FC<
  ParameterProps & {
    verificationsByType: any;
    verificationType: string;
  }
> = ({
  parameter,
  isCorrectingError,
  verificationsByType,
  verificationType,
  isLoggedInUserAssigned,
}) => {
  const dispatch = useDispatch();

  const getSelectedIdByChoices = () => {
    return parameter.response?.choices
      ? Object.entries(parameter.response?.choices).reduce(
          (acc, [choiceId, choiceValue]) => (choiceValue === Selections.SELECTED ? choiceId : acc),
          '',
        )
      : undefined;
  };

  const { state: parameterState, audit } = parameter.response;

  const [state, setState] = useState<YesNoParameterState>({
    reason: parameter?.response?.reason ?? '',
    shouldAskForReason: !!parameter?.response?.reason,
    showButtons: parameter?.response?.state !== 'EXECUTED',
    selectedId: undefined,
  });

  const dispatchActions = (data: any) => {
    if (isCorrectingError) {
      dispatch(
        jobActions.fixParameter({
          parameter: {
            ...parameter,
            data,
          },
          reason: state.reason,
        }),
      );
    } else {
      dispatch(
        jobActions.executeParameter({
          parameter: {
            ...parameter,
            data,
          },
          reason: state.reason,
        }),
      );
    }
  };

  useEffect(() => {
    if (state.shouldCallApi) {
      if (state.selectedId) {
        const data = parameter.data.map((d: any) => ({
          ...d,
          state: d.id === state.selectedId ? Selections.SELECTED : Selections.NOT_SELECTED,
        }));
        if (state.shouldAskForReason) {
          if (state.reason) {
            dispatchActions(data);
          }
        } else {
          dispatchActions(data);
        }
      }
      setState((prev) => ({
        ...prev,
        shouldCallApi: false,
        isEditing: false,
      }));
    } else if (!state.isEditing) {
      const selectedIoFromStore = getSelectedIdByChoices();
      if (state.selectedId !== selectedIoFromStore) {
        setState((prevState) => ({
          ...prevState,
          reason: parameter?.response?.reason ?? '',
          shouldAskForReason: !!parameter?.response?.reason,
          showButtons: parameter?.response?.state !== 'EXECUTED',
          selectedId: selectedIoFromStore,
        }));
      }
    }
  }, [parameter?.response?.choices, parameter?.response?.reason, state.shouldCallApi]);

  const handleExecution = (id: string) => {
    if (id) {
      setState((prevState) => ({
        ...prevState,
        shouldCallApi: true,
        showButtons: false,
      }));
    }
  };

  return (
    <Wrapper data-id={parameter.id} data-type={parameter.type}>
      <div className="parameter-label" data-for={parameter.id}>
        {parameter.label}
      </div>
      <div
        className="buttons-container"
        {...([ParameterState.APPROVAL_PENDING].includes(parameterState) && {
          style: {
            pointerEvents: 'none',
          },
        })}
      >
        {[...parameter.data]
          .sort((a, b) => (a.type > b.type ? -1 : 1))
          .map((el, index) => {
            const isSelected = state.selectedId === el.id;
            return (
              <div key={index} className="button-item">
                <button
                  className={isSelected ? 'filled' : ''}
                  onClick={() => {
                    if (el.type === 'no') {
                      setState((prevState) => ({
                        ...prevState,
                        showButtons: true,
                        shouldAskForReason: true,
                        isEditing: true,
                        selectedId: el.id,
                      }));
                    } else {
                      setState((prevState) => ({
                        ...prevState,
                        reason: '',
                        shouldAskForReason: false,
                        isEditing: true,
                        selectedId: el.id,
                      }));
                      handleExecution(el.id);
                    }
                  }}
                >
                  {el.name}
                </button>
              </div>
            );
          })}
      </div>

      {state.shouldAskForReason && (
        <div className="decline-reason">
          <Textarea
            allowResize={false}
            label="State your Reason"
            defaultValue={state.reason}
            onChange={debounce(({ value }) => {
              setState((values) => ({
                ...values,
                reason: value,
              }));
            }, 500)}
            rows={4}
            disabled={!state.showButtons}
          />

          {state.showButtons && (
            <div className="buttons-container">
              <Button
                variant="secondary"
                color="blue"
                onClick={() => {
                  handleExecution(state.selectedId!);
                }}
              >
                Submit
              </Button>
              <Button
                variant="secondary"
                color="red"
                onClick={() =>
                  setState((prevState) => ({
                    ...prevState,
                    reason: '',
                    shouldAskForReason: false,
                    selectedId: parameter.data.reduce(
                      (acc: any, d: any) => (d.id !== state.selectedId ? d.id : acc),
                      '',
                    ),
                  }))
                }
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      )}

      {!state.showButtons ||
        (!state.shouldAskForReason && (
          <ParameterVerificationView
            parameterState={parameterState}
            verificationsByType={verificationsByType}
            verificationType={verificationType}
            isLoggedInUserAssigned={!!isLoggedInUserAssigned}
            parameterId={parameter.id}
            modifiedBy={audit?.modifiedBy?.id}
          />
        ))}
    </Wrapper>
  );
};

export default YesNoParameter;
