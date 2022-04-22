# eslint-import-resolver-vite-ts

Vite resolver for `eslint-plugin-import`

This plugin will resolve the `resolve.alias` option.

support **.ts** and **.js** vite config file.

support write in both **__dirname** and **import.meta.url** to solve the path.

***
***Attention!this plugin could not instead of eslint-import-resolver-node! You should use that beside this plugin to avoid errors for insurance purposes***
### Installation
```sh
npm install --save-dev eslint-import-resolver-vite-ts
yarn add eslint-import-resolver-vite-ts -D
pnpm eslint-import-resolver-vite-ts -D
```

### How to use
```js
/**
 * vite config file
 */
import eslintPlugin from "vite-plugin-eslint";

export default {
    resolve: {
        alias: {

            // you could use the traditional way as before
            _: path.resolve(__dirname, "src")
            // OR this!this way in esm is also support here!
            '@': fileURLToPath(new URL('./src', import.meta.url))

        }
    },
    plugins: [
        eslintPlugin()
    ]
};

/**
 * eslint config file
 */
module.exports = {
    settings: {
        // use default config path to 'vite.config.*' ends with either js or ts:
        "import/resolver":{
            node:{
            },
            'eslint-import-resolver-vite-ts': {
            }
        }
        // OR use custom config:
        "import/resolver": {
            node:{
            },
            'eslint-import-resolver-vite-ts': {
                configPath: "./app1/vite.config.dev"
            }
        }
    }
}
```
### Config Options
- **configPath**: vite config file path.
  - Required: No
  - Type: string
  - Default: "vite.config",**the plugin will auto detect the extname and import it in right way if you omit it.**
  - By default, the plugin assumes the vite config file and eslintrc file are in the same directory.
- **namedExport**: named export of vite config object.
  - Required: No
  - Type: string
  - Default: [No Default]
  - **If you use a function as vite config, you must export a named vite config object.**
  ```js
  /**
   * vite config file
   */
  export const viteConfig = {};
  
  export default ({ command, mode }) => {
      // conditional config
      return viteConfig;
  }

  /**
   * eslintrc file
   */
  module.exports = {
      settings: {
          "import/resolver": {
              node:{},
              'eslint-import-resolver-vite-ts': {
                  namedExport: "viteConfig"
              }
          }
      }
  }
  ```
### Thanks and the copyright

This project is forked form pzmosquito/eslint-import-resolver-vite in 4/18/2022,the author Peter Zhang own the copyright of the origin code.Thanks for his contribution. the details please read LICENSE-origin.

I refactor it in typescript with keeping the commit history and own the other codes' copyright.the details please read LICENSE.
