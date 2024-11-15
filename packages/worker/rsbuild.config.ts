import { defineConfig } from '@rsbuild/core'
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin'

export default defineConfig({
  plugins: [
    pluginModuleFederation({
      name: 'quincunx_worker',
      remotes: {
        remote1: 'remote1@http://localhost:6001/mf-manifest.json',
      },
      shared: ['rxjs', 'zod'],
    }),
  ],
})
