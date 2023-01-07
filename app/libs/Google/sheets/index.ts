import { GoogleSpreadsheet } from 'google-spreadsheet'

export class Sheet {
  private _doc: GoogleSpreadsheet
  status: string = ""
  constructor(id: string, client_email: string = "", private_key: string = "") {
    this._doc = new GoogleSpreadsheet(id)
    this._doc.useServiceAccountAuth({
      client_email,
      private_key
    }).then(async _ => {
      this.status = "authentication"
    }).catch(error => {
      console.log(`Auth: Client Sheet inválido ${client_email}!`)
    })
  }

  get doc() {
    return this._doc
  }

  async getRows(plan: string) {
    try {
      await this._doc.loadInfo()
      const sheet = this._doc.sheetsByTitle[plan]
      return await sheet.getRows()
    } catch (e) {
      console.log(`\nErro ao ler planilha ${plan}: ${e}`)
      return []
    }
  }

  async getValues(plan: string) {
    try {
      const sheet = this._doc.sheetsByTitle[plan]
      const rows = await sheet.getRows()
      const headerValues = rows[0]._sheet.headerValues
      return rows.map(({ _rawData }) => {
        const entries = _rawData.map((val: string, id: string) => {
          return [headerValues[id], val]
        })
        const data = new Map(entries)
        return Object.fromEntries(data)
      })
    } catch (e) {
      console.log(`\nErro ao ler planilha de contatos: ${e}`)
    }
  }

}

export const sheet = new Sheet(
  String(process.env.GOOGLE_SHEET_ID),
  String(process.env.CLIENT_EMAIL),
  String(process.env.PRIVATE_KEY).replace(/\\n/g, '\n')
)

export default Sheet
