import { ArrowLeft, ArrowRight } from '@material-ui/icons';
import React, { FC } from 'react';
import { FilterField, Pageable } from '#utils/globalTypes';
import { DEFAULT_PAGE_SIZE } from '#utils/constants';

export type PaginatedFetchData = {
  filters?: FilterField[];
  page?: number;
  size?: number;
};

export const Pagination: FC<{
  pageable: Pageable;
  pageSize?: number;
  fetchData: ({ filters, page, size }: PaginatedFetchData) => void;
}> = ({ pageable, pageSize, fetchData }) => {
  const showPaginationArrows = pageable.totalPages > 10;

  return (
    <div className="pagination">
      <ArrowLeft
        className={`icon ${showPaginationArrows ? '' : 'hide'}`}
        onClick={() => {
          if (pageable.page > 0) {
            fetchData({
              page: pageable.page - 1,
              size: pageSize || DEFAULT_PAGE_SIZE,
            });
          }
        }}
      />
      {Array.from({ length: pageable.totalPages }, (_, i) => i)
        .slice(Math.floor(pageable.page / 10) * 10, Math.floor(pageable.page / 10) * 10 + 10)
        .map((el) => (
          <span
            key={el}
            className={pageable.page === el ? 'active' : ''}
            onClick={() =>
              fetchData({
                page: el,
                size: pageSize || DEFAULT_PAGE_SIZE,
              })
            }
          >
            {el + 1}
          </span>
        ))}
      <ArrowRight
        className={`icon ${showPaginationArrows ? '' : 'hide'}`}
        onClick={() => {
          if (pageable.page < pageable.totalPages - 1) {
            fetchData({
              page: pageable.page + 1,
              size: pageSize || DEFAULT_PAGE_SIZE,
            });
          }
        }}
      />
    </div>
  );
};
