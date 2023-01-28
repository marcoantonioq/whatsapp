import { google } from "googleapis";
const customSearch = google.customsearch("v1");

export const search = async (text: string) => {
  const response = await customSearch.cse.list({
    auth: process.env.SEARCH_API,
    cx: process.env.SEARCH_ID,
    q: text,
    num: 5,
  });
  if (response.data.items) {
    return response.data.items.reduce((acc, item) => {
      acc += `\n\n${item.title}\n${item.snippet}\n${item.link}`;
      return acc;
    }, "");
  }
};

export default search;
