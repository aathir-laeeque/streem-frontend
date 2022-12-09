import React, { FC, useState } from 'react';
import { Chip } from '@material-ui/core';
import styled from 'styled-components';
import { MandatoryParameter } from '#JobComposer/checklist.types';

import Tooltip from '@material-ui/core/Tooltip';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

const TooltipWrapper = styled.div.attrs({
  className: 'tooltip-wrapper',
})`
  padding-inline: 4px;
  border-top: 1px solid #f4f4f4;

  .MuiTooltip-tooltip {
    background-color: #393939;
    padding: 8px 16px;
    border-radius: 2px;
  }
  .MuiTooltip-tooltipPlacementBottom,
  .MuiTooltip-tooltipPlacementTop {
    margin: 8px 0px;
  }

  .MuiTooltip-arrow {
    color: #393939;
  }
`;

const DetailsPopover = ({ item, parameterId }) => {
  const [openTooltip, setOpenTooltip] = useState(false);

  const handleTooltipClose = () => {
    setOpenTooltip(false);
  };

  const content = (type, process) => {
    let contentString;

    switch (type) {
      case MandatoryParameter.SHOULD_BE:
        contentString = process.data.value;
        break;
      case MandatoryParameter.MULTI_LINE:
      case MandatoryParameter.SINGLE_LINE:
      case MandatoryParameter.NUMBER:
      case MandatoryParameter.DATE:
        contentString = process.response.value;
        break;
      case MandatoryParameter.YES_NO:
        contentString = contentDetails(process.data, process.response);
        break;
      case MandatoryParameter.SINGLE_SELECT:
        contentString = contentDetails(process.data, process.response);
        break;
      case MandatoryParameter.RESOURCE:
        contentString = process.response.choices.reduce(
          (acc, currChoice) => (acc = currChoice.objectDisplayName),
          '',
        );
        break;
      case MandatoryParameter.MULTISELECT:
        contentString = contentDetails(process.data, process.response);
        break;
      default:
        return;
    }

    return contentString;
  };

  const contentDetails = (data, response) => {
    let detailList = [];
    data.forEach((currData) => {
      if (response.choices[currData.id] === 'SELECTED') {
        return detailList.push(`${currData.name}${response.reason ? ` :${response.reason}` : ''}`);
      }
    });
    return detailList.join(', ');
  };

  return (
    <TooltipWrapper>
      <ClickAwayListener onClickAway={handleTooltipClose}>
        <div>
          <Tooltip
            PopperProps={{
              disablePortal: true,
            }}
            onClose={handleTooltipClose}
            open={openTooltip}
            disableFocusListener
            disableHoverListener
            disableTouchListener
            arrow
            title={
              <div>
                {content(item.parameterValues[parameterId]?.type, item.parameterValues[parameterId])
                  ?.split(', ')
                  ?.map((str) => (
                    <div>{str}</div>
                  ))}
              </div>
            }
          >
            <Chip
              key={item.id}
              label={
                <div
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setOpenTooltip(true);
                  }}
                >
                  {content(
                    item.parameterValues[parameterId]?.type,
                    item.parameterValues[parameterId],
                  )?.length > 10
                    ? `${content(
                        item.parameterValues[parameterId]?.type,
                        item.parameterValues[parameterId],
                      )?.substring(0, 10)}...`
                    : content(
                        item.parameterValues[parameterId]?.type,
                        item.parameterValues[parameterId],
                      )}
                </div>
              }
            />
          </Tooltip>
        </div>
      </ClickAwayListener>
    </TooltipWrapper>
  );
};

export default DetailsPopover;
