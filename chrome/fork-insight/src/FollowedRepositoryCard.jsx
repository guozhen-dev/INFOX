import React from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Grid,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RemoveButton from "./common/RemoveButton";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import { PRIMARY, REMOVE, TERTIARY } from "./common/constants";
// import { SECONDARY, TERTIARY, PRIMARY } from "./common/constants";
// import { deleteUserRepository } from "./repository";
// import { useNavigate } from "react-router";
import { usePage } from './PageContext';

const FollowedRepositoryCard = ({
  repo,
  description,
  language,
  timesForked,
  updated,
  onClickRemove,
}) => {
  const onRemove = (event) => {
    event.stopPropagation();
    // deleteUserRepository(repo);
    onClickRemove(repo);
  };

  const { pageNr, pageParam, setCurrPage, setPageParam } = usePage();

  // const navigate = useNavigate();

  const navigateToFork = () => {
    console.log("repo nav", repo);
    // navigate(`/forks/${repo}`, { replace: true });
  };

  const setCompareRepo = () => {
    setCurrPage(pageNr['Fork_List']);
    setPageParam(repo);
    // navigateToFork();
  };

  return (
    <Box paddingY={1}>
      <Accordion>
        <AccordionSummary
          style={{ background: PRIMARY }}
          expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
        >
          <Grid container direction="row" alignItems="center" style={{ marginRight: '25px' }}>
            <Grid item xs={9}>
              <Typography color="white">{repo}</Typography>
            </Grid>
            <Grid item xs={2}>
              <Box style={{ textAlign: "right" }}>
                <Button
                  color="inherit"
                  startIcon={<SignalCellularAltIcon />}
                  onClick={setCompareRepo}
                  style={{ background: REMOVE, marginRight: '8px' }}
                >
                  Details
                </Button>
              </Box>
            </Grid>
            <Grid item xs={1}>
              <Box style={{ textAlign: "center"}}>
                <RemoveButton onClickRemove={onRemove} />
              </Box>
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails style={{ background: TERTIARY }}>
          <Grid container>
            <Grid item xs={4}>
              <Typography>Language: {language}</Typography>
            </Grid>
            <Grid item xs={4} style={{ textAlign: "center" }}>
              <Typography>Times Forked: {timesForked}</Typography>
            </Grid>
            <Grid item xs={4} style={{ textAlign: "right" }}>
              <Typography>Last Updated: {updated}</Typography>
            </Grid>
          </Grid>
          <Typography>Project Description: {description}</Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

FollowedRepositoryCard.propTypes = {
  repo: PropTypes.string,
  description: PropTypes.string,
  language: PropTypes.string,
  timesForked: PropTypes.number,
  lastUpdated: PropTypes.string,
  onClickRemove: PropTypes.func,
};

export default FollowedRepositoryCard;
