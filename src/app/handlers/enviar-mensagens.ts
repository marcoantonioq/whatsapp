import { Contact } from "@modules/contacts/core/Contacts";
import {
  contactWhatsappToContact,
  contatos,
  extractNumber,
  messages,
  questionAPI,
  removeDuplicates,
  sendTextAPI,
} from ".";

const GROUPS = <string[]>[
  "Aviso - Reuniões de Evangelização",
  "Irmandade Goiás",
  "Irmandade Mirandópolis",
  "Irmandade Mossâmedes",
  "Irmandade Uvá",
  "Ministério Cidade de Goiás",
  "Jovens Goiás",
  "Músicos Goiás",
  "Voluntários",
  "Testemunhado",
  "TempoNovo",
  "Ânimo",
  "Irmão",
  "Piedade",
  "Porteiros",
  "IFG",
  "Teste1",
  "Teste2",
  "Família",
  "Cooperador",
];

export async function EnviarMensagem(input: string) {
  // Variáveis
  const numbers: string[] = [];
  const contacts: Contact[] = [];
  const messagesID: string[] = [];
  const menuGROUPS = GROUPS.map(
    (option, index) => `${index + 1}. ${option}`
  ).join("\n");

  // Funções
  const isExit = (body: string) => {
    if (/^(s|sair|cancelar)$/gi.test(body || "")) {
      const ms = "Operação cancelada!";
      sendTextAPI(ms);
      throw new Error(ms);
    }
  };

  // Coletar números de telefones
  while (true) {
    const msg = await questionAPI(
      `Informe contatos para o envio [ok]:\n\n${menuGROUPS}`
    );
    if (/^(o|ok)$/gi.test(msg.body || "")) break;
    if (msg.body) {
      isExit(msg.body);
      const extracted = await extractNumber(msg.body);
      if (extracted.length) {
        sendTextAPI(`Números extraídos: ${extracted.length}!`);
        extracted.forEach((n) => numbers.push(n));
      }
      const group = GROUPS[+Number(msg.body) - 1]; // grupo selecionado!
      const select = (await contatos.contacts()).filter((c) =>
        c.isInTheGroup(group)
      );
      for (const c of select) {
        (await extractNumber(c.telefones)).forEach((n) => numbers.push(n));
      }
      if (select.length)
        sendTextAPI(
          `Grupo (${+Number(msg.body)}) selecionando: ${group} com ${
            select.length
          } contatos!`
        );
    }
  }

  // Remover números duplicados e criar lista de contatos
  for (const number of removeDuplicates(numbers)) {
    const wc = await messages.getContact(`55${number}@c.us`);
    if (wc) {
      const contact = await contactWhatsappToContact(wc);
      if (contact) contacts.push(contact);
    }
  }
  // Mostrar contatos selecionados
  await sendTextAPI(
    contacts
      .map((el) => {
        return `${el.nome} - (${el.telefones})`;
      })
      .join("\n")
  );

  // Coleta mensagens para envio
  while (true) {
    const msg = await questionAPI("Informe a mensagem para cadastro [enviar]:");
    if (/^(e|enviar)$/gi.test(msg.body || "")) break;
    isExit(msg.body || "");
    messagesID.push(msg.id);
  }

  // Envia mensagens
  if (messagesID.length) {
    questionAPI("Cancelar [s/n]?")
      .then((msg) => {
        isExit(msg.body || "");
      })
      .catch((error) => {
        throw error;
      });
    sendTextAPI("Enviando mensagens...");
    await new Promise((resolve) => {
      setTimeout(async () => {
        resolve(true);
      }, 5000);
    });
    for (const contact of contacts) {
      await messages.forwardMessages({
        number: contact.id,
        messagesID: messagesID,
      });
    }
  }

  return "Finalizado!";
}
