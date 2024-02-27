import logo from './logo.svg';
import './App.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
// import { getUserFollowedRepositories } from "./repository";
import { AuthProvider, useAuth } from './AuthContext';
import Login from './Login';
import Logout from './Logout';
import { Box, Pagination, Grid, Typography } from "@mui/material";
import Loading from "./common/Loading";
import Title from "./common/Title";
import isEmpty from "lodash/isEmpty";
import FollowedRepositoryCard from './FollowedRepositoryCard';
// import SearchAndFilter from "./common/SearchAndFilter";
import React, { useEffect, useCallback, useState } from "react";


function Repositories() {
  const { user } = useAuth();
  // const isLoading = false;
  const [followedRepositories, setFollowedRepositories] = useState(null);
  console.log(followedRepositories);
  const [isLoading, setIsLoading] = useState(true);
  const [filtersWithValues, setFiltersWithValues] = useState(null);
  const [filters, setFilters] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredRepositories, setFilteredRepositories] =
    useState(followedRepositories);
  const [paginatedData, setPaginatedData] = useState(filteredRepositories);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);

  const PER_PAGE = 5;

  const onClickRemoveRepo = (value) => {
    setFollowedRepositories(
      followedRepositories.filter((repo) => repo.repo !== value)
    );
  };

  const onClickPagination = (event, page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    setPaginatedData(
      filteredRepositories?.slice(
        (currentPage - 1) * PER_PAGE,
        currentPage * PER_PAGE
      )
    );
    console.log("paginatedData: ", paginatedData);
  }, [currentPage, filteredRepositories]);

  useEffect(() => {
    setPageCount(Math.ceil(filteredRepositories?.length / PER_PAGE));
    setCurrentPage(1);
  }, [filteredRepositories]);

  useEffect(() => {
    const filteredRepos = [];
    let hasBeenFiltered = false;

    if (!!followedRepositories && !isEmpty(filtersWithValues)) {
      followedRepositories.forEach((repo) => {
        let matches = false;

        if (!isEmpty(filters)) {
          hasBeenFiltered = true;
          filters.forEach((filt) => {
            if (repo[filt.key] === filt.value) {
              matches = true;
            }
          });
        } else {
          matches = true;
        }

        if (search !== "") {
          hasBeenFiltered = true;
          if (!repo.repo.includes(search)) {
            matches = false;
          } else {
            matches = true;
          }
        }

        if (matches) {
          filteredRepos.push(repo);
        }
      });

      setFilteredRepositories(filteredRepos);
    } else {
      setFilteredRepositories(followedRepositories);
    }
  }, [filters, search, followedRepositories]);

  const fetchFollowedRepositories = useCallback(async () => {
    // const response = await getUserFollowedRepositories();
    const response = [{
      'language': 'Python',
      'description': 'A web scraping tool',
      'timesForked': 150,
      'repo': 'WebScraper1',
      'updated': '2024-02-25'
    },
    {
      'language': 'JavaScript',
      'description': 'A React-based UI library',
      'timesForked': 300,
      'repo': 'ReactUI2',
      'updated': '2024-02-25'
    },
    {
      'language': 'Python',
      'description': 'A web scraping tool',
      'timesForked': 150,
      'repo': 'WebScraper3',
      'updated': '2024-02-25'
    },
    {
      'language': 'JavaScript',
      'description': 'A React-based UI library',
      'timesForked': 300,
      'repo': 'ReactUI4',
      'updated': '2024-02-25'
    },
    {
      'language': 'Python',
      'description': 'A web scraping tool',
      'timesForked': 150,
      'repo': 'WebScraper5',
      'updated': '2024-02-25'
    },
    {
      'language': 'JavaScript',
      'description': 'A React-based UI library',
      'timesForked': 300,
      'repo': 'ReactUI6',
      'updated': '2024-02-25'
    },
    {
      'language': 'Python',
      'description': 'A web scraping tool',
      'timesForked': 150,
      'repo': 'WebScraper7',
      'updated': '2024-02-25'
    },
    {
      'language': 'JavaScript',
      'description': 'A React-based UI library',
      'timesForked': 300,
      'repo': 'ReactUI8',
      'updated': '2024-02-25'
    }];
    console.log("followed projects", response);

    // setFollowedRepositories(response.data);
    setFollowedRepositories(response);
    console.log("res", response);

    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchFollowedRepositories();
  }, [fetchFollowedRepositories]);


  return (
    <Container fluid>
      {isLoading ? (
        <Box height='100%'>
          <Loading />
        </Box>
      ) : (
        <Box width="100%">
          <Title text="Followed Repositories" />
          <Box paddingLeft="4px">
            {isEmpty(followedRepositories) ? (
              <>
                <Box>
                  <Grid
                    container
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    style={{ minHeight: "70vh" }}
                  >
                    <Typography variant="h4">
                      You are not following any repositories!
                    </Typography>
                    <Typography>
                      Go to the "Import Current" tab to follow repositories
                    </Typography>
                  </Grid>
                </Box>
              </>
            ) : (
              <>
                {!isEmpty(paginatedData) ? (
                  <>
                    {/* <Box>
                      <SearchAndFilter
                        filters={filtersWithValues}
                        setFilters={(data) => {
                          setFilters(data);
                        }}
                        setSearch={(data) => {
                          setSearch(data);
                        }}
                      />
                    </Box> */}
                    <Box>
                      {paginatedData?.map(
                        ({ repo, language, description, updated, timesForked }) => (
                          <FollowedRepositoryCard
                            key={repo}
                            repo={repo}
                            language={language}
                            description={description}
                            updated={updated}
                            timesForked={timesForked}
                            onClickRemove={onClickRemoveRepo}
                          />
                        )
                      )}
                    </Box>
                    <Grid
                      container
                      direction="column"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Pagination
                        count={pageCount}
                        page={currentPage}
                        onChange={onClickPagination}
                      />
                    </Grid>
                  </>
                ) : (
                  <>
                    {/* <Box>
                      <SearchAndFilter
                        filters={filtersWithValues}
                        setFilters={(data) => {
                          setFilters(data);
                        }}
                        setSearch={(data) => {
                          setSearch(data);
                        }}
                      />
                    </Box> */}
                    <Box>
                      <Grid
                        container
                        direction="column"
                        alignItems="center"
                        justifyContent="center"
                        style={{ minHeight: "70vh" }}
                      >
                        <Typography variant="h4">
                          Search result not found!
                        </Typography>
                        <Typography>
                          Go to the "Search Github" tab to follow desired repositories
                        </Typography>
                      </Grid>
                    </Box>
                  </>
                )}
              </>
            )}
          </Box>
        </Box>
      )}
    </Container>
  );
}

export default Repositories;
