// Inspired by MUI documentation: https://mui.com/components/tables/
import React, { useState, forwardRef, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import { visuallyHidden } from "@mui/utils";
import { Button, DialogContent, Snackbar, TextField } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { getRepoForks } from "./repository";
import { getTotalForksNumber } from "./repository";
import Loading from "./common/Loading"
import Filter from "./common/Filter";
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import isEmpty from "lodash/isEmpty";
import { usePage } from "./PageContext";
import { useAuth } from "./AuthContext";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ChatBot from './react-simple-chatbot/ChatBot';
import { ThemeProvider } from 'styled-components';
import axios from "axios";
import { SERVER } from "./common/constants";

const GeneralQuestionComponent = ({ steps, triggerNextStep, repoName }) => {
  const [response, setResponse] = useState('');
  const { user } = useAuth();
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(repoName);
        const result = await axios({
          method: 'POST',
          url: `${SERVER}/flask/chat`,
          data: {
            message: steps['api_call_general_question'].message,
            repo: repoName,
          },
          headers: {
            'Authorization': JSON.stringify(user)
          },
        });
        const data = result.data;
        setResponse(data['message']); // Assume the API returns a JSON object with a message field
        triggerNextStep({ value: data.message, trigger: 'Ask_again' });
      } catch (error) {
        console.error('API call failed:', error);
        triggerNextStep({ value: 'Sorry, I encountered an error.', trigger: 'error_step' });
      }
    };

    fetchData();
  }, []);

  return <div>{response ? response : 'Loading...'}</div>;
};


const ForkSpecificQuestionComponent = ({ steps, triggerNextStep, repoName}) => {
  const [response, setResponse] = useState('');
  const { user } = useAuth();
  useEffect(() => {
    const fetchData = async () => {
      console.log({
        message: steps['api_call_fork_specific_question'].message,
        repo: repoName,
        fork: steps['4'].value,
      });
      try {
        console.log(repoName);
        const result = await axios({
          method: 'POST',
          url: `${SERVER}/flask/chat`,
          data: {
            message: steps['api_call_fork_specific_question'].message,
            repo: repoName,
            fork: steps['4'].value,
          },
          headers: {
            'Authorization': JSON.stringify(user)
          },
        });
        const data = result.data;
        setResponse(data['message']); // Assume the API returns a JSON object with a message field
        triggerNextStep({ value: data.message, trigger: 'Ask_again' });
      } catch (error) {
        console.error('API call failed:', error);
        triggerNextStep({ value: 'Sorry, I encountered an error.', trigger: 'error_step' });
      }
    };

    fetchData();
  }, []);

  return <div>{response ? response : 'Loading...'}</div>;
};


const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function createData(
  fork_name,
  num_changed_files,
  changed_files,
  num_changed_lines,
  total_commit_number,
  key_words,
  last_committed_time,
  created_time,
  ai_summary
) {

  // console.log("key words received:", key_words)
  let parsed_words = [];
  for (let i = 0; i < key_words.length && i < 10; i++) {
    parsed_words.push(key_words[i].concat(", "));
  }

  let parsed_files = [];
  for (let i = 0; i < changed_files.length && i < 10; i++) {
    parsed_files.push(changed_files[i].concat(", "));
  }
  // console.log("Parsed words:", parsed_words)

  return {
    fork_name,
    num_changed_files,
    parsed_files,
    changed_files,
    num_changed_lines,
    total_commit_number,
    parsed_words,
    key_words,
    last_committed_time,
    created_time,
    ai_summary
  };
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "fork_name",
    numeric: false,
    disablePadding: true,
    label: "Fork",
  },
  {
    id: "num_changed_files",
    numeric: false,
    disablePadding: false,
    label: "Changed Files",
  },
  // {
  //   id: "changed_files",
  //   numeric: false,
  //   disablePadding: false,
  //   label: "File List",
  // },
  {
    id: "num_changed_lines",
    numeric: false,
    disablePadding: false,
    label: "Changed Lines",
  },
  {
    id: "total_commit_number",
    numeric: false,
    disablePadding: false,
    label: "Commits",
  },
  // {
  //   id: "keywords",
  //   numeric: false,
  //   disablePadding: false,
  //   label: "Keywords",
  // },
  {
    id: "last_committed_time",
    numeric: false,
    disablePadding: false,
    label: "Last Commit",
  }
  // , {
  //   id: "created_time",
  //   numeric: false,
  //   disablePadding: false,
  //   label: "Creation Date",
  // },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    repoName,
    forkList
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const steps = [
    {
      id: '0',
      message: `Hello, what can I do for you today? Seems you are interested in the forks for ${repoName}. Are you looking into a specific fork or you are having general questions?`,

      // This calls the next id
      // i.e. id 1 in this case
      trigger: '1',
    }, {
      id: '1',
      options: [
        { value: 1, label: 'General Questions', trigger: '2' },
        { value: 2, label: 'A specific fork', trigger: '3' },
      ],
    }, {
      id: '2',

      // Here we want the user
      // to enter input
      message: 'Sure, what would you like to know about the forks? I am ready to help you.',
      trigger: 'api_call_general_question'// Jump to chatgpt
    }, {
      id: '2fork',

      // Here we want the user
      // to enter input
      message: 'Sure, what would you like to know about this fork? I am ready to help you.',
      trigger: 'api_call_fork_specific_question'// Jump to chatgpt
    },
     {
      id: '3',
      message: 'Which specific fork are you interested in?',
      trigger: 4
    }, {
      id: '4',
      options: forkList.map((row) => {
        return { value: row.fork_name, label: row.fork_name, trigger: '2fork' }
      }),
      // end: true
    }, {
      id: 'api_call_general_question',
      user: true,
      trigger: 'general_api_call'
      // end: true
    }, {
      id: 'api_call_fork_specific_question',
      user: true,
      trigger: 'fork_specific_api_call'
      // end: true
    }, {
      id: 'general_api_call',
      component: <GeneralQuestionComponent repoName={repoName} />,
      asMessage: true,
      waitAction: true,
      trigger: 'Ask_again',
    }, {
      id: 'Ask_again',
      message: 'Do you have any other questions I can help you with?',
      trigger: 'api_call_general_question'
    },
    {
      id: 'fork_specific_api_call',
      component: <ForkSpecificQuestionComponent repoName={repoName} />,
      asMessage: true,
      waitAction: true,
      trigger: 'Ask_again',
    },
    {
      id: 'error_step',
      message: 'Sorry, I encountered an error. Please try again.',
      trigger: '0'
    }
  ];

  const theme = {
    background: '#C9FF8F',
    fontFamily: 'Arial',
    headerBgColor: '#197B22',
    headerFontSize: '20px',
    botBubbleColor: '#0F3789',
    headerFontColor: 'white',
    botFontColor: 'white',
    userBubbleColor: '#FF5733',
    userFontColor: 'white',
    fontSize: '5px',
  };

  // Set some properties of the bot
  const config = {
    botAvatar: "logo512.png",
    floating: true,
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
          <div className="App">
            <ThemeProvider theme={theme}>
              <ChatBot

                // This appears as the header
                // text for the chat bot
                headerTitle="Forks-insight Chatbot"
                steps={steps}
                {...config}

              />
            </ThemeProvider>
          </div>
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  repoName: PropTypes.string.isRequired,
  forkList: PropTypes.array.isRequired
};

const EnhancedTableToolbar = (props) => {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected

        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {/* Search Results */}

        </Typography>

      )}

      {/* {numSelected > 0 ? (
        <>
          <Tooltip title="Delete">
            <IconButton onClick={props.onDelete}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>

        </>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )} */}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onDelete: PropTypes.func.isRequired,
};

const EnhancedTable = ({ data }) => {
  console.log("data", data);
  const rows = [];

  data.forEach((value) => {
    rows.push(
      createData(
        value.fork_name,
        value.num_changed_files ?? 0,
        value.changed_files,
        value.num_changed_lines ?? 0,
        value.total_commit_number ?? 0,
        value.key_words,
        value.last_committed_time,
        value.created_time,
        value.ai_summary
      )
    );
  });
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("num_changed_files");
  const [selected, setSelected] = useState([]);
  const [expanded, setExpanded] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(4);
  const [visibleRows, setVisibleRows] = useState(rows);
  const [commonKeywords, setCommonKeywords] = useState([]);
  const [commonFiles, setCommonFiles] = useState([]);
  const [displayCompare, setDisplayCompare] = useState(false);
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState([]);
  const [filtersWithValues, setFiltersWithValues] = useState(null);
  const [filteredRows, setFilteredRows] = useState(rows);
  const [search, setSearch] = useState("");
  const [keywordSearch, setKeywordSearch] = useState(null);
  const [fileNameSearch, setFileNameSearch] = useState(null);
  const [keywordFilter, setKeywordFilter] = useState(null);
  const [fileNameFilter, setFileNameFilter] = useState(null);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = visibleRows.map((row) => row);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleExpand = (event, row) => {
    const expandedIndex = expanded.indexOf(row);
    let newExpanded = [];

    if (expandedIndex === -1) {
      newExpanded = newExpanded.concat(expanded, row);
    } else if (expandedIndex === 0) {
      newExpanded = newExpanded.concat(expanded.slice(1));
    } else if (expandedIndex === expanded.length - 1) {
      newExpanded = newExpanded.concat(expanded.slice(0, -1));
    } else if (expandedIndex > 0) {
      newExpanded = newExpanded.concat(
        expanded.slice(0, expandedIndex),
        expanded.slice(expandedIndex + 1)
      );
    }

    setExpanded(newExpanded);
  };

  const handleClick = (event, row) => {
    const selectedIndex = selected.indexOf(row);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, row);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = () => {
    const filteredRows = visibleRows.filter(
      (element) => !selected.includes(element)
    );
    setVisibleRows(filteredRows);
    setSelected([]);
  };

  const handleCompareButton = () => {
    console.log("Selected forks:", selected)

    const maxLength = 65;

    let comparisonKeywords = [];
    for (let i = 0; i < selected.length; i++) {
      let words = selected[i]["key_words"];
      comparisonKeywords.push(words);
    }

    let comparisonFiles = [];
    for (let i = 0; i < selected.length; i++) {
      let words = selected[i]["changed_files"];
      comparisonFiles.push(words);
    }

    let commonKeywordsTemp = [];
    for (let i = 1; i < comparisonKeywords.length; i++) {
      commonKeywordsTemp = comparisonKeywords[0].filter(x => comparisonKeywords[i].includes(x));
    }

    let commonFilesTemp = [];
    for (let i = 1; i < comparisonFiles.length; i++) {
      commonFilesTemp = comparisonFiles[0].filter(x => comparisonFiles[i].includes(x));
    }

    let commonKeywordsTempTwo = [];
    for (let i = 0; i < commonKeywordsTemp.length; i++) {
      if (commonKeywordsTemp[i].length < maxLength) {
        commonKeywordsTempTwo.push(commonKeywordsTemp[i].concat(", "));
      } else {
        commonKeywordsTempTwo.push(commonKeywordsTemp[i].substring(0, maxLength).concat(", "));
      }
    }

    let commonFilesTempTwo = [];
    for (let i = 0; i < commonFilesTemp.length; i++) {
      if (commonFilesTemp[i].length < maxLength) {
        commonFilesTempTwo.push(commonFilesTemp[i].concat(", "));
      } else {
        commonFilesTempTwo.push(commonFilesTemp[i].substring(0, maxLength).concat("..., "));
      }
    }

    setCommonKeywords(commonKeywordsTempTwo);
    setCommonFiles(commonFilesTempTwo);
    setDisplayCompare(true);
    handleOpen();

    console.log(commonKeywordsTempTwo)
    console.log(comparisonFiles)
  };

  const handleOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  function getCurrentURL() {
    return window.location.href
  }


  const isSelected = (fork) => selected.indexOf(fork) !== -1;
  const isExpanded = (fork) => expanded.indexOf(fork) !== -1;
  const { pageParam, setPageParam } = usePage();
  // const [isExpanded, setIsExpanded] = useState(false);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - visibleRows.length) : 0;

  // console.log("Filters with values init:", filtersWithValues);

  useEffect(() => {
    const filteredRepos = [];
    let hasBeenFiltered = false;

    if (
      !!rows &&
      !isEmpty(filtersWithValues) &&
      !isEmpty(filters)
    ) {
      rows.forEach((repo) => {
        let matches = false;
        if (!isEmpty(filters)) {
          hasBeenFiltered = true;
          filters.forEach((filt) => {
            console.log("filt:", filt)
            if (filt.key == "changed_files") {
              console.log("filter value", filt.value);
              repo[filt.key].forEach((fileName) => {
                if (fileName === filt.value) {
                  matches = true;
                }
              });
            } else if (filt.key == "key_words") {
              console.log("filter value", filt.value);
              repo[filt.key].forEach((word) => {
                if (word === filt.value) {
                  matches = true;
                }
              });
            }
            else if (repo[filt.key] === filt.value) {
              matches = true;
            }
          });
        }

        if (search !== "" && matches) {
          hasBeenFiltered = true;
          if (!repo.repo.includes(search)) {
            matches = false;
          }
        }

        if (matches) {
          filteredRepos.push(repo);
        }
      });

      console.log("Filtered rows list:", filteredRepos);
      console.log("Filters: ", filters)
      setFilteredRows(filteredRepos);
      setVisibleRows(filteredRepos);
    } else {
      setFilteredRows(rows);
      setVisibleRows(rows);
    }
  }, [filters, search, data]);
  useEffect(() => {
    const initialFilters = {
      changedFiles: {
        key: "num_changed_files",
        display: "# of Changed Files",
        type: "numeric",
        values: [],
      },
      fileName: {
        key: "changed_files",
        display: "File Name",
        type: "string",
        values: [],
      },
      changedLines: {
        key: "num_changed_lines",
        display: "# of Changed Lines",
        type: "numeric",
        values: [],
      },
      numCommits: {
        key: "total_commit_number",
        display: "# of Commits",
        type: "numeric",
        values: [],
      },
      keyword: {
        key: "key_words",
        display: "Keyword",
        type: "string",
        values: [],
      },
      updated: {
        key: "last_committed_time",
        display: "Last Updated",
        type: "date",
        values: [],
      },
      created: {
        key: "created_time",
        display: "Created",
        type: "date",
        values: [],
      }
    };
    rows?.forEach((row) => {
      // console.log("for each row: ", row);
      if (!initialFilters.changedFiles.values.some((item) => item === row.num_changed_files)) {
        initialFilters.changedFiles.values.push(row.num_changed_files);
      }

      row.changed_files.forEach((fileName) => {
        if (!initialFilters.fileName.values.some((item) => item === fileName)) {
          initialFilters.fileName.values.push(fileName);
        }
        // console.log("word in key words list:", fileName)
      });

      if (!initialFilters.changedLines.values.some((item) => item === row.num_changed_lines)) {
        initialFilters.changedLines.values.push(row.num_changed_lines);
      }
      if (!initialFilters.numCommits.values.some((item) => item === row.total_commit_number)) {
        initialFilters.numCommits.values.push(row.total_commit_number);
      }
      row.key_words.forEach((word) => {
        if (!initialFilters.keyword.values.some((item) => item === word)) {
          initialFilters.keyword.values.push(word);
        }
        // console.log("word in key words list:", word)
      });

      if (!initialFilters.updated.values.some((item) => item === row.last_committed_time)) {
        initialFilters.updated.values.push(row.last_committed_time);
      }
      if (!initialFilters.created.values.some((item) => item === row.created_time)) {
        initialFilters.created.values.push(row.created_time);
      }
    });

    setFiltersWithValues(initialFilters);
    console.log("Initial filters: ", initialFilters);

  }, [data]);

  const updateKeywordSearch = (e) => {
    setKeywordSearch(e.target.value);
    console.log("Keyword search term:", e.target.value);
  }

  const updateFileNameSearch = (e) => {
    setFileNameSearch(e.target.value);
    console.log("File name search term:", e.target.value);
  }

  const handleKeywordSearch = (e) => {
    let newFilter = {
      key: "key_words",
      display: "Keyword",
      type: "string",
      value: keywordSearch,
    }
    if (keywordSearch != "") {
      setKeywordFilter([newFilter]);
    }

  }

  const handleFileNameSearch = (e) => {
    let newFilter = {
      key: "changed_files",
      display: "File Name",
      type: "string",
      value: fileNameSearch,
    }
    if (fileNameSearch != "") {
      setFileNameFilter([newFilter]);
    }

  }

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h3"
        sx={{ m: 2 }}>
        {pageParam.split("/")[1].concat('/').concat(pageParam.split("/")[2])}</Typography>
      <Paper sx={{ width: "100%", mb: 2, mt: 1 }}>
        <Box>
          {!isEmpty(filtersWithValues) ?
            <Box>
              <Filter
                filters={filtersWithValues}
                setFilters={(data) => {
                  setFilters(data);
                }}
                setSearch={(data) => {
                  setSearch(data);
                }}
                externalKeyword={keywordFilter}
                externalFileName={fileNameFilter}
              />

            </Box>
            : null}
        </Box>
        {/* <EnhancedTableToolbar
          numSelected={selected.length}
          onDelete={handleDelete}
        /> */}
        {selected.length > 0 && <Button onClick={handleCompareButton}>Compare Selected Forks</Button>}

        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={visibleRows.length}
              repoName={pageParam.split("/")[1].concat('/').concat(pageParam.split("/")[2])}
              forkList={visibleRows}
            />
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
              {stableSort(visibleRows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  const isItemexpended = isExpanded(row);

                  return (
                    <>
                      <TableRow
                        hover
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.fork_name}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{
                              "aria-labelledby": labelId,
                            }}
                            onClick={(event) => handleClick(event, row)}
                          />
                        </TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                        >
                          {row.fork_name}
                        </TableCell>
                        <TableCell align="left">
                          {row.num_changed_files}
                        </TableCell>
                        {/* <TableCell align="left">
                        {row.parsed_files}
                      </TableCell> */}
                        <TableCell align="left">
                          {row.num_changed_lines}
                        </TableCell>
                        <TableCell align="left">
                          {row.total_commit_number}
                        </TableCell>
                        {/* <TableCell align="left">
                        {row.parsed_words}
                      </TableCell> */}
                        <TableCell align="left">
                          {row.last_committed_time}
                        </TableCell>
                        {/* <TableCell align="left">
                        {row.created_time}
                      </TableCell> */}
                        <TableCell align="left">
                          <Button size="small" onClick={(event) => handleExpand(event, row)}>
                            {isItemexpended ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                          </Button>
                        </TableCell>
                      </TableRow>
                      {isItemexpended && (
                        <TableRow>
                          <TableCell padding="checkbox" />
                          <TableCell colSpan="6"><b>AI Summary:</b> {row.ai_summary} </TableCell>
                        </TableRow>
                      )}
                    </>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 40 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[4, 8, 16]}
          component="div"
          count={visibleRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      {/* <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <TextField onKeyPress={(ev) => {
            if (ev.key === 'Enter') {
              handleKeywordSearch();
              ev.preventDefault();
            }
          }} placeholder="Search for custom keyword" onChange={updateKeywordSearch}></TextField>
          <Button onClick={handleKeywordSearch}>Search</Button>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <TextField onKeyPress={(ev) => {
            if (ev.key === 'Enter') {
              handleFileNameSearch();
              ev.preventDefault();
            }
          }} sx={{ marginLeft: 1 }} placeholder="Search for custom file name" onChange={updateFileNameSearch}></TextField>
          <Button onClick={handleFileNameSearch}>Search</Button>
        </Box>
      </Box> */}
      <ComparisonDialogue open={open} commonFiles={commonFiles} commonKeywords={commonKeywords} onClose={handleClose}></ComparisonDialogue>

    </Box>
  );
};

const ComparisonDialogue = ({ open, commonKeywords, commonFiles, onClose }) => {
  const handleClose = () => {
    onClose();
  }
  return (
    <Dialog open={open} onClose={handleClose} maxWidth={'lg'} fullWidth={true}>
      <DialogTitle>Fork Comparison</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex" }}>
          {commonKeywords.length > 0 && <Paper sx={{ width: "50%", padding: 1, marginRight: 1 }}>
            <Typography variant="h6">Common Words from Selected Forks</Typography>
            <Typography paragraph>{commonKeywords}</Typography>
          </Paper>}
          {commonFiles.length > 0 && <Paper sx={{ width: "50%", padding: 1 }}>
            <Typography variant="h6">Common Files Changed from Selected Forks</Typography>
            <Typography paragraph>{commonFiles}</Typography>
          </Paper>}
        </Box>
      </DialogContent>

    </Dialog>
  );
}

ComparisonDialogue.propTypes = {
  open: PropTypes.bool.isRequired,
}

const ForkList = () => {
  const { user } = useAuth();
  const { pageParam } = usePage();
  const [data, setData] = useState(null);
  //counter for forks analyzed 
  const [counter, setCounter] = useState(0);
  const [activeForksNum, setActiveForksNum] = useState(0);

  const fetchForks = useCallback(async (repo) => {
    console.log("fuck", pageParam);
    const [_, repo1, repo2] = pageParam.split('/');
    console.log("repo1", repo1);
    console.log('repo1', repo1);
    console.log('repo2', repo2);


    //get total num of forks needs to be fetched
    const active_fork_num = await getTotalForksNumber(repo, user);
    console.log("Active forks number is ", active_fork_num.data)
    setActiveForksNum(active_fork_num.data)

    let total_list = []
    let i = 0
    while (i < active_fork_num.data) {
      let res = await getRepoForks(repo, i, user);
      total_list.push(res.data.forks[0])
      i += 1
      setCounter(i)
    }
    console.log(total_list)
    setData(total_list);
  }, []);

  useEffect(() => {
    console.log("fuck", pageParam);
    const [_, repo1, repo2] = pageParam.split('/');
    console.log("repo1", repo1);
    const repo = "/" + repo1 + "/" + repo2;
    fetchForks(repo);
  }, [fetchForks]);

  return (
    <>{data ? <EnhancedTable data={data} /> : <Loading loadingMessage={"There are " + activeForksNum + " active forks in total, currently " + counter + " analyzed."}></Loading>}</>
  );
};

export default ForkList;
