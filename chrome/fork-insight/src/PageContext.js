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
    "Fork_List": 3,
  };
  const [pageParam, setPageParam]= useState(null);
  const value = {
    curr_page,
    pageNr,
    pageParam,
    setCurrPage,
    setPageParam
  };

  return <PageContext.Provider value={value}>{children}</PageContext.Provider>;
};
