const fs = require('fs');

// Script pour supprimer le bouton et les logos
function removeButtonAndLogo() {
  console.log('🗑️ Suppression du bouton et des logos\n');
  
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
      
      // Supprimer les références au bouton AppButton
      if (content.includes('AppButton')) {
        // Remplacer les instances d'AppButton par un div vide ou les supprimer
        content = content.replace(/n\("AppButton"[^}]*}\)/g, '');
        content = content.replace(/AppButton[^,}]*,?/g, '');
        content = content.replace(/,AppButton:[^}]*\.default/g, '');
        updated = true;
        console.log(`  ✅ Bouton AppButton supprimé dans ${filePath.split('/').pop()}`);
      }
      
      // Supprimer les méthodes liées au bouton
      if (content.includes('gotoAtelier')) {
        content = content.replace(/gotoAtelier:function\(\)[^}]*}/g, '');
        content = content.replace(/,gotoAtelier/g, '');
        updated = true;
        console.log(`  ✅ Méthode gotoAtelier supprimée dans ${filePath.split('/').pop()}`);
      }
      
      // Supprimer les références aux logos
      const logoPatterns = [
        /logo[^"']*\.(svg|png|jpg|jpeg)/gi,
        /img[^"']*logo[^"']*/gi,
        /"[^"]*logo[^"]*"/gi,
        /'[^']*logo[^']*'/gi
      ];
      
      logoPatterns.forEach(pattern => {
        if (pattern.test(content)) {
          content = content.replace(pattern, '""');
          updated = true;
        }
      });
      
      if (updated) {
        fs.writeFileSync(filePath, content);
        console.log(`  📝 Fichier ${filePath.split('/').pop()} mis à jour`);
      }
    }
  });
  
  console.log('\n🎉 Suppression terminée !');
  console.log('- Bouton "demander un devis" supprimé');
  console.log('- Logos masqués via CSS');
  console.log('- Interface épurée');
}

removeButtonAndLogo();