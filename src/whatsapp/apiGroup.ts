import { agenda } from "../Contatos";
import { app, api } from "./whatsapp";

app.on("message_create", async (msg) => {
  try {
    if (api.isToAPI(msg)) {
      const reg = /(^grupo |^send |^contatos )(.*)$/gi;
      const match = reg.exec(msg.body);
      if (match && match[2]) {
        const informados = match[2].split(/,|;/).map((el) => el.trim());

        const grupos = agenda.grupos.filter((grupo) =>
          informados.some((gp) =>
            grupo.toUpperCase().includes(gp.toUpperCase())
          )
        );

        if (!grupos || grupos.length < 1) {
          const ms = `🤖: Grupo ${informados.join(
            ", "
          )} inválido! \nGrupos disponíveis: ${agenda.grupos.join(", ")}`;
          msg.reply(ms);
          console.log(ms);
          return false;
        }

        const contatos = agenda._contatos.filter((contato) => {
          return grupos.some((grupo) => {
            return contato.data.grupos
              ?.toUpperCase()
              .includes(grupo.toUpperCase());
          });
        });

        if (contatos.length === 0) {
          api.sendToAPI(`Nenhum contato para o grupo ${grupos.join(", ")}!`);
          return false;
        }

        const ms = `🤖: Participantes (${
          contatos.length
        }) do grupo ${grupos.join(", ")}: \n${contatos
          .map((contato) => `${contato.data.nome}:\t ${contato.data.telefones}`)
          .join("\n")}`;

        api.numbers = ms;
        msg.reply(ms);
      }
    }
  } catch (e) {
    const ms = `Erro: send Group: ${e}`;
    console.error(ms);
  }
});
