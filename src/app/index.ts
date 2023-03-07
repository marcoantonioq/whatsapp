import { components, initialize } from "./start";

(async () => {
  await components();
  console.log("Módulos iniciado!");
  await initialize();
  console.log("APP start!");
})();
