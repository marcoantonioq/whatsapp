const parsePhoneNumber = require("libphonenumber-js");

function format(number) {
  const regex = /(\+55)(\d\d|).*(\d{8})$/gi;
  try {
    if (!parsePhoneNumber.isValidNumber(number, "BR")) {
      throw new Error(`Numero ${number} inválido!`);
    }
    return (
      parsePhoneNumber(number, "BR").format("E.164").replace(regex, "55$2$3") +
      "@c.us"
    );
  } catch (e) {}
}

module.exports = {
  format,
};
