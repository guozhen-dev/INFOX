import './App.css';
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from './AuthContext';
import { Box, Pagination, Grid, Typography } from "@mui/material";
import Loading from "./common/Loading";
import Title from "./common/Title";
import isEmpty from "lodash/isEmpty";
import FollowedRepositoryCard from './FollowedRepositoryCard';
import React, { useEffect, useCallback, useState } from "react";
import axios from "axios";
import { SERVER } from './common/constants';

// import SearchAndFilter from "./common/SearchAndFilter";

const getUserFollowedRepositories = async (userInfo) => {
  const response = await axios({
    method: "GET",
    url: SERVER + "/flask/followed",
    headers: {
      'Authorization': JSON.stringify(userInfo)
    }
  });
  return response.data;
};

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

  const onClickRemoveRepo = async (value) => {
    alert(value);
    const response = await axios({
      method: "DELETE",
      url: SERVER + "/flask/followed",
      headers: {
        'Authorization': JSON.stringify(user)
      },
      data: {
        repo: value
      }
    });
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

    const response = await getUserFollowedRepositories(user);
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
