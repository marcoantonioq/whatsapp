import configs from "@config/index";
import Google from "../core/Google";
import { GOOGLE_SHEET_SAVE } from "@types";

export class SaveValues {
  constructor(private readonly repo?: any) {}

  async execute({ range, values, spreadsheetId }: GOOGLE_SHEET_SAVE) {
    const google = Google.create();
    await google.auth({
      credentials: configs.GOOGLE.AUTH,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const updateValue = await google.spreadsheets.values.update({
      spreadsheetId,
      valueInputOption: "USER_ENTERED",
      range,
      requestBody: {
        values,
      },
    });
    return updateValue;
  }
}

export default SaveValues;
