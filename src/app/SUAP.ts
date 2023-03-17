import { menu } from "./Menus";
import { SUAPUpdateUser } from "./handlers/suap";

export const SUAP: menu[] = [
  {
    label: "Atualizar cadastro no SUAP?",
    regex: "[0-9]{7}",
    action: SUAPUpdateUser,
  },
];
