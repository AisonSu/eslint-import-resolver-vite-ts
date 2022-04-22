import path from "path";
import { sync,isCore} from "resolve";
const log = require("debug")("eslint-plugin-import:resolver:vite");

/**
 * enable the esbuild-register to read .ts config,this is my Special version,
 * which use build api instand of transform api with esbuild,see:
 * https://github.com/AisonSu/esbuild-register-build
 */
import { register } from "./esbuild-register/node";
/**
 * From https://github.com/evanw/esbuild/issues/1492
 * Use inject and define to slove the import.meta.url translate problem
 */
const { unregister } = register({
  inject: [`${__dirname}/importurl.js`],
  define: { "import.meta.url": "import_meta_url" },
});

export interface pluginConfig {
  configPath?: string;
  namedExport?: string;
}
export const interfaceVersion = 2;

export const resolve = function resolve(
  targetIdentify: string,
  importedPath: string,
  config: pluginConfig
): { found: boolean; path: string|null} {
  log("resolving:", targetIdentify);
  log("in file:", importedPath);
  if(isCore(targetIdentify)){
    log(`${targetIdentify} is a core module`)
    return {found:true,path:null}
  }
  try { 
    // combine default config with user defined config
    const configs = {
      configPath: "vite.config",
      ...config,
    };

    let viteConfigFile;
    configs.configPath = path.resolve(configs.configPath);
    viteConfigFile = require(configs.configPath);
    log("required vite config in:", configs.configPath);

    let viteConfig;
    if (configs.namedExport) {
      viteConfig = viteConfigFile[configs.namedExport];
    } else {
      viteConfig =
        typeof viteConfigFile.default === "function"
          ? viteConfigFile.default()
          : viteConfigFile.default;
    }

    const defaultExtensions = [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"];
    const { alias, extensions } = viteConfig.resolve ?? {};

    let actualSource = targetIdentify;

    // parse and replace alias
    if (alias) {
      Object.entries(alias as Record<string, string>).forEach(
        ([find, replacement]) => {
          actualSource = actualSource.replace(find, replacement);
        }
      );
    }

    const resolvedPath = sync(actualSource, {
      basedir: path.dirname(path.resolve(importedPath)),
      extensions: extensions ?? defaultExtensions,
    });
    log("resolved to:", resolvedPath);
    return { found: true, path: resolvedPath };
  } catch (err) {
    log("Path not found");
    return { found: false,path:null};
  }
};
