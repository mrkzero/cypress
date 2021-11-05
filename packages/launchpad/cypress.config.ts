import { defineConfig } from 'cypress'
const { startDevServer } = require('@cypress/vite-dev-server')

export default defineConfig({
  'projectId': 'sehy69',
  'viewportWidth': 800,
  'viewportHeight': 850,
  'retries': {
    'runMode': 2,
    'openMode': 0,
  },
  'nodeVersion': 'system',
  'testFiles': '**/*.spec.{js,ts,tsx,jsx}',
  'reporter': '../../node_modules/cypress-multi-reporters/index.js',
  'reporterOptions': {
    'configFile': '../../mocha-reporter-config.json',
  },
  'componentFolder': 'src',
  'component': {
    'testFiles': '**/*.spec.{js,ts,tsx,jsx}',
    'supportFile': 'cypress/component/support/index.ts',
    'pluginsFile': 'cypress/component/plugins/index.js',
    setupNodeEvents (on, config) {
      // TODO: (Alejandro) -> this goes on setupDevServ
      on('dev-server:start', async (options) => {
        return startDevServer({
          options,
          viteConfig: {
            // TODO(tim): Figure out why this isn't being picked up
            optimizeDeps: {
              include: [
                '@headlessui/vue',
                'vue3-file-selector',
                'just-my-luck',
                'combine-properties',
                'faker',
              ],
            },
          },
        })
      })

      return config
    },
  },
  'e2e': {
    'supportFile': 'cypress/e2e/support/e2eSupport.ts',
    'integrationFolder': 'cypress/e2e/integration',
    'pluginsFile': 'cypress/e2e/plugins/index.ts',
    setupNodeEvents (on, config) {
      return config
    },
  },
})
