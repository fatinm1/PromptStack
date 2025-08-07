const fs = require('fs');
const path = require('path');

// The SVG content from your logo.svg file
const svgContent = `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#667eea;stop-opacity:1" /><stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" /></linearGradient><linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" /><stop offset="100%" style="stop-color:#f0f0f0;stop-opacity:1" /></linearGradient></defs><circle cx="24" cy="24" r="22" fill="url(#bgGradient)" stroke="rgba(255,255,255,0.2)" stroke-width="2"/><g stroke="url(#textGradient)" stroke-width="1.5" fill="none" opacity="0.9"><circle cx="24" cy="16" r="2" fill="url(#textGradient)"/><circle cx="20" cy="20" r="2" fill="url(#textGradient)"/><circle cx="28" cy="20" r="2" fill="url(#textGradient)"/><circle cx="24" cy="24" r="2" fill="url(#textGradient)"/><circle cx="20" cy="28" r="2" fill="url(#textGradient)"/><circle cx="28" cy="28" r="2" fill="url(#textGradient)"/><circle cx="24" cy="32" r="2" fill="url(#textGradient)"/><line x1="24" y1="16" x2="20" y2="20"/><line x1="24" y1="16" x2="28" y2="20"/><line x1="20" y1="20" x2="24" y2="24"/><line x1="28" y1="20" x2="24" y2="24"/><line x1="24" y1="24" x2="20" y2="28"/><line x1="24" y1="24" x2="28" y2="28"/><line x1="20" y1="28" x2="24" y2="32"/><line x1="28" y1="28" x2="24" y2="32"/><line x1="20" y1="20" x2="28" y2="28"/><line x1="28" y1="20" x2="20" y2="28"/></g><g stroke="url(#textGradient)" stroke-width="2" fill="none" opacity="0.8"><path d="M 12 18 L 16 18 L 16 30 L 12 30" stroke-linecap="round"/><path d="M 36 18 L 32 18 L 32 30 L 36 30" stroke-linecap="round"/></g><g stroke="url(#textGradient)" stroke-width="1.5" fill="none" opacity="0.7"><line x1="16" y1="36" x2="32" y2="36"/><path d="M 20 36 L 20 40 L 28 40 L 28 36" stroke-linecap="round"/><circle cx="20" cy="36" r="1.5" fill="url(#textGradient)"/><circle cx="28" cy="36" r="1.5" fill="url(#textGradient)"/><circle cx="20" cy="40" r="1.5" fill="url(#textGradient)"/><circle cx="28" cy="40" r="1.5" fill="url(#textGradient)"/></g><g fill="url(#textGradient)" opacity="0.6"><circle cx="14" cy="14" r="0.8"/><circle cx="34" cy="14" r="0.8"/><circle cx="14" cy="34" r="0.8"/><circle cx="34" cy="34" r="0.8"/></g></svg>`;

// Create a simple HTML file that will convert the SVG to PNG
const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Favicon Generator</title>
</head>
<body>
    <div id="output"></div>
    <script>
        const svgContent = \`${svgContent}\`;
        
        function createFavicon(size, filename) {
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            
            const img = new Image();
            img.onload = function() {
                ctx.drawImage(img, 0, 0, size, size);
                
                // Create download link
                const link = document.createElement('a');
                link.download = filename;
                link.href = canvas.toDataURL();
                link.click();
                
                console.log('Generated:', filename);
            };
            
            const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(svgBlob);
            img.src = url;
        }
        
        // Generate all favicon sizes
        setTimeout(() => {
            createFavicon(16, 'icon-16x16.png');
            setTimeout(() => createFavicon(32, 'icon-32x32.png'), 100);
            setTimeout(() => createFavicon(192, 'icon-192x192.png'), 200);
            setTimeout(() => createFavicon(512, 'icon-512x512.png'), 300);
            setTimeout(() => createFavicon(180, 'apple-touch-icon.png'), 400);
        }, 500);
    </script>
</body>
</html>
`;

// Write the HTML file
fs.writeFileSync('temp-favicon-generator.html', htmlContent);

console.log('Created temp-favicon-generator.html');
console.log('Open this file in your browser to generate favicon files');
console.log('Then move the downloaded files to the public/ directory'); 