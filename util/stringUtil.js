const config = require('../config/config.json');

const simpleFileName = (name, number) => {
    number=formatNumber(number);
    const _name = simpleCase(name);
    return `${number}.${_name}`;
}
const simpleCase = (name) => {
    return name
      .toLowerCase()
      .replace("é", 'e')
      .replace(/[',’\-:]/, '')
      .replace(' ','')
      .replace('.','')
      .replace("♂", 'm')
      .replace("♀", 'f')
      .replace(/female$/, 'f')
      .replace(/male$/, 'm');
}

const decimalCases=config.DECIMAL_CASES;
const formatNumber = (number) => {
var _number = Array.from(String(number))
while (_number.length < decimalCases) _number.unshift(0);
return _number.join('');
}

module.exports = {
    simpleFileName,
    simpleCase,
    formatNumber
}