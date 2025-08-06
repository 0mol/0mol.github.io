// 依赖qrcode.min.js（需引入）
const qrInput = document.getElementById('qr-input');
const qrBtn = document.getElementById('qr-btn');
const qrCanvas = document.getElementById('qr-canvas');
const qrDownload = document.getElementById('qr-download');
qrBtn.onclick = () => {
  QRCode.toCanvas(qrCanvas, qrInput.value, {width:200}, err => {
    if (!err) qrDownload.style.display = 'inline';
  });
};
qrDownload.onclick = () => {
  const url = qrCanvas.toDataURL('image/png');
  qrDownload.href = url;
  qrDownload.download = 'qrcode.png';
};
// 识别二维码（简单实现，需引入第三方库如jsQR，可后续补充） 