import { spread } from 'axios';
import React, { createContext, useContext, useState } from 'react';

const PageContext = createContext();

export function usePage() {
  return useContext(PageContext);
}

export const PageProvider = ({ children }) => {
  const [curr_page, setCurrPage] = useState(0);
  const pageNr = {
    "Fork Insight": 0,
    "Repositories": 1,
    "Follow_Repo": 2,
    "Fork_Clustering": 3,
  };
  const value = {
    curr_page,
    pageNr,
    setCurrPage
  };

  return <PageContext.Provider value={value}>{children}</PageContext.Provider>;
};
