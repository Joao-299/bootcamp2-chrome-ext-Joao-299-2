import { test, expect, chromium, type BrowserContext, type Page } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const extensionPath = path.resolve(__dirname, '..', 'dist');

let browserContext: BrowserContext;
let backgroundPage: Page;

// --- O RADAR INTELIGENTE ---
// Esta função vai procurar ativamente pela página de background por até 15 segundos.
async function findBackgroundPage(context: BrowserContext): Promise<Page> {
    const timeout = 15000; // Tempo máximo de espera: 15 segundos
    const interval = 500;  // Tentar a cada meio segundo
    let elapsedTime = 0;

    while (elapsedTime < timeout) {
        const pages = context.backgroundPages();
        if (pages.length > 0) {
            console.log("SUCESSO: Radar encontrou a página de background!");
            return pages[0];
        }
        await new Promise(resolve => setTimeout(resolve, interval));
        elapsedTime += interval;
    }
    throw new Error("FALHA: Radar não encontrou a página de background dentro do tempo limite.");
}

test.beforeAll(async () => {
    browserContext = await chromium.launchPersistentContext('', {
        headless: true,
        args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`],
    });
    // Usamos o radar para garantir que a página de background está pronta
    backgroundPage = await findBackgroundPage(browserContext);
});

test.afterAll(async () => {
    await browserContext.close();
});

test('deve salvar e carregar uma anotação', async () => {
    if (!backgroundPage) {
        throw new Error("Teste abortado: página de background não foi inicializada.");
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