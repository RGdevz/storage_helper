
import { resolve } from 'path'
import dts from 'vite-plugin-dts';
import { defineConfig } from 'vite'

import builtinModules from "builtin-modules";
import packageJson from "./package.json";

const dependencies = Object.keys({
 ...packageJson.dependencies,
 ...packageJson.devDependencies,
}
);


const strings = builtinModules.map(x=>`node:${x}`)

const list = [...builtinModules,...strings,...dependencies]

for (const item of list){
if (typeof item !== 'string') throw new Error('bad list')
}

export default defineConfig( {


 plugins: [dts()],


   build: {



    rollupOptions: {
     inlineDynamicImports: true,
     // make sure to externalize deps that shouldn't be bundled
     // into your library
     external: list,

    },

minify:false,
    lib: {
   // Could also be a dictionary or array of multiple entry points
   entry: resolve(__dirname, 'src/index.ts'),
   name: 'storage_helper',
   formats: [ 'cjs'],
   fileName: 'storage_helper',
  },

    target: "node14",
 },



}
)
