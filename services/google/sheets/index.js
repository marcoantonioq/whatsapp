const { GoogleSpreadsheet } = require("google-spreadsheet");

const logger = require("../../logger");

const getDoc = async () => {
  try {
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

    await doc.useServiceAccountAuth({
      client_email: process.env.CLIENT_EMAIL,
      private_key: process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
    });
    await doc.loadInfo();
    return doc;
  } catch (e) {
    logger.log(`\nErro ao ler planilha de contatos: ${e}`);
  }
};

const getRows = async (plan) => {
  try {
    const doc = await getDoc();
    const sheet = doc.sheetsByTitle[plan];
    return await sheet.getRows();
  } catch (e) {
    console.log(`\nErro ao ler planilha de contatos: ${e}`);
    return [];
  }
};

const getValues = async (plan) => {
  try {
    const doc = await getDoc();
    const sheet = doc.sheetsByTitle[plan];
    const rows = await sheet.getRows();
    const headerValues = rows[0]._sheet.headerValues;
    return rows.map(({ _rawData }) => {
      const entries = _rawData.map((val, id) => {
        return [headerValues[id], val];
      });
      const data = new Map(entries);
      return Object.fromEntries(data);
    });
  } catch (e) {
    logger.log(`\nErro ao ler planilha de contatos: ${e}`);
  }
};

// eslint-disable-next-line require-await
const replaceInRow = async (message, row) => {
  try {
    return Object.keys(row)
      .filter((el) => el.match(/^_/gi))
      .reduce((acc, coluna) => {
        return acc.replaceAll(coluna, row[coluna]);
      }, message);
  } catch (e) {
    logger.log("Error convert text: ", e);
    return message;
  }
};

// getRows("GOI").then((result) => {
//   console.log(result);
// });

module.exports = {
  getDoc,
  getRows,
  getValues,
  replaceInRow,
};
