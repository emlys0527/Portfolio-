const fs = require('fs');

// Script pour mettre à jour toutes les références de couleur violet vers rose
function updateColors() {
  console.log('🎨 Mise à jour des couleurs : violet → rose\n');
  
  // Mapping des couleurs
  const colorMapping = {
    '#662483': '#e91e63',  // Violet principal → Rose Material Design
    'violet': 'pink',
    'app-violet': 'app-pink'
  };
  
  // Fichiers à mettre à jour
  const filesToUpdate = [
    './latelierpaon.com/_nuxt/unified-styles.css',
    './latelierpaon.com/_nuxt/3bd9116.js',
    './latelierpaon.com/index.html'
  ];
  
  filesToUpdate.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      let updated = false;
      
      // Remplacer les couleurs
      Object.keys(colorMapping).forEach(oldColor => {
        const newColor = colorMapping[oldColor];
        if (content.includes(oldColor)) {
          content = content.replace(new RegExp(oldColor, 'g'), newColor);
          updated = true;
          console.log(`  ✅ ${oldColor} → ${newColor} dans ${filePath.split('/').pop()}`);
        }
      });
      
      if (updated) {
        fs.writeFileSync(filePath, content);
        console.log(`  📝 Fichier ${filePath.split('/').pop()} mis à jour`);
      }
    }
  });
  
  console.log('\n🎉 Changement de couleur terminé !');
  console.log('Le site utilise maintenant du rose (#e91e63) au lieu du violet.');
}

updateColors();