import GetValuesInSheet from "./app/sheet-get-values";
import SaveValues from "./app/sheet-save-values";
import SearchGoogle from "./app/search-google";
import SpeechToTextOGG from "./app/speech-to-text-ogg";
import { EventEmitter } from "stream";

export class ModuleGoogle {
  private constructor() {}

  static create(): ModuleGoogle {
    if (!ModuleGoogle.instance) {
      ModuleGoogle.instance = new ModuleGoogle();
    }
    return ModuleGoogle.instance;
  }
  private event = new EventEmitter();
  private static instance: ModuleGoogle;
  private readonly repo!: null;
  sheet = {
    saveValues: new SaveValues().execute,
    getValues: new GetValuesInSheet().execute,
  };
  search = {
    text: new SearchGoogle().execute,
  };
  speech = {
    oggToText: new SpeechToTextOGG().execute,
  };
}
export default ModuleGoogle;
