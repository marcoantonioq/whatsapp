import configs from "@config/index";
import Google from "../core/Google";

export class SearchGoogle {
  constructor(private readonly repo?: any) {}

  async execute(text: string) {
    const google = Google.create();
    let result = "";
    if (text) {
      await google.auth({
        credentials: configs.GOOGLE.AUTH,
        scopes: ["https://www.googleapis.com/auth/cse"],
      });
      const response = await google.search.list({
        auth: configs.GOOGLE.GOOGLE_KEY,
        cx: configs.GOOGLE.SEARCH_ID,
        q: `define: ${text}`,
        lr: "lang_pt",
        num: 5,
      });
      if (response.data.items) {
        result = response.data.items.reduce((acc, item) => {
          acc += `\n\n${item.title}\n${item.snippet}\n${item.link}`;
          return acc;
        }, "");
      }
    }
    return result;
  }
}

export default SearchGoogle;
