import React from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell, { TableCellProps } from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import styled from 'styled-components';

export type DataTableColumn = {
  id: string;
  label: string;
  minWidth: number | string;
  maxWidth?: number | string;
  align?: TableCellProps['align'];
  format?: (value: any) => any;
};

const Wrapper = styled.div.attrs({
  className: 'data-table',
})`
  display: flex;
  overflow: hidden;

  .MuiPaper-root {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
    font-family: inherit;
    border-bottom: 1px solid rgb(218, 218, 218);

    .MuiTableContainer-root {
      display: flex;
      flex: 1;

      .MuiTableHead-root {
        .MuiTableCell-stickyHeader {
          background-color: #dadada;
        }

        .MuiTableCell-head {
          font-size: 14px;
          font-weight: bold;
          line-height: 1.29;
          letter-spacing: 0.16px;
          font-family: inherit;
          color: #333333;
          padding: 12px 16px;
        }
      }

      .MuiTableBody-root {
        .MuiTableRow-root {
          background-color: #f4f4f4;

          :hover {
            background-color: rgb(238, 238, 238);
          }

          .MuiTableCell-root {
            span {
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
              display: -webkit-inline-box;
            }
          }
        }
        .MuiTableCell-body {
          font-size: 14px;
          line-height: 1.29;
          color: #333333;
          font-family: inherit;

          .primary {
            cursor: pointer;
            color: #1d84ff;

            :hover {
              color: #1d84ff;
            }
          }

          .MuiChip-label {
            display: flex !important;
          }
        }
      }
    }
  }
`;

export default function DataTable({ columns, rows }: { columns: DataTableColumn[]; rows: any[] }) {
  return (
    <Wrapper>
      <Paper square>
        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{
                      minWidth: column.minWidth,
                      maxWidth: column?.maxWidth ?? column.minWidth,
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => {
                return (
                  <TableRow key={row.id}>
                    {columns.map((column) => {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format ? (
                            column.format(row)
                          ) : (
                            <span
                              title={row[column.id]}
                              style={{
                                maxWidth: column?.maxWidth,
                              }}
                            >
                              {row[column.id] ?? '-N/A-'}
                            </span>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Wrapper>
  );
}
