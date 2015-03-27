Package.describe({
  name: "jwall149:less-env-globalvars",
  summary: "The offical LESS + Environment Global Variables",
  version: "1.0.1",
  git: "https://github.com/jwall149/meteor-less-envvars"
});

Package.registerBuildPlugin({
  name: "compileLess",
  use: [],
  sources: [
    'plugin/compile-less.js'
  ],
  npmDependencies: {
    // Fork of 1.7.4 deleted large unused files in dist directory.
    "less": "https://github.com/meteor/less.js/tarball/4ccb7fc94321a6a85d592cdf46579425add1570f"
  }
});

Package.on_test(function (api) {
  api.use(['test-helpers', 'tinytest', 'less', 'templating']);
  api.add_files(['less_tests.less', 'less_tests.js', 'less_tests.html',
                 'less_tests_empty.less'],
                'client');
});
