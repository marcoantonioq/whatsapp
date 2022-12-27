import parse from "libphonenumber-js";

export function format(number: string) {
  const phone = parse(number, "BR")
  if (phone && phone.isValid()) {
    return phone.formatNational()
  } else {
    throw `Número inválido: ${number}`
  }
}

export function formatWhatsapp(number: string) {
  return format(number).replace(/^\((\d+)\).*(\d{4})-(\d{4})$/g, "55$1$2$3@c.us")
}
