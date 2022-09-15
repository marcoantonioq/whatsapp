const { GoogleSpreadsheet } = require('google-spreadsheet');
const credenciais = require('./credenciais.json');
const arquivo = require('./arquivo.json');

const getDoc = async () => {
  const doc = new GoogleSpreadsheet(arquivo.id);

  await doc.useServiceAccountAuth({
    client_email: credenciais.client_email,
    private_key: credenciais.private_key.replace(/\\n/g, '\n'),
  });
  await doc.loadInfo();
  return doc;
};

const getRows = async (plan) => {
  try {
    const doc = await getDoc();
    console.log(doc.title);
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
    throw new Error(`\nErro ao ler planilha de contatos: ${e}`);
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
    console.log('Error convert text: ', e);
    return message;
  }
};

// getRows("GOI").then((result) => {
//   console.log(result);
// });

module.exports = {
  getDoc,
  getRows,
  replaceInRow,
};
