
import { resolve } from 'path'
import dts from 'vite-plugin-dts';
import { defineConfig } from 'vite'

import builtinModules from "builtin-modules";

const wtf = builtinModules.map(x=>`node:${x}`)

export default defineConfig( {


 plugins: [dts()],


   build: {



    rollupOptions: {
     inlineDynamicImports: true,
     // make sure to externalize deps that shouldn't be bundled
     // into your library
     external: [builtinModules,...wtf],

    },


    lib: {
   // Could also be a dictionary or array of multiple entry points
   entry: resolve(__dirname, 'src/index.ts'),
   name: 'storage_helper',
   formats: ['es', 'cjs'],
   fileName: 'storage_helper',
  },

    target: "node14",
 },



}
)
