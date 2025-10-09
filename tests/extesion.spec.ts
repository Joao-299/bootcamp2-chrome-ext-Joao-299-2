import { test, expect, chromium, type BrowserContext } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const extensionPath = path.resolve(__dirname, '..', 'dist');

let browserContext: BrowserContext;

test.beforeAll(async () => {
    browserContext = await chromium.launchPersistentContext('', {
        headless: true,
        args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`],
    });
});

test.afterAll(async () => {
    await browserContext.close();
});

test('deve salvar e carregar uma anotação', async () => {
    const backgroundPage = browserContext.backgroundPages()[0];
    if (!backgroundPage) {
        throw new Error("Não foi possível encontrar a página de background da extensão.");
    }

    const extensionId = backgroundPage.url().split('/')[2];
    const popupUrl = `chrome-extension://${extensionId}/src/popup/popup.html`;

    const page = await browserContext.newPage();
    await page.goto(popupUrl);

    const testNote = `Anotação final de teste em ${Date.now()}`;
    await page.locator('#note-area').fill(testNote);
    await page.locator('#save-btn').click();

    await expect(page.locator('#status-msg')).toHaveText('Anotação salva!');

    await page.reload();

    const savedNote = await page.locator('#note-area').inputValue();
    expect(savedNote).toBe(testNote);

    await page.close();
});