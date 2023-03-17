import { openAI, questionAPI, sendTextAPI } from ".";

export async function OpenIA(input: string) {
  while (true) {
    const search = await questionAPI(
      "O que deseja pesquisar no OpenIA [(s)air]?"
    );
    if (/^(s|sair)$/gi.test(search.body || "")) break;
    const response = await openAI.text({
      to: search.to,
      from: search.from || "",
      body: search.body || "",
      type: "text",
    });

    sendTextAPI(response.result || "Nenhum resultado encontrado!");
  }
  return "Finalizado";
}
