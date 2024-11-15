import { defineConfig } from '@rsbuild/core'
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin'

export default defineConfig({
  plugins: [
    pluginModuleFederation({
      name: 'quincunx_operators',
      exposes: {
        './timer': './src/timer/index.ts',
        './dateFormatter': './src/dateFormatter/index.ts',
      },
      shared: ['react', 'react-dom', 'rxjs', 'zod'],
    }),
  ],
  server: {
    port: 6001,
  },
})
