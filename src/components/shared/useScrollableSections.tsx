import { capitalize } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import useScrollSpy from '#utils/useScrollSpy';

const LabelsWrapper = styled.div.attrs({
  className: 'scrollable-labels',
  id: 'scrollable-labels',
})`
  display: flex;
  flex-direction: column;
  padding: 16px;
  overflow: auto;

  h1 {
    margin: 0 0 24px;
    font-size: 1.9vw;
    line-height: 1.25;
    color: #333333;
  }

  .label {
    padding: 8px 10px;
    font-size: 14px;
    font-weight: normal;
    color: #999999;
    line-height: 1.14;
    letter-spacing: 0.16px;
    border-left: 2px solid #dadada;
    text-decoration: none;
    cursor: pointer;

    :hover {
      color: #333333;
      border-left: 2px solid #333333;
    }
  }

  .label.active {
    border-left: 2px solid #1d84ff;
    font-weight: bold;
    color: #333333;
  }
`;

const ViewsWrapper = styled.div.attrs({
  className: 'scrollable-views',
  id: 'scrollable-views',
})`
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: auto;
  margin: 16px 0px;
  padding: 0px 16px;

  h4 {
    padding: 16px;
    font-size: 20px;
    font-weight: 600;
    line-height: 1.2;
    color: #333333;
    margin: unset;
    border-bottom: solid 1px #dadada;
  }

  .view {
    background: #fff;
    margin-bottom: 24px;

    :last-child {
      margin-bottom: unset;
    }
  }
`;

type Item = {
  label: string;
  view: JSX.Element;
};

export type useScrollableSectionsProps = {
  title: string;
  items: Item[];
};

type useScrollableSectionsState = {
  paddingBottom: number;
};

export function useScrollableSections({
  title,
  items,
}: useScrollableSectionsProps) {
  const [state, setState] = useState<useScrollableSectionsState>({
    paddingBottom: 0,
  });
  const { paddingBottom } = state;
  const itemsRef = useRef<Array<HTMLDivElement>>([]);
  const scrollTarget = useRef<HTMLDivElement>(null);
  const contentTarget = useRef<HTMLDivElement>(null);

  const selectedIndex = useScrollSpy({
    itemsRef,
    scrollTarget,
    contentTarget,
  });

  const updateSize = () => {
    if (
      scrollTarget.current &&
      contentTarget.current &&
      itemsRef.current.length
    ) {
      const scrollHeight = scrollTarget.current.clientHeight;
      const lastItemHeight =
        itemsRef.current[itemsRef.current.length - 1].clientHeight;
      const padding = scrollHeight - lastItemHeight;
      setState({
        paddingBottom: padding,
      });
    }
  };

  const scrollToSection = (index: number) => {
    itemsRef.current[index]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  useEffect(() => {
    updateSize();
  }, []);

  useEffect(() => {
    itemsRef.current = itemsRef.current.slice(0, items.length);
  }, [items.length]);

  const renderLabels = (): JSX.Element => (
    <LabelsWrapper>
      <h1>{title}</h1>
      {items.map((item, index) => (
        <a
          key={`section_label_${index}`}
          className={`label ${index === selectedIndex && 'active'}`}
          onClick={() => scrollToSection(index)}
        >
          {capitalize(item.label)}
        </a>
      ))}
    </LabelsWrapper>
  );

  const renderViews = (): JSX.Element => (
    <ViewsWrapper ref={scrollTarget}>
      <div ref={contentTarget} style={{ paddingBottom }}>
        {items.map(({ view: View, label }, index) => (
          <div
            className="view"
            id={`section_view_${index}`}
            key={`section_view_${index}`}
            ref={(el) => (itemsRef.current[index] = el as HTMLDivElement)}
          >
            {label && <h4>{label}</h4>}
            {View}
          </div>
        ))}
      </div>
    </ViewsWrapper>
  );

  return { renderLabels, renderViews };
}
