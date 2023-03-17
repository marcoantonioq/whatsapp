import { questionAPI, sendTextAPI, writeSonic } from ".";

export async function WriteSonic(input: string) {
  let result: string | undefined = "";
  while (true) {
    const search = await questionAPI(
      "O que deseja pesquisar no WriteSonic [(s)air]?"
    );
    if (/^(s|sair)$/gi.test(search.body || "")) break;
    const response = await writeSonic.text({
      to: search.to,
      from: search.from || "",
      body: search.body || "",
      type: "text",
    });

    sendTextAPI(response.result || "Nenhum resultado encontrado!");
  }
  return "Finalizado!";
}
