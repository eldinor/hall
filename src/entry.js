const smallScreen = window.matchMedia('(max-width: 850px)');
const mobile = smallScreen.matches;

smallScreen.addEventListener('change', () => {
  window.hall?.engine.dispose();
  window.location.reload();
});

if (mobile) {
  document.documentElement.dataset.appState = 'mobile';
  document.querySelector('#mobile-placeholder').hidden = false;
} else {
  import('./main.js').catch(error => {
    console.error(error);
    document.documentElement.dataset.appState = 'error';
    document.querySelector('#error').hidden = false;
  });
}
