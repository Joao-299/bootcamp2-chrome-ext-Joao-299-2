import { test, expect, chromium, type BrowserContext } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const extensionPath = path.resolve(__dirname, '..', 'dist');

async function getPopupUrl(context: BrowserContext): Promise<string> {
    let extensionId = '';

    for (let i = 0; i < 10; i++) {
        const serviceWorkers = context.serviceWorkers();
        if (serviceWorkers.length > 0) {
            extensionId = serviceWorkers[0].url().split('/')[2];
            break;
        }
        await new Promise(resolve => setTimeout(resolve, 100)); 
    }

    if (!extensionId) {
        throw new Error("Não foi possível encontrar o Service Worker da extensão.");
    }

    return `chrome-extension://${extensionId}/src/popup/popup.html`;
}

test.describe('Testes End-to-End da Extensão Quick Note', () => {
    let browserContext: BrowserContext;

    test.beforeAll(async () => {
        browserContext = await chromium.launchPersistentContext('', {
            headless: true, 
            args: [
                `--disable-extensions-except=${extensionPath}`,
                `--load-extension=${extensionPath}`,
            ],
        });
    });


    test.afterAll(async () => {
        await browserContext.close();
    });

    test('deve salvar, carregar e persistir uma anotação', async () => {
        const popupUrl = await getPopupUrl(browserContext);
        const page = await browserContext.newPage();

        await page.goto(popupUrl);

        const testNote = `Anotação de teste criada em ${Date.now()}`;
        await page.locator('#note-area').fill(testNote);
        await page.locator('#save-btn').click();

        await expect(page.locator('#status-msg')).toHaveText('Anotação salva!');

        await page.reload();

        const savedNote = await page.locator('#note-area').inputValue();
        expect(savedNote).toBe(testNote);

        await page.close();
    });
});