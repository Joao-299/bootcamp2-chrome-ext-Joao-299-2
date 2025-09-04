chrome.runtime.onInstalled.addListener(() => {
  console.log('Extensão Quick Note instalada com sucesso!');
  // Você pode definir um valor inicial aqui se quiser
  chrome.storage.sync.get(['quickNote'], (result) => {
    if (result.quickNote === undefined) {
      chrome.storage.sync.set({ quickNote: 'Sua primeira anotação!' });
    }
  });
});