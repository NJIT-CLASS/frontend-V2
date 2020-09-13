import React from 'react'
import PropTypes from "prop-types"

import MaUTable from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableContainer from "@material-ui/core/TableContainer";
import {usePagination, useTable} from 'react-table'
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import PLTooltip from "../PLTooltip/PLTooltip";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Grid from "@material-ui/core/Grid";


const useStyle = makeStyles((theme) => ({
   tableHeadFont: {
       fontSize: theme.table.head.fontSize,
       fontWeight: theme.table.body.fontWeight
   },

    tableFont: {
        fontSize: theme.table.body.fontSize,
    },

    tableRowRoot: {
        "&:nth-of-type(odd)": {
            backgroundColor: theme.palette.action.hover,
        }
    },

    grow: {
       flexGrow: 1
    },

    pagination: {
       "& p": {
           margin: "0 0.5rem 0 1rem",
           fontSize: "0.75rem"
       },
        "& button": {
           padding: "0.5rem"
        }
    }

}));

const PLTable = ({ columns, data, rowsPerPage, rowsPerPageOptions, dense  }) => {
    const classes = useStyle();

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0, pageSize:rowsPerPage },
        },
        usePagination
    );

    const emptyRows = pageSize - Math.min(pageSize, data.length - pageIndex * pageSize);
    // Render the UI for your table
    return (
        <React.Fragment>
            <TableContainer>
                <MaUTable {...getTableProps()} size={dense?"small":"medium"}>
                    <TableHead>
                        {headerGroups.map(headerGroup => (
                            <TableRow {...headerGroup.getHeaderGroupProps()} >
                                {headerGroup.headers.map(column => (
                                    <TableCell {...column.getHeaderProps()} >
                                        <Typography variant={"h6"} classes={{h6: classes.tableHeadFont}} noWrap>
                                            {column.render('Header')}
                                        </Typography>
                                    </TableCell>
                                ))}
                            </TableRow>
                    ))}
                    </TableHead>
                    <TableBody {...getTableBodyProps()}>
                        {page.map((row) => {
                            prepareRow(row);
                            return (
                                <TableRow {...row.getRowProps()} classes={{root: classes.tableRowRoot}} hover>
                                    {row.cells.map(cell => {
                                        return (
                                            <TableCell {...cell.getCellProps()}>
                                                <Typography variant={"h6"} classes={{h6: classes.tableFont}} noWrap>
                                                    {cell.render('Cell')}
                                                </Typography>
                                            </TableCell>
                                        )
                                    })}
                                </TableRow>
                            )
                        })}
                        {emptyRows > 0 && (
                            <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                                <TableCell colSpan={6} />
                            </TableRow>
                        )}
                    </TableBody>
                </MaUTable>
            </TableContainer>

            <Toolbar className={classes.pagination}>
                <Grid container justify={"center"} alignItems={"center"} direction={"row"}>
                    <div className={classes.grow}/>
                    <Typography variant={"body2"}>Rows per page:</Typography>
                    <Select
                        value={pageSize}
                        onChange={e => {
                            setPageSize(Number(e.target.value))
                        }}
                    >
                        {rowsPerPageOptions.map(pageSize => (
                            <MenuItem key={pageSize} value={pageSize}>
                                <Typography>{pageSize}</Typography>
                            </MenuItem>
                        ))}
                    </Select>
                    <Typography>Page{' '}<strong>{pageIndex + 1} of {pageOptions.length}</strong>{' '}</Typography>

                    <PLTooltip text={"Go to First Page"}>
                        <span>
                            <IconButton onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                                {'<<'}
                            </IconButton>
                        </span>
                    </PLTooltip>
                    <PLTooltip text={"Previous Page"}>
                        <span>
                            <IconButton  onClick={() => previousPage()} disabled={!canPreviousPage}>
                                {'<'}
                            </IconButton>
                        </span>
                    </PLTooltip>
                    <PLTooltip text={"Next Page"}>
                        <span>
                             <IconButton onClick={() => nextPage()} disabled={!canNextPage}>
                                {'>'}
                            </IconButton>
                        </span>
                    </PLTooltip>
                    <PLTooltip text={"Go to Last Page"}>
                        <span>
                             <IconButton onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                                {'>>'}
                            </IconButton>
                        </span>
                    </PLTooltip>
                </Grid>
            </Toolbar>
        </React.Fragment>
    )
};

PLTable.defaultProps = {
    rowsPerPage: 10,
    rowsPerPageOptions: [5, 10, 15],
    dense: true
};

PLTable.propTypes = {
    rowsPerPage: PropTypes.number,
    rowsPerPageOptions: PropTypes.array,
    dense: PropTypes.bool
};

export default PLTable;


