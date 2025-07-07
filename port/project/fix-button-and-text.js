const fs = require('fs');

// Script pour mettre à jour le bouton et supprimer le texte atelierpaon
function fixButtonAndText() {
  console.log('🔧 Mise à jour du bouton et suppression du texte atelierpaon\n');
  
  // Fichiers à mettre à jour
  const filesToUpdate = [
    './latelierpaon.com/_nuxt/3bd9116.js',
    './latelierpaon.com/_nuxt/a4f711a.js',
    './latelierpaon.com/_nuxt/6b00643.js'
  ];
  
  filesToUpdate.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      let updated = false;
      
      // Changer le texte du bouton
      if (content.includes('parcourir les projets')) {
        content = content.replace(/parcourir les projets/g, 'demander un devis');
        updated = true;
        console.log(`  ✅ Bouton mis à jour: "demander un devis" dans ${filePath.split('/').pop()}`);
      }
      
      // Supprimer les références à atelierpaon dans le texte
      const atelierpaonPatterns = [
        /atelierpaon/gi,
        /L'Atelier Paon/gi,
        /l'atelier paon/gi,
        /ATELIERPAON/gi
      ];
      
      atelierpaonPatterns.forEach(pattern => {
        if (pattern.test(content)) {
          // Remplacer par une chaîne vide ou un espace selon le contexte
          content = content.replace(pattern, '');
          updated = true;
        }
      });
      
      // Ajouter les classes CSS pour le bouton rose
      if (content.includes('AppButton')) {
        content = content.replace(
          /AppButton[^}]*}/g, 
          match => match.replace(/}$/, ' bg-app-pink hover:bg-app-pink-dark text-white border-app-pink"}')
        );
        updated = true;
        console.log(`  🎨 Styles roses ajoutés au bouton dans ${filePath.split('/').pop()}`);
      }
      
      if (updated) {
        fs.writeFileSync(filePath, content);
        console.log(`  📝 Fichier ${filePath.split('/').pop()} mis à jour`);
      }
    }
  });
  
  console.log('\n🎉 Modifications terminées !');
  console.log('- Bouton changé en "demander un devis" avec style rose');
  console.log('- Texte "atelierpaon" supprimé');
}

fixButtonAndText();