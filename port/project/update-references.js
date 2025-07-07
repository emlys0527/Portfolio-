const fs = require('fs');
const path = require('path');

// Mapping des anciens fichiers vers les nouveaux
const assetMapping = {
  // Montagnes dark mode vers light mode
  'mountains_atelierpaon_2.df731db.svg': 'mountains_atelierpaon_2.e02f9e6.svg',
  'mountains-middle_atelierpaon_3.9af468f.svg': 'mountains-middle_atelierpaon_3.6ecf003.svg',
  'mountains-front_atelierpaon_4.752e830.svg': 'mountains-front_atelierpaon_4.7d8acae.svg',
  'floor_atelierpaon_5.58cc03e.svg': 'floor_atelierpaon_5.2e6831c.svg'
};

// Mettre à jour les références dans les fichiers JavaScript
function updateJavaScriptReferences() {
  const jsFiles = [
    './latelierpaon.com/_nuxt/3bd9116.js',
    './latelierpaon.com/_nuxt/a4f711a.js'
  ];
  
  jsFiles.forEach(jsFile => {
    if (fs.existsSync(jsFile)) {
      let content = fs.readFileSync(jsFile, 'utf8');
      let updated = false;
      
      // Remplacer les références aux anciens assets
      Object.keys(assetMapping).forEach(oldAsset => {
        const newAsset = assetMapping[oldAsset];
        const oldHash = oldAsset.split('.')[1]; // Extraire le hash
        const newHash = newAsset.split('.')[1];
        
        if (content.includes(oldHash)) {
          content = content.replace(new RegExp(oldHash, 'g'), newHash);
          updated = true;
          console.log(`  ✅ Remplacé ${oldHash} par ${newHash} dans ${path.basename(jsFile)}`);
        }
      });
      
      if (updated) {
        fs.writeFileSync(jsFile, content);
        console.log(`  📝 Fichier ${path.basename(jsFile)} mis à jour`);
      }
    }
  });
}

// Créer un CSS unifié pour le dark mode
function createUnifiedCSS() {
  const unifiedCSS = `
/* CSS unifié pour L'Atelier Paon */
/* Utilisation d'un seul set d'assets avec variations CSS */

.plan--second {
  background-image: url(/img/mountains_atelierpaon_2.e02f9e6.svg);
}

.plan--third {
  background-image: url(/img/mountains-middle_atelierpaon_3.6ecf003.svg);
}

.plan--fourth {
  background-image: url(/img/mountains-front_atelierpaon_4.7d8acae.svg);
}

.plan--fifth {
  background-image: url(/img/floor_atelierpaon_5.2e6831c.svg);
}

/* Dark mode avec filtres CSS au lieu d'assets séparés */
.dark .plan--second,
.dark .plan--third,
.dark .plan--fourth,
.dark .plan--fifth {
  filter: brightness(0.8) contrast(1.2);
}

/* Optimisation des animations */
.plan--second,
.plan--third,
.plan--fourth {
  animation: fifth-entrance 2s ease-in-out both;
  transform-origin: bottom;
}

.plan--fifth {
  animation: fade-in 2s ease-in-out both;
  transform-origin: bottom;
}

@keyframes fifth-entrance {
  0% {
    transform: translateY(60%) scaleY(8) scaleX(18);
  }
  100% {
    transform: translateY(0) scale(1);
  }
}

@keyframes fade-in {
  0% {
    opacity: 0;
    transform: translateY(100%);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
`;

  fs.writeFileSync('./latelierpaon.com/_nuxt/unified-styles.css', unifiedCSS);
  console.log('✅ CSS unifié créé: unified-styles.css');
}

console.log('🔄 Mise à jour des références...\n');
updateJavaScriptReferences();
createUnifiedCSS();

console.log('\n✅ Références mises à jour avec succès!');