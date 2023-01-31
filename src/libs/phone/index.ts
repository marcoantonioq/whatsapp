import parse from "libphonenumber-js";

enum DD {
  default = 62,
}

export function format(number: string) {
  const phone = parse(number, "BR");
  return phone && phone.isValid() ? phone.formatNational() : "";
}

export function formatWhatsapp(number: string) {
  let nm: string = number.replace(/[^0-9]+/g, "");
  if (nm.length < 8) return "";
  if ([8, 9].includes(nm.length)) {
    nm = `${DD.default}${nm}`;
  }
  nm = format(nm).replace(/^\((\d+)\).*(\d{4})-(\d{4})$/g, "55$1$2$3@c.us");
  nm = nm.replace(/^(\d+)(\d{8})$/g, "55$1$2@c.us");
  return nm;
}
