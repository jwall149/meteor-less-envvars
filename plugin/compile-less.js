var fs = Npm.require('fs');
var path = Npm.require('path');
var less = Npm.require('less');
var Future = Npm.require('fibers/future');
var envGlobalVars = {}, envModifyVars = {};

Plugin.registerSourceHandler("less", {archMatching: 'web'}, function (compileStep) {
  var source = compileStep.read().toString('utf8');

  function parseEnvVars(options){
    try {
      var res = JSON.parse(options);
      if (res) return res;
    }
    catch (e) {
      console.log("\n less-env-globalvars: invalid JSON format in LESS_GLOBALVARS or LESS_MODIFYVARS-", e);
    }
    return {};
  };

  // Parse LESS_GLOBALVARS options enviroment variable
  if (process.env.LESS_GLOBALVARS) {
    envGlobalVars = parseEnvVars(process.env.LESS_GLOBALVARS);
  };

  if (process.env.LESS_MODIFYVARS) {
    envModifyVars = parseEnvVars(process.env.LESS_MODIFYVARS);
  }

  var options = {
    filename: compileStep.inputPath,
    // Use fs.readFileSync to process @imports. This is the bundler, so
    // that's not going to cause concurrency issues, and it means that (a)
    // we don't have to use Futures and (b) errors thrown by bugs in less
    // actually get caught.
    syncImport: true,
    paths: [path.dirname(compileStep._fullInputPath)] // for @import
  };

  var parser = new less.Parser(options);
  var astFuture = new Future;
  var sourceMap = null;
  try {
    parser.parse(source, astFuture.resolver(), {globalVars: envGlobalVars, modifyVars: envModifyVars});
    var ast = astFuture.wait();

    var css = ast.toCSS({
      sourceMap: true,
      writeSourceMap: function (sm) {
        sourceMap = JSON.parse(sm);
      }
    });
  } catch (e) {
    // less.Parser.parse is supposed to report any errors via its
    // callback. But sometimes, it throws them instead. This is
    // probably a bug in less. Be prepared for either behavior.
    compileStep.error({
      message: "Less compiler error: " + e.message,
      sourcePath: e.filename || compileStep.inputPath,
      line: e.line,
      column: e.column + 1
    });
    return;
  }


  if (sourceMap) {
    sourceMap.sources = [compileStep.inputPath];
    sourceMap.sourcesContent = [source];
    sourceMap = JSON.stringify(sourceMap);
  }

  compileStep.addStylesheet({
    path: compileStep.inputPath + ".css",
    data: css,
    sourceMap: sourceMap
  });
});;

// Register import.less files with the dependency watcher, without actually
// processing them. There is a similar rule in the stylus package.
Plugin.registerSourceHandler("import.less", function () {
  // Do nothing
});

// Backward compatibility with Meteor 0.7
Plugin.registerSourceHandler("lessimport", function () {});
