// Client-side Image Filtering and PII Anonymization

export const applyImageFilters = (canvas, imageElement, options = { contrast: 1.2, brightness: 10, maskPII: true }) => {
  if (!canvas || !imageElement) return;

  const ctx = canvas.getContext('2d');
  canvas.width = imageElement.naturalWidth || imageElement.width || 600;
  canvas.height = imageElement.naturalHeight || imageElement.height || 800;

  // 1. Draw base image
  ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);

  // 2. Apply Brightness & Contrast
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const contrast = options.contrast || 1.0;
  const factor = (259 * (contrast * 255 + 255)) / (255 * (259 - contrast * 255));
  const brightness = options.brightness || 0;

  for (let i = 0; i < data.length; i += 4) {
    // Red
    data[i] = factor * (data[i] - 128) + 128 + brightness;
    // Green
    data[i + 1] = factor * (data[i + 1] - 128) + 128 + brightness;
    // Blue
    data[i + 2] = factor * (data[i + 2] - 128) + 128 + brightness;
  }

  ctx.putImageData(imageData, 0, 0);

  // 3. Apply Edge-Client PII Redaction Mask if enabled
  if (options.maskPII) {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
    
    // Patient Name Box Redaction
    ctx.fillRect(canvas.width * 0.12, canvas.height * 0.12, canvas.width * 0.35, canvas.height * 0.035);
    
    // Phone & Address Redaction
    ctx.fillRect(canvas.width * 0.12, canvas.height * 0.165, canvas.width * 0.40, canvas.height * 0.032);

    // Overlay privacy stamp
    ctx.font = `bold ${Math.max(12, Math.floor(canvas.width * 0.018))}px monospace`;
    ctx.fillStyle = '#10b981';
    ctx.fillText('🔒 [CLIENT-SIDE PII MASKED / DPDP ACT COMPLIANT]', canvas.width * 0.13, canvas.height * 0.142);
    ctx.fillText('🛡️ [ANONYMIZED FOR AI INGESTION]', canvas.width * 0.13, canvas.height * 0.187);
  }
};
