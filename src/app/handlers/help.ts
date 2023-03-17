import { questionAPI } from ".";

export async function Help(input: string) {
  while (true) {
    const question = await questionAPI("Em que posso ajuda-lo [(s)air]?");
    if (/^(s|sair)$/gi.test(question.body || "")) break;
    console.log("Ok: ");
  }
  return "";
}
