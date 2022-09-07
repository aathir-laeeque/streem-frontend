import { Job } from '#views/Jobs/ListView/types';
import { Chip, Popover } from '@material-ui/core';
import PopupState, { bindPopover, bindToggle } from 'material-ui-popup-state';
import React from 'react';

const MoreDetails = ({ item }: { item: Job }) => {
  if (!item?.['relations']?.length) return <span>-</span>;
  return (
    <>
      {item['relations'].map((relation) => {
        const content = relation.targets
          .map((target) => `${target.displayName} (ID: ${target.externalId})`)
          .join('\n');
        return (
          <PopupState variant="popover" popupId={item.id}>
            {(popupState) => (
              <div>
                <Chip
                  key={relation.id}
                  style={{ margin: '4px 8px 0 0' }}
                  label={
                    <span style={{ cursor: 'pointer' }} title={content}>
                      {relation.displayName} {' : '}
                      {content.length > 10 ? `${content.substring(0, 10)}...` : content}
                    </span>
                  }
                  {...bindToggle(popupState)}
                />
                <Popover
                  {...bindPopover(popupState)}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                >
                  <div style={{ padding: '4px' }}>
                    <pre>{content}</pre>
                  </div>
                </Popover>
              </div>
            )}
          </PopupState>
        );
      })}
    </>
  );
};

export default MoreDetails;
