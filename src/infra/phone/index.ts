// import parse from "libphonenumber-js";

// enum DD {
//   default = 62,
// }

// export function br(number: string) {
//   const phone = parse(number, "BR");
//   return phone && phone.isValid() ? phone.formatNational() : "";
// }

// export function format(number: string): string {
//   let nm: string = number.replace(/\D/gim, "");
//   if (nm.length < 8) return "";
//   if ([8, 9].includes(nm.length)) {
//     nm = `${DD.default}${nm}`;
//   }
//   nm = br(nm).replace(/^\((\d+)\).*(\d{4})-(\d{4})$/g, "$1$2$3");
//   nm = nm.replace(/^(\d+)(\d{8})$/g, "$1$2");
//   return nm;
// }
