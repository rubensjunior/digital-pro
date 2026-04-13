const sharp = require('sharp');
const pngToIco = require('png-to-ico').default || require('png-to-ico');
const fs = require('fs');

async function generate() {
  try {
    const paddedPngPath = 'src/images/logotipo-squared.png';
    const metadata = await sharp('src/images/logotipo.png').metadata();
    const size = Math.max(metadata.width, metadata.height);

    await sharp('src/images/logotipo.png')
      .resize(size, size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .toFile(paddedPngPath);

    const buf = await pngToIco(paddedPngPath);
    fs.writeFileSync('src/images/logotipo.ico', buf);
    console.log('criado logotipo.ico e logotipo-squared.png');
  } catch (err) {
    console.error(err);
  }
}

generate();
