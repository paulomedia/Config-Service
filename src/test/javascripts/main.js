var tests = [];
for (var file in window.__karma__.files) {
  if (window.__karma__.files.hasOwnProperty(file)) {
    if (/.*spec\.js$/.test(file)) {
      tests.push(file);
    }
  }
}

// requirejs.config({
//     // Karma serves files from '/base'
//     baseUrl: '/base/src/.tmp/merge/js',

//     paths: {
//         'jasmine-jquery': '/base/src/test/lib/required/jasmine-jquery',
// 		'polyfill': 'core/polyfill-launcher'
//     },

//     shim: {
//       jquery: {
//           exports: '$'
//       }
//     },
//     // ask Require.js to load these files (all our tests)
//     deps: tests,

//     // start test run, once Require.js is done
//     callback: window.__karma__.start
// });
