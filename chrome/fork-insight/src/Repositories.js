import logo from './logo.svg';
import './App.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider, useAuth } from './AuthContext';
import Login from './Login';
import Logout from './Logout';
import { useState } from 'react';


function Repositories() {
  const { user } = useAuth();
  const isLoading = false;


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
                      Go to the "Search Github" tab to search for repositories to
                      follow
                    </Typography>
                </Grid>
              </Box>
            </>
            ):(
            <>
            {!isEmpty(paginatedData) ? (
              <>
                <Box>
                  <SearchAndFilter
                    filters={filtersWithValues}
                    setFilters={(data) => {
                      setFilters(data);
                    }}
                    setSearch={(data) => {
                      setSearch(data);
                    }}
                  />
                </Box>
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
               <Box>
                  <SearchAndFilter
                    filters={filtersWithValues}
                    setFilters={(data) => {
                      setFilters(data);
                    }}
                    setSearch={(data) => {
                      setSearch(data);
                    }}
                  />
                </Box> 
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
