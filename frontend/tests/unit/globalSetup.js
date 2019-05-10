// This is to hide an erroneous error that occurs in the console output:
//      [Vuetify] Multiple instances of Vue detected
//      See https://github.com/vuetifyjs/vuetify/issues/4068
//
// The cause of the error is a bug in how Vue CLI scaffolds up the Webpack config
// when using both Veutify and Vue-Test-Utils
// See https://github.com/vuetifyjs/vuetify/issues/4068#issuecomment-446988490 for the solution below
// Can likely remove this if the bug gets resolved

const logError = console.error; // eslint-disable-line no-console
console.error = (...args) => { // eslint-disable-line no-console
  if (
    args[0].includes('[Vuetify]') &&
        args[0].includes('https://github.com/vuetifyjs/vuetify/issues/4068')
  )
    return;
  logError(...args);
};
