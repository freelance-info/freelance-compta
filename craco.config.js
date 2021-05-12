let target = 'web';
if (process.env.REACT_APP_MODE === 'electron') {
  target = 'electron-renderer';
}
// eslint-disable-next-line no-console
console.log(`craco.config.js: setting webpack target to: ${target}`);

module.exports = { webpack: { configure: { target } } };
