/**
 * Interfaces
 */
export interface menu {
  label: string;
  regex?: string;
  action: (input: string) => Promise<string | undefined>;
}

/**
 * Class
 */
export class Menu {
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
    try {
      let selectedOption: menu | undefined;
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
            const regex = new RegExp(op.regex || "!!", "gi");
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
    } catch (error) {
      console.log("Erro::", error);
    }
  }
}
