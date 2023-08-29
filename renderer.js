const { webFrame, ipcRenderer } = require('electron');

let zoomFactor = webFrame.getZoomFactor();

console.log("Initial zoom factor:", zoomFactor);

window.addEventListener('wheel', function(e) {
  if (e.ctrlKey) {
    e.preventDefault();
    zoomFactor += e.deltaY > 0 ? -0.1 : 0.1;
    if (zoomFactor < 0.5) zoomFactor = 0.5;
    if (zoomFactor > 3.0) zoomFactor = 3.0;
    webFrame.setZoomFactor(zoomFactor);
    ipcRenderer.send('zoom-factor-changed', zoomFactor);
  }
});

window.addEventListener('keydown', function(e) {
  if (e.ctrlKey) {
    if (e.code === 'Equal') {
      e.preventDefault();
      zoomFactor += 0.1;
      if (zoomFactor > 3.0) zoomFactor = 3.0;
      webFrame.setZoomFactor(zoomFactor);
      ipcRenderer.send('zoom-factor-changed', zoomFactor);
    }
  }
});
