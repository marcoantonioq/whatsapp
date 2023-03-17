import { menu } from "./Menus";
import configs from "@config/index";
import { scrapy } from "./handlers";

async function login(page: any) {
  await page.goto("https://suap.ifg.edu.br/accounts/login/?next=/");
  await page.type("input[name=username]", configs.SUAP.user);
  await page.type("input[name=password]", configs.SUAP.pass);
  await page.click("input[type=submit]");
  return true;
}
async function updateUser(page: any, matricula: string) {
  await page.goto(
    `https://suap.ifg.edu.br/ldap_backend/sync_user/${matricula}`
  );
}

export const SUAP: menu[] = [
  {
    label: "Atualizar cadastro no SUAP?",
    regex: "[0-9]{7}",
    action: async (input: string) => {
      const regex = /[\(\[]?(\d{7})[\)\]]?/;

      const resultado = regex.exec(input);
      const matricula = (resultado ? resultado[1] : undefined)?.trim();
      if (matricula) {
        return await scrapy.navigation(async (browser) => {
          let result = "";
          const page = await browser.newPage();
          try {
            page.setDefaultNavigationTimeout(60000);
            await login(page);
            await updateUser(page, matricula);
            await updateUser(page, matricula);
            await page.goto(`https://suap.ifg.edu.br/rh/servidor/${matricula}`);
            const dados = await page.evaluate(() => {
              const table = document.querySelector(
                "#content table:nth-child(1)"
              );
              if (!table) return "";
              const rows = table.querySelectorAll("tr"); // Seleciona as linhas da tabela
              let tableText = "";
              if (!rows) return "";
              rows.forEach((row) => {
                const cells = row.querySelectorAll("td");
                let rowText = "";

                cells.forEach((cell, index) => {
                  if (index === 0) {
                    rowText += `${cell.textContent}: `;
                  } else {
                    rowText += `${cell.textContent}\n`;
                  }
                });

                tableText += `${rowText}\n`;
              });

              return tableText;
            });
            result = `Matrícula ${matricula} atualizada!\n\n${dados}`;
          } catch (error) {
            console.log("Erro ao atualizar matricula no SUAP:::", error);
          }
          page.close();
          return result;
        });
      }
    },
  },
];
