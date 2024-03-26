import { Button, Card, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import Image from "./img/network.jpg"
import Image1 from "./img/overview.png"
import Image2 from "./img/tagging.png"

const styles = {
  paperContainer: {
    height: '100%',
    width: '100%',
    backgroundImage: `url(${Image})`,
    backgroundSize: 'cover',
    backgroundPositionX: 'center',

  },
  boxContainer: {
    width: "20%",
    backgroundImage: `url(${Image1})`,
    backgroundSize: 'contain',
    backgroundPositionX: 'center',
    backgroundRepeat: 'no-repeat'
  },
  boxContainer1: {
    width: "30%",
    backgroundImage: `url(${Image2})`,
    backgroundSize: 'contain',
    backgroundPositionX: 'center',
    backgroundRepeat: 'no-repeat'
  },

  flexCenteredColumns: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },

  flexSpaceEvenRows: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  }
};

const Home = () => {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
      <Box variant="elevated" style={styles.paperContainer}>
        <Box variant="elevated" style={styles.flexCenteredColumns} sx={{ background: "rgba(0, 0, 0, 0.6)", height: 500 }}>
          <Typography variant="h1" color="white" textAlign="center">INFOX <sub>beta</sub></Typography>
          <Typography variant="h2" color="white" textAlign="center">Insights into Forks</Typography>
          <br></br>
          <br></br>
          <br></br>
          <Typography variant="body1" color="white" textAlign="center">Overwhelmed with the activities in forks of a project?
          </Typography>

          <Typography variant="body1" color="white" textAlign="center">Which forks are active?
          </Typography>

          <Typography variant="body1" color="white" textAlign="center">Which contain interesting ideas?
          </Typography>

          <Typography variant="body1" color="white" textAlign="center">Which contain already finished features to build upon, rather than reimplement?
          </Typography>

        </Box>
        <Card variant="elevated" sx={{ display: "flex", marginTop: 1, width: "100%", justifyContent: "space-evenly" }}>
        <Button variant="text" target="_blank" href="http://forks-insight.com/about">Contact Us</Button>
        <Button variant="text" target="_blank" href="https://github.com/FancyCoder0/INFOX">INFOX on GitHub</Button>
        <Button variant="text" target="_blank" href="https://github.com/FancyCoder0/INFOX/issues">Open An Issue</Button>
      </Card>
      </Box>

      
    </Box>
  );
};

export default Home;