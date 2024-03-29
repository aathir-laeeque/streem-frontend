import { TextInput } from '#components';
import { MandatoryParameter, Parameter, Stage } from '#PrototypeComposer/checklist.types';
import { ParameterIconByType } from '#PrototypeComposer/constants';
import { TabPanelWrapper } from '#PrototypeComposer/styles';
import { useTypedSelector } from '#store';
import { Accordion, AccordionDetails, AccordionSummary } from '@material-ui/core';
import { ExpandMore, Search } from '@material-ui/icons';
import { debounce } from 'lodash';
import React, { FC, useState } from 'react';
import styled from 'styled-components';
import RuleConfiguration from './RuleConfiguration';

const BranchingRulesWrapper = styled.div`
  display: flex;
  flex: 1;
  position: relative;
  height: 100%;
  margin-inline: -16px;

  .sidebar {
    width: 20%;
    padding-inline: 16px;
    overflow-y: auto;
    .options {
      margin-top: 16px;

      .target-type {
        font-weight: lighter;
        font-size: 16px;
        border-bottom: 1px solid #e0e0e0;
        padding-bottom: 4px;
      }

      .stage-options {
        margin-top: 8px;
      }

      .parameter-option {
        margin-block: 8px;
        padding: 8px 16px;
        display: flex;
        flex: 1;
        align-items: center;
        gap: 12px;
        cursor: pointer;

        .parameter-icon {
          background-color: #4589ff;
          border-radius: 50%;
          color: #fff;
          display: flex;
          padding: 4px;

          svg {
            font-size: 16px;
          }
        }
      }

      .MuiAccordion-root {
        :before {
          background-color: unset;
        }
      }

      .MuiAccordion-root.Mui-expanded {
        margin: unset;
      }

      .stage-accordion {
        box-shadow: none;
        width: 100%;

        .MuiAccordionSummary-root.Mui-expanded {
          min-height: unset;
          .MuiAccordionSummary-content.Mui-expanded {
            margin: 12px 0;
          }
        }

        .MuiAccordionDetails-root {
          padding: 0;
        }

        .MuiAccordionSummary-root {
          padding: 0px 16px 0px 0px;
        }

        .MuiAccordionSummary-content {
          font-weight: bold;
        }

        .MuiAccordionDetails-root {
          flex-direction: column;
        }

        .MuiAccordion-root.Mui-expanded {
          margin-top: 8px;
        }

        .task-accordion {
          box-shadow: none;
          width: 100%;
          margin-block: 4px;
          .MuiAccordionSummary-root {
            border: 1px solid #bababa;
            padding: 0px 16px;
          }

          .MuiAccordionSummary-content {
            font-weight: normal;
          }
        }
      }
    }
  }
  .content {
    display: flex;
    flex: 1;
    padding-left: 16px;
    border-left: 1px solid #e0e0e0;
  }
`;

const BranchingRules: FC<{ isReadOnly: boolean }> = ({ isReadOnly }) => {
  const [selectedParameter, setSelectedParameter] = useState<Parameter | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const { data, stages, tasks, parameters } = useTypedSelector((state) => state.prototypeComposer);

  const renderParameterOption = (parameterId?: string, parameter?: Parameter) => {
    const _parameter = !parameter && parameterId ? parameters.listById[parameterId] : parameter;
    if (
      _parameter &&
      [MandatoryParameter.SINGLE_SELECT, MandatoryParameter.RESOURCE].includes(_parameter.type)
    ) {
      let shouldPushParameter = false;
      if (!searchQuery) {
        shouldPushParameter = true;
      } else if (_parameter.label.toLowerCase().includes(searchQuery.toLowerCase())) {
        shouldPushParameter = true;
      }
      if (shouldPushParameter) {
        return (
          <div
            key={_parameter.id}
            className="parameter-option"
            onClick={() => {
              setSelectedParameter(_parameter);
            }}
            {...(selectedParameter?.id === _parameter.id && {
              style: {
                background: '#D5E7F7',
              },
            })}
          >
            <div className="parameter-icon">{ParameterIconByType[_parameter.type]}</div>
            {_parameter.label}
          </div>
        );
      }
    }
    return null;
  };

  const renderTaskOption = (stageId: string, taskId: string) => {
    const task = tasks.listById[taskId];
    const _parameters = Object.values(parameters.parameterOrderInTaskInStage[stageId][taskId])
      .map((parameterId) => renderParameterOption(parameterId))
      .filter((p) => p);
    if (_parameters.length) {
      return (
        <Accordion
          className="task-accordion"
          key={task.id}
          square
          TransitionProps={{ unmountOnExit: true }}
          onChange={() => setSelectedParameter(undefined)}
          expanded={searchQuery ? true : undefined}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>{task.name}</AccordionSummary>
          <AccordionDetails>{_parameters}</AccordionDetails>
        </Accordion>
      );
    }
    return null;
  };

  const renderStageOption = (stage: Stage) => {
    const _tasks = Object.values(tasks.tasksOrderInStage[stage.id])
      .map((taskId) => renderTaskOption(stage.id, taskId))
      .filter((t) => t);

    if (_tasks.length) {
      return (
        <Accordion
          className="stage-accordion"
          key={stage.id + searchQuery}
          square
          TransitionProps={{ unmountOnExit: true }}
          onChange={() => setSelectedParameter(undefined)}
          expanded={searchQuery ? true : undefined}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>{stage.name}</AccordionSummary>
          <AccordionDetails>{_tasks}</AccordionDetails>
        </Accordion>
      );
    }
    return null;
  };

  return (
    <TabPanelWrapper>
      <BranchingRulesWrapper>
        <div className="sidebar">
          <TextInput
            afterElementWithoutError
            AfterElement={Search}
            afterElementClass=""
            placeholder="Search Parameter"
            onChange={debounce(({ value }) => {
              setSearchQuery(value);
              if (selectedParameter) {
                setSelectedParameter(undefined);
              }
            }, 500)}
          />
          <div className="options">
            {data && data.parameters?.length > 0 && (
              <>
                <div className="target-type" style={{ marginBottom: 8 }}>
                  Create Job Parameters
                </div>
                {data.parameters.map((parameter: Parameter) =>
                  renderParameterOption(undefined, parameter),
                )}
              </>
            )}
            <div className="target-type" style={{ marginTop: 16 }}>
              Process Parameters
            </div>
            <div className="stage-options">
              {Object.values(stages.listById || {}).map((stage) => renderStageOption(stage))}
            </div>
          </div>
        </div>
        <div className="content">
          {selectedParameter ? (
            <RuleConfiguration parameter={selectedParameter} isReadOnly={isReadOnly} />
          ) : (
            'Please select a parameter to view / modify rules for it.'
          )}
        </div>
      </BranchingRulesWrapper>
    </TabPanelWrapper>
  );
};

export default BranchingRules;
