import { google, questionAPI, sendTextAPI } from ".";

export async function GoogleSearch(input: string) {
  let result = "";
  while (true) {
    const search = await questionAPI(
      "O que deseja pesquisar no google [(s)air]?"
    );
    if (/^(s|sair)$/gi.test(search.body || "")) break;
    result = await google.search.text(search.body || "");
    sendTextAPI(result || "Nenhum resultado encontrado!");
  }
  return "Finalizado!";
}
