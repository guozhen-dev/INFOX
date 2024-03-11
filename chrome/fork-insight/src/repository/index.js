import axios from "axios";
import { SERVER } from "../common/constants";

// TODO: convert the links to be based on prod environment or development, or implement a proxy
export const getUserFollowedRepositories = async (user) => {
  const response = await axios({
    method: "GET",
    url: "flask/followed",
    headers: {
      'Authorization': JSON.stringify(user)
    },
  });

  return response;
};

export const getTotalForksNumber = async (value, user) => {
  const response = await axios({
    method: "GET",
    url: `${SERVER}/flask/forklist?repo=${value}`,
    headers: {
      'Authorization': JSON.stringify(user)
    },
  });
  return response;
};

export const getRepoForks = async (value, i, user) => {
  const response = await axios({
    method: "POST",
    url: `${SERVER}/flask/forklist`,
    headers: {
      'Authorization': JSON.stringify(user)
    },
    data: { repo: value, index: i },
  });
  return response;
};

export const getUserImportRepositories = async (user) => {
  const response = await axios({
    method: "GET",
    url: "flask/import",
    headers: {
      'Authorization': JSON.stringify(user)
    },
  });
  return response;
};

export const postUserLogin = async (values) => {
  const response = await axios.post("flask/auth", {
    code: values,
  });

  return response;
};

export const getUserLogin = async (user) => {
  const response = await axios({
    method: "GET",
    url: "flask/auth",
    headers: {
      'Authorization': JSON.stringify(user)
    },
  });

  return response;
};

// get 5 among the top forked repos on github
export const fetchFreqForkRepos = async (apiEndpoint) => {
  return await fetch(apiEndpoint).then((res) => res.json()).then((data) => data["items"]);
  // return await axios.get(apiEndpoint).then((res) => res.json()).then((data) => data["items"]); // axios fields not filled, could fix later to use axios rather than fetch
};

export const postSearchGithub = async (value, user) => {
  const response = await axios({
    method: "POST",
    url: "flask/search",
    headers: {
      'Authorization': JSON.stringify(user)
    },
    data: { repo: value },
  });

  return response;
};

export const postFollowRepository = async (value) => {
  const response = await axios({
    method: "POST",
    url: "flask/follow",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    },
    data: { repo: value },
  });

  return response;
};

export const deleteUserRepository = async (value) => {
  const response = await axios({
    method: "DELETE",
    url: "flask/followed",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    },
    data: { repo: value },
  });

  return response;
};

export const getForkClustering = async ({
  repo,
  analyzeCode,
  analyzeFiles,
  analyzeCommits,
  clusterNumber,
  updatedData,
  userInputWords,
}) => {
  const response = await axios({
    method: "GET",
    url: `flask/cluster?repo=${repo}&analyzeCode=${analyzeCode}&analyzeFiles=${analyzeFiles}&analyzeCommits=${analyzeCommits}&clusterNumber=${clusterNumber}&updateData=${updatedData}&userInputWords=${userInputWords}`,
    headers: {
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    },
  });
  return response;
};
