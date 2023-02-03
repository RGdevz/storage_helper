
import { resolve } from 'path'
import dts from 'vite-plugin-dts';
import { defineConfig } from 'vite'
export default defineConfig( {


 plugins: [dts()],


   build: {

    rollupOptions: {
     // make sure to externalize deps that shouldn't be bundled
     // into your library
     external: ['async-mutex','fs-extra'],

    },


    lib: {
   // Could also be a dictionary or array of multiple entry points
   entry: resolve(__dirname, 'src/index.ts'),
   name: 'storage_helper',
   formats: ['es', 'cjs'],
   fileName: 'storage_helper',
  },

  target: 'esnext',

 },



}
)