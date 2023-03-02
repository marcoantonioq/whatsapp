import https from "https";
import http from "http";
import { URL } from "url";

(async () => {
  let resp = await httpPost(
    "https://rest.apitemplate.io/v2/create-image?template_id=d9277b2384e1da86",
    JSON.stringify({
      overrides: [
        {
          name: "text-type",
          text: "Aviso",
        },
        {
          name: "text-title",
          text: "Reunião de evangelização",
        },
        {
          name: "text-msg",
          text: `\n*Hoje - 19h30*\n\nCasa Irmã Domingas\n\n\n<small>Deus é o nosso refúgio e nossa fortaleza, socorro bem presente nas angústias. Portanto não temeremos, ainda que a terra se mude, e ainda que os montes se transportem para o meio dos mares. Ainda que as águas tumultuem e se turvem, ainda que os montes se abalem com o seu fragor`,
        },
        {
          name: "text-obs",
          text: `Próximas reuniões de evangelização: 
03/03 às 19h30 -  Ir. Domingas - Papyrus
07/03 às 19h30 -  Ir. Cristina - Portal da Cerra
12/03 às 14h30 -  Ir. Ari - São Carlos
14/03 às 19h30 -  Ir. Francisco - Papyrus 
21/03 às 19h30 -  Ir. Sebastião - Jardim das Acácias`,
        },
        {
          name: "text-footer",
          text: `Roda pé!`,
        },
      ],
    }),
    "77dcMTEzNzU6ODQyMTpYM3ZkWERSZmNVVVhwZTB"
  );
  console.log(resp);
})();

async function httpPost(url_api: string, data: string, apiKey: string) {
  const uri = new URL(url_api);
  const fx = uri.protocol === "https:" ? https : http;
  const opts = {
    method: "POST",
    hostname: uri.hostname,
    port: uri.port,
    path: `${uri.pathname}${uri.search == null ? "" : uri.search}`,
    protocol: uri.protocol,
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": apiKey,
    },
  };

  return new Promise((resolve, reject) => {
    const req = fx.request(opts, (res: any) => {
      res.setEncoding("utf8");
      let responseBody = "";
      res.on("data", (chunk: any) => (responseBody += chunk));
      res.on("end", () => resolve(responseBody));
    });

    req.on("error", (err: any) => reject(err));
    req.write(data);
    req.end();
  });
}
