const fs = require('fs');
const path = require('path');

function deleteMinCssFiles(dir) {
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Récursion dans les sous-dossiers
        deleteMinCssFiles(fullPath);
      } else if (item.endsWith('.min.css')) {
        // Supprimer le fichier .min.css
        fs.unlinkSync(fullPath);
        console.log(`Supprimé: ${fullPath}`);
      }
    }
  } catch (error) {
    console.error(`Erreur lors du traitement de ${dir}:`, error.message);
  }
}

console.log('Recherche et suppression des fichiers .min.css...');
deleteMinCssFiles('.');
console.log('Terminé.');