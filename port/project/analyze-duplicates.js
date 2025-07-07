const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Fonction pour calculer le hash d'un fichier
function getFileHash(filePath) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash('md5');
    hashSum.update(fileBuffer);
    return hashSum.digest('hex');
  } catch (error) {
    return null;
  }
}

// Analyser les doublons dans le dossier _nuxt
function analyzeDuplicates() {
  const nuxtDir = './latelierpaon.com/_nuxt';
  const duplicates = {};
  const fileHashes = {};
  
  // Fonction récursive pour parcourir les dossiers
  function scanDirectory(dir) {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else {
        const hash = getFileHash(fullPath);
        if (hash) {
          if (fileHashes[hash]) {
            if (!duplicates[hash]) {
              duplicates[hash] = [fileHashes[hash]];
            }
            duplicates[hash].push(fullPath);
          } else {
            fileHashes[hash] = fullPath;
          }
        }
      }
    });
  }
  
  scanDirectory(nuxtDir);
  
  console.log('=== ANALYSE DES DOUBLONS ===');
  let totalDuplicates = 0;
  let totalSize = 0;
  
  Object.keys(duplicates).forEach(hash => {
    const files = duplicates[hash];
    console.log(`\nGroupe de doublons (${files.length} fichiers):`);
    files.forEach(file => {
      const size = fs.statSync(file).size;
      totalSize += size;
      console.log(`  - ${file} (${(size/1024).toFixed(2)} KB)`);
    });
    totalDuplicates += files.length - 1; // -1 car on garde un fichier
  });
  
  console.log(`\n=== RÉSUMÉ ===`);
  console.log(`Fichiers dupliqués trouvés: ${totalDuplicates}`);
  console.log(`Espace récupérable: ${(totalSize/1024/1024).toFixed(2)} MB`);
  
  return duplicates;
}

// Analyser les assets par catégorie
function analyzeAssetCategories() {
  const imgDir = './latelierpaon.com/_nuxt/img';
  const categories = {
    mountains: [],
    floor: [],
    logos: [],
    backgrounds: [],
    other: []
  };
  
  if (fs.existsSync(imgDir)) {
    const files = fs.readdirSync(imgDir);
    
    files.forEach(file => {
      const filePath = path.join(imgDir, file);
      if (file.includes('mountain')) {
        categories.mountains.push(filePath);
      } else if (file.includes('floor')) {
        categories.floor.push(filePath);
      } else if (file.includes('logo')) {
        categories.logos.push(filePath);
      } else if (file.includes('bg') || file.includes('white')) {
        categories.backgrounds.push(filePath);
      } else {
        categories.other.push(filePath);
      }
    });
  }
  
  console.log('\n=== CATÉGORIES D\'ASSETS ===');
  Object.keys(categories).forEach(category => {
    if (categories[category].length > 0) {
      console.log(`\n${category.toUpperCase()}:`);
      categories[category].forEach(file => {
        const size = fs.statSync(file).size;
        console.log(`  - ${path.basename(file)} (${(size/1024).toFixed(2)} KB)`);
      });
    }
  });
  
  return categories;
}

// Exécuter l'analyse
console.log('🔍 Analyse des fichiers dupliqués...\n');
const duplicates = analyzeDuplicates();
const categories = analyzeAssetCategories();

// Sauvegarder les résultats
fs.writeFileSync('duplicates-report.json', JSON.stringify({
  duplicates,
  categories,
  timestamp: new Date().toISOString()
}, null, 2));

console.log('\n✅ Rapport sauvegardé dans duplicates-report.json');