import configs from "@config/index";
import Google from ".";

const google = Google.create();

export async function getData(params = { id: "", range: "Contatos" }) {
  const auth = await google.auth(configs.GOOGLE.AUTH);
  const rows = await google.spreadsheets.values.get({
    auth,
    spreadsheetId: params.id,
    range: params.range,
  });
  console.log("Dados:::::", rows);
  return rows.data;
}

getData({ id: configs.GOOGLE.SEARCH_ID, range: "Contatos" });
export default getData;
