import NestedMenuItem from '#components/shared/NestedMenuItem';
import { JobAuditLogType } from '#JobComposer/JobAuditLogs/types';
import { ChecklistAuditLogsType } from '#PrototypeComposer/ChecklistAuditLogs/types';
import { SessionActivity } from '#views/UserAccess/ListView/SessionActivity/types';
import Menu from '@material-ui/core/Menu';
import { ArrowDropDown, Search } from '@material-ui/icons';
import { noop } from 'lodash';
import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { Button, FlatButton } from './Button';

type Filter = {
  label: string;
  content: JSX.Element | (() => JSX.Element);
  onApply: () => void;
};

export type FilterProp = {
  filters: Filter[];
  onReset: () => void;
  activeCount: number;
};

type DataType =
  | Record<string, string | SessionActivity[]>
  | Record<string, string | JobAuditLogType[]>
  | Record<string, string | ChecklistAuditLogsType[]>;

type ExtraColumn = {
  header: string;
  template: (item: DataType, index: number) => JSX.Element;
};

interface ListViewProps {
  primaryButtonText?: string;
  onPrimaryClick?: () => void;
  filterProp?: FilterProp;
  callOnScroll?: boolean;
  data: DataType[];
  fetchData: (page: number, size: number) => void;
  isLast: boolean;
  currentPage: number;
  isSearchable?: boolean;
  beforeColumns?: ExtraColumn[];
  afterColumns?: ExtraColumn[];
}

const Wrapper = styled.div.attrs({})`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;

  .list-header {
    display: flex;
    padding: 13px 0px 13px 0px;
    border-bottom: 1px solid #999999;
  }

  .list-options {
    display: flex;
    padding: 8px 16px;
    align-items: center;
  }

  .list-body {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: auto;
  }

  .list-card {
    border-bottom: 1px solid #dadada;
    display: flex;
  }

  .list-header-columns {
    flex: 1;
    font-size: 12px;
    color: #999999;
    flex-wrap: wrap;
    font-weight: bold;
    letter-spacing: 1px;
    padding: 0 12px;
    overflow-wrap: anywhere;
    display: flex;
    align-items: center;

    :first-child {
      width: 30%;
      flex: initial;
    }
  }

  .list-card-columns {
    flex: 1;
    flex-wrap: wrap;
    font-size: 14px;
    color: #666666;
    padding: 16px 12px;
    font-weight: 600;
    overflow-wrap: anywhere;
    display: flex;
    align-items: center;
    word-break: break-all;

    :first-child {
      width: 30%;
      flex: initial;
    }
  }

  .list-title {
    font-size: 20px;
    padding: 4px 0px;
    font-weight: 600;
    color: #1d84ff;
    cursor: pointer;
    align-items: center;
    display: flex;
    text-transform: capitalize;
  }

  .title-group {
    display: flex;
    flex-direction: column;
  }

  .list-code {
    padding-bottom: 4px;
    font-size: 14px;
    line-height: 14px;
    color: #333333;
  }

  .searchboxwrapper {
    position: relative;
    margin-right: 16px;
  }

  .searchbox {
    border: none;
    border-bottom: 1px solid #999999;
    outline: none;
    font-size: 13px;
    font-family: 'Open Sans', sans-serif;
    font-weight: lighter;
    color: #999999;
    width: 180px;
    height: 29px;
    background: #fff;
    padding-left: 10px;
  }

  .searchsubmit {
    width: 14px;
    height: 29px;
    position: absolute;
    top: 0;
    right: 0;
    background: #fff;
    border: none;
    border-bottom: 1px solid #999999;
    color: #999999;
    cursor: pointer;
  }

  .resetOption {
    cursor: pointer;
    color: #1d84ff;
    font-size: 11px;
    font-weight: 600;
    font-style: italic;
  }

  .user-thumb {
    width: 34px;
    height: 34px;
    border-radius: 17px;
    border: solid 1.5px #fff;
    align-items: center;
    background-color: #f7f9fa;
    justify-content: center;
    display: flex;
    color: #1d84ff;
    margin-right: -5px;
    font-size: 13px;
    cursor: pointer;
  }
`;

export const InfiniteListView: FC<ListViewProps> = ({
  primaryButtonText,
  onPrimaryClick = () => noop,
  data,
  fetchData,
  isLast,
  currentPage,
  beforeColumns,
  afterColumns,
  filterProp,
  callOnScroll = true,
  isSearchable = true,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleOnScroll = (e: React.UIEvent<HTMLElement>) => {
    e.stopPropagation();
    if (callOnScroll) {
      const { scrollHeight, scrollTop, clientHeight } = e.currentTarget;
      if (scrollTop + clientHeight >= scrollHeight - clientHeight * 0.7 && !isLast)
        fetchData(currentPage + 1, 10);
    }
  };

  const onApplyFilter = (e: React.MouseEvent, onApply: () => void) => {
    e.stopPropagation();
    onApply();
    handleClose();
  };

  return (
    <Wrapper>
      <div className="list-options">
        {filterProp && (
          <>
            <FlatButton aria-controls="top-menu" aria-haspopup="true" onClick={handleOpen}>
              {filterProp?.activeCount !== 0 ? `${filterProp?.activeCount} Filters` : 'Filters '}
              <ArrowDropDown style={{ fontSize: 20, color: '#1d84ff' }} />
            </FlatButton>
            <Menu
              id="filter-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
              style={{ marginTop: 40 }}
            >
              {filterProp.filters.map((filter) => {
                return (
                  <NestedMenuItem
                    key={`filter_${filter.label}`}
                    right
                    disabled={true}
                    label={filter.label}
                    mainMenuOpen={anchorEl ? true : false}
                  >
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      onKeyDown={(e) => e.stopPropagation()}
                      className="filter-container"
                    >
                      {typeof filter.content === 'function' ? filter.content() : filter.content}
                      <div className="picker-actions">
                        <Button
                          style={{ marginRight: 0 }}
                          onClick={(e) => onApplyFilter(e, filter.onApply)}
                        >
                          Apply Filter
                        </Button>
                      </div>
                    </div>
                  </NestedMenuItem>
                );
              })}
            </Menu>
          </>
        )}
        {isSearchable && (
          <div className="searchboxwrapper">
            <input className="searchbox" type="text" placeholder="Search" />
            <Search className="searchsubmit" />
          </div>
        )}
        {filterProp?.activeCount && filterProp?.activeCount > 0 ? (
          <span className="resetOption" onClick={filterProp?.onReset}>
            Reset
          </span>
        ) : null}
        {primaryButtonText && (
          <Button style={{ marginLeft: `auto`, marginRight: 0 }} onClick={onPrimaryClick}>
            {primaryButtonText}
          </Button>
        )}
      </div>
      <div className="list-header">
        {beforeColumns?.map((beforeColumn) => (
          <div key={`beforeColumn_${beforeColumn.header}`} className="list-header-columns">
            {beforeColumn.header}
          </div>
        ))}
        {afterColumns?.map((afterColumn) => (
          <div key={`afterColumn_${afterColumn.header}`} className="list-header-columns">
            {afterColumn.header}
          </div>
        ))}
      </div>
      <div className="list-body" onScroll={handleOnScroll}>
        {data.map((el, index) => (
          <div key={`list_el_${el.id}`} className="list-card">
            {beforeColumns?.map((beforeColumn) => beforeColumn.template(el, index))}
            {afterColumns?.map((afterColumn) => afterColumn.template(el, index))}
          </div>
        ))}
      </div>
    </Wrapper>
  );
};
