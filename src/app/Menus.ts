import {
  google,
  messages,
  openAI,
  questionAPI,
  scrapy,
  sendImgToAPI,
  sendTextAPI,
  transcreverAudio,
  writeSonic,
} from "./actions";

export interface menu {
  label: string;
  regex?: string;
  action: (input: string) => Promise<string | undefined>;
}

class Menu {
  options: menu[];

  constructor(options: menu[]) {
    this.options = options;
  }

  menu(): string {
    return this.options
      .map((option, index) => {
        return `${index + 1}. ${option.label}`;
      })
      .join("\n");
  }

  async selectOption(input: string): Promise<string | undefined> {
    let selectedOption: menu | undefined;
    // If input is a number, get the corresponding option by index
    if (/^\d+$/.test(input)) {
      const index = Number(input) - 1;
      if (index < 0 || index >= this.options.length) {
        console.log("Invalid option selected.");
        return;
      }
      selectedOption = this.options[index];
    } else if (/^\//.test(input)) {
      const newInput = input.slice(1);
      selectedOption = this.options
        .filter((op) => op.regex)
        .find((op) => {
          const regex = new RegExp(op.regex || "!!");
          return regex.test(newInput);
        });
    } else {
      console.log("Entrada inválida!");
      return;
    }
    if (!selectedOption) {
      console.log("Nenhum comando encontrado!");
      return;
    }
    return await selectedOption.action(input);
  }
}

const API: menu[] = [
  {
    label: "Transcrição",
    regex: "audio",
    action: async (input: string) => {
      while (true) {
        const msg = await questionAPI("Ok, envie o audio [(s)sair]:");
        if (/(s|sair)/gi.test(msg.body || "")) break;
        if (msg.hasMedia && ["audio", "ptt"].includes(msg.type || "")) {
          const media = await messages.downloadMedia(msg.id);
          sendTextAPI(`Transcrição: \n\n"${await transcreverAudio(media)}"`);
          break;
        }
      }
      return "Transcrição realizada!";
    },
  },
  {
    label: "Criar aviso",
    regex: "(criar |)aviso",
    action: async (input: string) => {
      while (true) {
        const aviso = await questionAPI("Informe o aviso que deseja: ");

        if (/(s|sair)/gi.test(aviso.body || "")) break;

        if (aviso.body) {
          const html = await scrapy.createPageTemplate("aviso", [
            [
              "content",
              aviso.body
                .trim()
                .split("\n")
                .map((el) => el.trim())
                .map((el, id) =>
                  el.match(/^\</gi) && !id ? el : `<br>${el}</br>`
                )
                .join(""),
            ],
          ]);

          const data = await scrapy.printScreenPage(
            { templateHTML: html },
            "./out/image.png"
          );
          const caption = await questionAPI("Informe o caption: ");
          if (data) await sendImgToAPI(data, caption.body || "");
        }
      }
      return "Aviso criado!";
    },
  },
  {
    label: "Google",
    regex: "google|g",
    action: async (input: string) => {
      let result = "";
      while (true) {
        const search = await questionAPI(
          "O que deseja pesquisar no google [(s)air]?"
        );
        if (/(s|sair)/gi.test(search.body || "")) break;
        result = await google.search.text(search.body || "");
        if (result) break;
      }
      return result;
    },
  },
  {
    label: "WriteSonic",
    regex: "write|chat|sonic",
    action: async (input: string) => {
      let result: string | undefined = "";
      while (true) {
        const search = await questionAPI(
          "O que deseja pesquisar no WriteSonic [(s)air]?"
        );
        if (/(s|sair)/gi.test(search.body || "")) break;
        const response = await writeSonic.text({
          to: search.to,
          from: search.from || "",
          body: search.body || "",
          type: "text",
        });

        result = response.result;
        if (result) break;
      }
      return result;
    },
  },
  {
    label: "OpenIA",
    regex: "ai|ia|open",
    action: async (input: string) => {
      let result: string | undefined = "";
      while (true) {
        const search = await questionAPI(
          "O que deseja pesquisar no OpenIA [(s)air]?"
        );
        if (/(s|sair)/gi.test(search.body || "")) break;
        const response = await openAI.text({
          to: search.to,
          from: search.from || "",
          body: search.body || "",
          type: "text",
        });

        result = response.result;
        if (result) break;
      }
      return result;
    },
  },
  {
    label: "!!",
    regex: "!!",
    action: async (input: string) => {
      console.log("O que deseja [(s)air]?");
      while (true) {
        const question = await questionAPI("Informe o aviso que deseja: ");
        if (/(s|sair)/gi.test(question.body || "")) break;
        console.log("Ok: ");
      }
      return "Comando finalizado!";
    },
  },
];

export const menuAPI = new Menu(API);
