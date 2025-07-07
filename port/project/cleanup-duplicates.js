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
    console.error(`Erreur lors du calcul du hash pour ${filePath}:`, error.message);
    return null;
  }
}

// Fonction pour trouver les fichiers dupliqués
function findDuplicates(directory) {
  const files = {};
  const duplicates = [];

  function scanDirectory(dir) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else {
        const hash = getFileHash(fullPath);
        if (hash) {
          if (files[hash]) {
            duplicates.push({
              original: files[hash],
              duplicate: fullPath,
              hash: hash
            });
          } else {
            files[hash] = fullPath;
          }
        }
      }
    }
  }

  scanDirectory(directory);
  return duplicates;
}

// Analyser les fichiers SVG spécifiquement
function analyzeSVGFiles() {
  const svgDir = 'latelierpaon.com/_nuxt/img';
  const svgFiles = fs.readdirSync(svgDir).filter(file => file.endsWith('.svg'));
  
  console.log('\n=== ANALYSE DES FICHIERS SVG ===');
  
  const groups = {};
  svgFiles.forEach(file => {
    const baseName = file.replace(/\.[a-f0-9]+\.svg$/, '.svg');
    if (!groups[baseName]) {
      groups[baseName] = [];
    }
    groups[baseName].push(file);
  });

  Object.entries(groups).forEach(([baseName, files]) => {
    if (files.length > 1) {
      console.log(`\n${baseName}:`);
      files.forEach(file => {
        const filePath = path.join(svgDir, file);
        const stats = fs.statSync(filePath);
        console.log(`  - ${file} (${stats.size} bytes)`);
      });
    }
  });
}

// Exécuter l'analyse
console.log('=== RECHERCHE DES FICHIERS DUPLIQUÉS ===');
const duplicates = findDuplicates('latelierpaon.com');

if (duplicates.length > 0) {
  console.log(`\nTrouvé ${duplicates.length} fichier(s) dupliqué(s):`);
  duplicates.forEach((dup, index) => {
    console.log(`\n${index + 1}. Hash: ${dup.hash}`);
    console.log(`   Original: ${dup.original}`);
    console.log(`   Dupliqué: ${dup.duplicate}`);
  });
} else {
  console.log('\nAucun fichier dupliqué trouvé basé sur le contenu.');
}

analyzeSVGFiles();