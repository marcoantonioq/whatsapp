import { agenda } from "../contatos";
import { app, api } from "./whatsapp";


app.on("message_create", async (msg) => {
  try {
    if (api.toAPI(msg)) {
      const reg = /(^grupo |^send |^contatos )(.*)$/gi;
      const match = reg.exec(msg.body)
      if (match && match[2]) {
        const informados = match[2].split(/,|;/).map(el => el.trim())

        const grupos = agenda.grupos
          .filter((grupo) =>
            informados.some((gp) => grupo.toUpperCase().includes(gp.toUpperCase()))
          )

        if (!grupos || grupos.length < 1) {
          const ms = `🤖: Grupo ${informados.join(
            ", "
          )} inválido! \nGrupos disponíveis: ${agenda.grupos.join(", ")}`
          msg.reply(ms);
          console.log(ms);
          return false;
        }

        const contatos = agenda
          .contatos
          .filter(contato => {
            return grupos.some(grupo => {
              return contato.grupos.join(',').toUpperCase().includes(grupo.toUpperCase())
            })
          })

        if (contatos.length === 0) {
          api.send(`Nenhum contato para o grupo ${grupos.join(", ")}!`);
          return false;
        }

        msg.reply(
          `${new Date().toLocaleString().replace(",", "")}: Participantes (${contatos.length
          }) do grupo ${grupos.join(", ")}: \n${contatos
            .map((el) => `${el.nome}:\t ${el.telefones.join(', ')}`)
            .join("\n")}`
        );
      }
    }
  } catch (e) {
    const ms = `Erro: send Group: ${e}`;
    console.error(ms);
  }
});
