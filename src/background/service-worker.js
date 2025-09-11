chrome.runtime.onInstalled.addListener(() => {
  console.log('Extensão Quick Note instalada com sucesso!');
  // Não vamos mais criar uma nota inicial. O storage começará vazio.
});