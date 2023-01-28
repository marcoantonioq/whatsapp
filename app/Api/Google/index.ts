import { google } from "googleapis";
const customSearch = google.customsearch("v1");

export const search = async (text: string) => {
  return await customSearch.cse.list({
    auth: process.env.SEARCH_API,
    cx: process.env.SEARCH_ID,
    q: text,
    num: 2,
  });
};

export default search;
