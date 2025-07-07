const fs = require('fs');
const path = require('path');

// Fonction pour unifier les assets similaires
function unifyAssets() {
  const imgDir = 'latelierpaon.com/_nuxt/img';
  const files = fs.readdirSync(imgDir);
  
  // Grouper les fichiers par type
  const assetGroups = {
    mountains: files.filter(f => f.includes('mountains')),
    floor: files.filter(f => f.includes('floor')),
    logo: files.filter(f => f.includes('logo')),
    other: files.filter(f => !f.includes('mountains') && !f.includes('floor') && !f.includes('logo'))
  };

  console.log('=== GROUPES D\'ASSETS ===');
  Object.entries(assetGroups).forEach(([group, fileList]) => {
    if (fileList.length > 0) {
      console.log(`\n${group.toUpperCase()}:`);
      fileList.forEach(file => {
        const filePath = path.join(imgDir, file);
        const stats = fs.statSync(filePath);
        console.log(`  - ${file} (${stats.size} bytes)`);
      });
    }
  });

  // Analyser les fichiers JavaScript pour voir quels assets sont utilisés
  console.log('\n=== ANALYSE D\'UTILISATION DES ASSETS ===');
  const jsFiles = ['latelierpaon.com/_nuxt/3bd9116.js', 'latelierpaon.com/_nuxt/a4f711a.js'];
  
  jsFiles.forEach(jsFile => {
    if (fs.existsSync(jsFile)) {
      const content = fs.readFileSync(jsFile, 'utf8');
      console.log(`\nDans ${jsFile}:`);
      
      assetGroups.mountains.forEach(file => {
        if (content.includes(file)) {
          console.log(`  ✓ ${file} est utilisé`);
        }
      });
      
      assetGroups.floor.forEach(file => {
        if (content.includes(file)) {
          console.log(`  ✓ ${file} est utilisé`);
        }
      });
    }
  });
}

unifyAssets();