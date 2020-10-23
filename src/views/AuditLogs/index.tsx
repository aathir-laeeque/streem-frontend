// import React, { FC } from 'react';

// import MemoUnderConstruction from '#assets/svg/UnderConstruction';
// import { AuditLogsViewProps } from './types';

// const AuditLogsView: FC<AuditLogsViewProps> = () => (
//   <div>
//     <MemoUnderConstruction />
//   </div>
// );

// export default AuditLogsView;

import * as React from 'react';
import {
  createStyles,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Theme,
  withStyles,
} from '@material-ui/core';
import { useTypedSelector } from '#store';
import { fetchChecklists } from '#views/Checklists/ListView/actions';
import { ListViewState } from '#views/Checklists/ListView/types';
import { useDispatch } from 'react-redux';
import { ComposerEntity } from '#Composer-new/types';
import { fetchProperties } from '#store/properties/actions';
import { useEffect } from 'react';
import { Properties } from '#store/properties/types';

const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }),
)(TableCell);

const StyledTableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }),
)(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

const generateColumns = (properties: Properties) => {
  const columns = properties.map((pro) => pro.placeHolder);
  return ['Name', 'Checklist ID', ...columns];
};

export default function DataGridDemo() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { checklists, pageable, loading }: ListViewState = useTypedSelector(
    (state) => state.checklistListView,
  );
  const { checklist, job } = useTypedSelector((state) => state.properties);

  const fetchData = (page: number, size: number) => {
    dispatch(fetchChecklists({ page, size, sort: 'createdAt,desc' }));
  };

  useEffect(() => {
    fetchData(0, 10);

    if (!job?.length) {
      dispatch(fetchProperties({ type: ComposerEntity.JOB }));
    }
    if (!checklist?.length) {
      dispatch(fetchProperties({ type: ComposerEntity.CHECKLIST }));
    }
  }, []);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    console.log(newPage);
  };

  const columns = generateColumns(checklist);

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <StyledTableCell key={col}>{col}</StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {checklists.map((row) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell component="th" scope="row">
                  {row.name}
                </StyledTableCell>
                <StyledTableCell>{row.code}</StyledTableCell>
                {row.properties &&
                  row.properties.length > 0 &&
                  row.properties?.map((pro) => (
                    <StyledTableCell key={pro.id}>{pro.value}</StyledTableCell>
                  ))}
              </StyledTableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[]}
                colSpan={2}
                count={pageable.totalElements}
                rowsPerPage={pageable.pageSize}
                page={pageable.page}
                SelectProps={{
                  inputProps: { 'aria-label': 'rows per page' },
                  native: true,
                }}
                onChangePage={handleChangePage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </div>
  );
}
