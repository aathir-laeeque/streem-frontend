import React, { FC, useState } from 'react';
import { Chip } from '@material-ui/core';
import styled from 'styled-components';
import Tooltip from '@material-ui/core/Tooltip';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { getParameterContent } from '#utils/parameterUtils';

const TooltipWrapper = styled.div.attrs({
  className: 'tooltip-wrapper',
})`
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

  .MuiChip-root {
    padding: 4px 8px;
    border-radius: 50px;
    height: 24px;
  }
`;

const DetailsPopover = ({ item, parameterId }) => {
  const [openTooltip, setOpenTooltip] = useState(false);

  const handleTooltipClose = () => {
    setOpenTooltip(false);
  };

  const contentString = getParameterContent(item.parameterValues[parameterId]);

  return (
    <TooltipWrapper>
      <ClickAwayListener onClickAway={handleTooltipClose}>
        <div>
          {contentString ? (
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
                  {contentString?.split(', ')?.map((str) => (
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
                    {contentString?.length > 32
                      ? `${contentString?.substring(0, 32)}...`
                      : contentString}
                  </div>
                }
              />
            </Tooltip>
          ) : (
            '-'
          )}
        </div>
      </ClickAwayListener>
    </TooltipWrapper>
  );
};

export default DetailsPopover;
