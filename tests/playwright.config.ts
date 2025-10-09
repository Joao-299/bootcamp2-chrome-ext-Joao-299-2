import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const extensionPath = path.join(__dirname, '..', 'dist');

export default defineConfig({
  
  testDir: './', 

  
  reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }]],

  use: {
    
    headless: false, 
  },

  projects: [
    {
      name: 'chromium-with-extension',
      use: {
        ...devices['Desktop Chrome'],
        
        launchOptions: {
          args: [
            `--disable-extensions-except=${extensionPath}`,
            `--load-extension=${extensionPath}`,
          ],
        },
      },
    },
  ],
});