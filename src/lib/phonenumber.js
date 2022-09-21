const parsePhoneNumber = require('libphonenumber-js');

function format(number) {
  try {
    if (!parsePhoneNumber.isValidNumber(number, 'BR')) {
      throw new Error('Numero inválido!');
    }

    const newNumber = parsePhoneNumber(number, 'BR').format('E.164');
    return newNumber.replace(/(\+)(55)(\d\d).*(\d{8})$/gi, '$2$3$4') + '@c.us';
  } catch (e) {}
}

module.exports = {
  format,
};
