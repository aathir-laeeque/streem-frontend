import { Properties } from '#store/properties/types';
// library imports
import React, { FC } from 'react';
import styled from 'styled-components';
import { ArrowDropDown, Search } from '@material-ui/icons';
// relative imports
import { Checklist } from 'src/views/Checklists/types';
import { FlatButton, Button } from './Button';

interface ListViewProps {
  nameItemTemplate: (item: any) => JSX.Element;
  primaryButtonText: string;
  properties: Properties;
  data: Checklist[];
}

const Wrapper = styled.div.attrs({})`
  .list-header {
    display: flex;
    padding: 13px 0px 13px 0px;
    border-bottom: 1px solid #999999;
  }

  .list-options {
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
    display: flex;
    padding: 8px 16px;
    align-items: center;
  }

  .list-header-columns {
    flex: 1;
    font-size: 12px;
    color: #666666;
    font-weight: bold;
    letter-spacing: 1px;
    display: flex;
    align-items: center;

    :first-child {
      width: 35%;
      flex: initial;
    }
  }

  .list-body {
    overflow: scroll;
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
      width: 35%;
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
    height: 31px;
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
`;

export const ListView: FC<ListViewProps> = ({
  nameItemTemplate,
  primaryButtonText,
  properties,
  data,
}) => (
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
      <div className="list-header-columns">
        <span style={{ marginLeft: 40 }}></span>NAME
      </div>
      {properties.map((el, index) => (
        <div key={index} className="list-header-columns">
          {el.name}
        </div>
      ))}
    </div>
    <div className="list-body">
      {data.map((el, index) => (
        <div key={index} className="list-card">
          {nameItemTemplate(el)}
          {properties.map((property, propertyIndex) => (
            <div key={propertyIndex} className="list-card-columns">
              {el.properties &&
              property &&
              property.name &&
              el.properties[property.name]
                ? el.properties[property.name]
                : ''}
            </div>
          ))}
        </div>
      ))}
    </div>
  </Wrapper>
);
