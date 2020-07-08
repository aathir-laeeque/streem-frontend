import { Properties } from '#store/properties/types';
import { ArrowDropDown, Search } from '@material-ui/icons';
import React, { FC, useEffect, useRef } from 'react';
import { Checklist } from 'src/views/Checklists/types';
import { Job } from 'src/views/Jobs/types';
import styled from 'styled-components';

import { Button, FlatButton } from './Button';

interface ListViewProps {
  primaryButtonText: string;
  properties: Properties;
  data: Checklist[] | Job[];
  fetchData: (page: number, size: number) => void;
  isLast: boolean;
  currentPage: number;
  beforeColumns?: {
    header: string;
    template: (item: any, index: number) => JSX.Element;
  }[];
}

const Wrapper = styled.div.attrs({})`
  height: inherit;

  .list-header {
    display: flex;
    padding: 13px 15px 13px 0px;
    border-bottom: 1px solid #999999;
  }

  .list-options {
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
    display: flex;
    padding: 8px 16px;
    align-items: center;
    border-top: 1px solid #dadada;
    border-top-left-radius: 10px;
  }

  .list-header-columns {
    flex: 1;
    font-size: 12px;
    color: #999999;
    font-weight: bold;
    letter-spacing: 1px;
    display: flex;
    align-items: center;

    :first-child {
      width: 30%;
      flex: initial;
      margin-left: 0px;
      padding-left: 40px;
    }
  }

  .list-body {
    overflow-x: auto;
    overflow-y: scroll;
    height: calc(100% - 88px);
  }

  .list-card {
    border-bottom: 1px solid #dadada;
    height: 80px;
    display: flex;
  }

  .list-card-columns {
    flex: 1;
    font-size: 12px;
    color: #666666;
    font-weight: bold;
    letter-spacing: 1px;
    display: flex;
    align-items: center;

    :first-child {
      width: 30%;
      flex: initial;
    }
  }

  .list-title {
    font-size: 16px;
    font-weight: 600;
    color: #12aab3;
    cursor: pointer;
  }

  .title-group {
    display: flex;
    margin-top: -10px;
    flex-direction: column;
  }

  .list-code {
    font-size: 11px;
    line-height: 14px;
    font-weight: 600;
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
    color: #12aab3;
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
    color: #12aab3;
    margin-right: -5px;
    font-size: 13px;
  }
`;

export const ListView: FC<ListViewProps> = ({
  primaryButtonText,
  properties,
  data,
  fetchData,
  isLast,
  currentPage,
  beforeColumns,
}) => {
  const scroller = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scroller && scroller.current) {
      const div = scroller.current;
      div.addEventListener('scroll', handleOnScroll);
      return () => {
        div.removeEventListener('scroll', handleOnScroll);
      };
    }
  }, [isLast]);

  const handleOnScroll = (e) => {
    if (scroller && scroller.current && e.target) {
      if (
        e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight &&
        !isLast
      ) {
        fetchData(currentPage + 1, 10);
      }
    }
  };

  return (
    <Wrapper>
      <div className="list-options">
        <FlatButton>
          Filters <ArrowDropDown style={{ fontSize: 20, color: '#12aab3' }} />
        </FlatButton>
        <div className="searchboxwrapper">
          <input className="searchbox" type="text" placeholder="Search" />
          <Search className="searchsubmit" />
        </div>
        <span className="resetOption">Reset</span>
        <Button style={{ marginLeft: `auto`, marginRight: 0 }}>
          {primaryButtonText}
        </Button>
      </div>
      <div className="list-header">
        {beforeColumns &&
          beforeColumns.length &&
          beforeColumns.map((beforeColumn) => (
            <div
              key={`beforeColumn_${beforeColumn.header}`}
              className="list-header-columns"
            >
              {beforeColumn.header}
            </div>
          ))}
        {properties.map((el, index) => (
          <div key={index} className="list-header-columns">
            {el.name}
          </div>
        ))}
      </div>
      <div className="list-body" ref={scroller}>
        {(data as Array<Checklist | Job>).map((el, index) => (
          <div key={index} className="list-card">
            {beforeColumns &&
              beforeColumns.length &&
              beforeColumns.map((beforeColumn) =>
                beforeColumn.template(el, index),
              )}
            {properties.map((property, propertyIndex) => (
              <div key={propertyIndex} className="list-card-columns">
                {el.properties &&
                property &&
                property.name &&
                el.properties[property.name]
                  ? el.properties[property.name]
                  : '-N/A-'}
              </div>
            ))}
          </div>
        ))}
      </div>
    </Wrapper>
  );
};
