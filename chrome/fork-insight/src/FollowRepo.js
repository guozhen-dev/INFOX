import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Form from  'react-bootstrap/Form';
import { Container } from '@mui/material';
import { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { SERVER } from './common/constants';

function FollowRepo() {

  // Global states
  const {user} = useAuth();

  const [currentRepoUrl, setCurrentRepoUrl] = useState(null);
  const handleChangeUrl = ({target:{value}}) => {setCurrentRepoUrl(value);};
  const [currentRepoName, setCurrentRepoName] = useState(null);
  const handlechangeCurrentRepoName = ({target:{value}}) => {setCurrentRepoName(value)};
  const [disableSubmit, setDisableSubmit] = useState(true);
  const [manualUrl, setManualUrl] = useState(false);

  function flipManualUrl() {
    setManualUrl(!manualUrl);
  }

  function submitHandler(e) {
    e.preventDefault(); 
    console.log(user);
    if (!user) {
      alert("Please login before follow a repository.");
    }
    fetch(SERVER + '/flask/follow',{
      method: 'POST',
      body: JSON.stringify({
        git_url: currentRepoUrl,
        user_info: user
      })
    }).then(
      (resp)=> {
        console.log(resp.json());
      }
    )
    
  }

  useEffect(() => {
    try{
      let gitUrl = new URL(currentRepoUrl);
      if (gitUrl.hostname === "github.com") {
        setDisableSubmit(false);
      } else {
        setDisableSubmit(true);
      }
    }
    catch {
      setDisableSubmit(true);
    }
     
  }, [currentRepoUrl]);

  useEffect(() => {
    chrome.tabs.query({
      active: true, 
      lastFocusedWindow: true
    }, tabs => {
      let currentUrl = new URL(tabs[0].url);
      if (currentUrl.hostname === "github.com") {
        const firstTwoLevelsPath = currentUrl.pathname.split('/').filter(part => part).slice(0, 2).join('/');
        setCurrentRepoUrl(`${currentUrl.protocol}//${currentUrl.host}/${firstTwoLevelsPath}`);
        setCurrentRepoName(currentUrl.toString().split('/')[4]);
        setDisableSubmit(false);
        debugger;
      } else {
        setCurrentRepoUrl("Warning: You are not currently on a GitHub Page.");
        setCurrentRepoName("Warning: You are not currently on a GitHub Page.");
        setDisableSubmit(true);
      }
    })
  }, []);

  return (
    <Container style={{marginTop: 20}}>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="currentRepoUrl">
          <Form.Label>Current Page Url</Form.Label>
          <Form.Control type="text" value={currentRepoUrl} onChange={handleChangeUrl} placeholder="" disabled={!manualUrl}/>
          <Form.Text className="text-muted">
            Please make sure this shows the GitHub URL as in your browser.
          </Form.Text>
        </Form.Group>
        <Form.Group className="mb-3" controlId="currentRepoInfo" hidden={manualUrl}>
          <Form.Label>Git Repo Name</Form.Label>
          <Form.Control type="text" value={currentRepoName} onChange={handlechangeCurrentRepoName} placeholder="" disabled={!manualUrl}/>
          <Form.Text className="text-muted">
            Please make sure this shows the GitHub Repo Name as in your browser.
          </Form.Text>
        </Form.Group>
        <Form.Group className="mb-3" controlId="customizeGitUrl">
          <Form.Check type="checkbox" checked={manualUrl} onChange={flipManualUrl} label="Manual URL input" />
          <Form.Text className="text-muted">
            Check this if you want to manually input a Github URL.
          </Form.Text>
        </Form.Group>
        <Button variant="primary" type="submit" disabled={disableSubmit}>
          Follow
        </Button>
      </Form>
      </Container>
  );
}

export default FollowRepo;
