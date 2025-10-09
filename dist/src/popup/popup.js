document.addEventListener('DOMContentLoaded', () => {
    const noteArea = document.getElementById('note-area');
    const saveBtn = document.getElementById('save-btn');
    const statusMsg = document.getElementById('status-msg');

    // 1. Carregar a anotação salva quando o popup abrir
    chrome.storage.sync.get(['quickNote'], (result) => {
        if (result.quickNote) {
            noteArea.value = result.quickNote;
        }
    });

    // 2. Salvar a anotação ao clicar no botão
    saveBtn.addEventListener('click', () => {
        const noteText = noteArea.value;
        chrome.storage.sync.set({ quickNote: noteText }, () => {
            statusMsg.textContent = 'Anotação salva!';
            // A mensagem desaparece após 3 segundos
            setTimeout(() => {
                statusMsg.textContent = '';
            }, 3000);
        });
    });
});