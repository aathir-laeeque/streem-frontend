import { closeOverlayAction, openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { Selections } from '#types';
import { jobActions } from '#views/Job/jobStore';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { ParameterProps } from '../Parameter';
import { Wrapper } from './styles';
import { Textarea } from '#components';

const YesNoParameter: FC<ParameterProps> = ({ parameter, isCorrectingError }) => {
  const dispatch = useDispatch();

  const getSelectedIdByChoices = () => {
    return parameter.response?.choices
      ? Object.entries(parameter.response?.choices).reduce(
          (acc, [choiceId, choiceValue]) => (choiceValue === Selections.SELECTED ? choiceId : acc),
          '',
        )
      : undefined;
  };

  const dispatchActions = (data: any, reason: string = '') => {
    if (isCorrectingError) {
      dispatch(
        jobActions.fixParameter({
          parameter: {
            ...parameter,
            data,
          },
          reason: reason,
        }),
      );
    } else {
      dispatch(
        jobActions.executeParameter({
          parameter: {
            ...parameter,
            data,
          },
          reason: reason,
        }),
      );
    }
  };

  return (
    <Wrapper data-id={parameter.id} data-type={parameter.type}>
      <div className="buttons-container">
        {[...parameter.data]
          .sort((a, b) => (a.type > b.type ? -1 : 1))
          .map((el, index) => {
            const selectedId = getSelectedIdByChoices();
            const isSelected = selectedId === el.id;
            return (
              <div key={index} className="button-item">
                <button
                  className={isSelected ? 'filled' : ''}
                  onClick={() => {
                    const data = parameter.data.map((d: any) => ({
                      ...d,
                      state: d.id === el.id ? Selections.SELECTED : Selections.NOT_SELECTED,
                    }));
                    if (el.type === 'no') {
                      dispatch(
                        openOverlayAction({
                          type: OverlayNames.REASON_MODAL,
                          props: {
                            modalTitle: 'State your Reason',
                            modalDesc: 'You need to submit a reason for No to proceed',
                            onSubmitHandler: (reason: string) => {
                              const data = parameter.data.map((d: any) => ({
                                ...d,
                                state:
                                  d.id === el.id ? Selections.SELECTED : Selections.NOT_SELECTED,
                              }));
                              dispatchActions(data, reason);
                              dispatch(closeOverlayAction(OverlayNames.REASON_MODAL));
                            },
                          },
                        }),
                      );
                    } else {
                      dispatchActions(data);
                    }
                  }}
                >
                  {el.name}
                </button>
              </div>
            );
          })}
      </div>
      {parameter.response?.reason && (
        <div className="decline-reason">
          <Textarea
            allowResize={false}
            label="Reason"
            value={parameter.response.reason}
            rows={4}
            disabled={true}
          />
        </div>
      )}
    </Wrapper>
  );
};

export default YesNoParameter;
