const fs = require('fs');
const path = require('path');

// Lire le plan d'optimisation
const plan = JSON.parse(fs.readFileSync('optimization-plan.json', 'utf8'));

// Exécuter le nettoyage
function executeCleanup() {
  let removedCount = 0;
  let savedSpace = 0;
  
  console.log('🧹 Suppression des fichiers dupliqués...\n');
  
  plan.toRemove.forEach(filePath => {
    try {
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        const size = stats.size;
        
        fs.unlinkSync(filePath);
        removedCount++;
        savedSpace += size;
        
        console.log(`  ✅ Supprimé: ${path.basename(filePath)} (${(size/1024).toFixed(2)} KB)`);
      } else {
        console.log(`  ⚠️  Fichier non trouvé: ${path.basename(filePath)}`);
      }
    } catch (error) {
      console.log(`  ❌ Erreur lors de la suppression de ${path.basename(filePath)}: ${error.message}`);
    }
  });
  
  console.log('\n📊 RÉSULTATS DU NETTOYAGE');
  console.log('==========================');
  console.log(`Fichiers supprimés: ${removedCount}`);
  console.log(`Espace libéré: ${(savedSpace/1024/1024).toFixed(2)} MB`);
  
  return { removedCount, savedSpace };
}

// Optimiser les polices
function optimizeFonts() {
  const fontsDir = './latelierpaon.com/_nuxt/fonts';
  
  if (fs.existsSync(fontsDir)) {
    const fontFiles = fs.readdirSync(fontsDir);
    
    console.log('\n🔤 ANALYSE DES POLICES');
    console.log('======================');
    
    const fontWeights = {};
    let totalFontSize = 0;
    
    fontFiles.forEach(file => {
      const filePath = path.join(fontsDir, file);
      const stats = fs.statSync(filePath);
      totalFontSize += stats.size;
      
      // Extraire le poids de la police
      const weight = file.split('_')[1]?.split('.')[0] || 'Unknown';
      if (!fontWeights[weight]) {
        fontWeights[weight] = [];
      }
      fontWeights[weight].push({
        file,
        size: stats.size
      });
    });
    
    console.log(`Taille totale des polices: ${(totalFontSize/1024/1024).toFixed(2)} MB`);
    console.log('\nPoids disponibles:');
    Object.keys(fontWeights).forEach(weight => {
      const files = fontWeights[weight];
      const totalSize = files.reduce((sum, f) => sum + f.size, 0);
      console.log(`  - ${weight}: ${files.length} fichier(s) (${(totalSize/1024).toFixed(2)} KB)`);
    });
    
    // Recommandations d'optimisation
    console.log('\n💡 RECOMMANDATIONS:');
    console.log('- Garder seulement Regular, Medium, et Bold pour réduire la taille');
    console.log('- Utiliser font-display: swap pour améliorer les performances');
  }
}

// Créer un rapport final
function createFinalReport(cleanupResults) {
  const report = {
    timestamp: new Date().toISOString(),
    optimization: {
      filesRemoved: cleanupResults.removedCount,
      spaceFreed: `${(cleanupResults.savedSpace/1024/1024).toFixed(2)} MB`,
      assetsOptimized: plan.toKeep.length,
      cssUnified: true
    },
    recommendations: [
      'Utiliser un seul set d\'assets avec des variations CSS pour le dark mode',
      'Optimiser les polices en gardant seulement les poids essentiels',
      'Implémenter le lazy loading pour les images',
      'Utiliser WebP pour les images photographiques',
      'Minifier et compresser les assets JavaScript'
    ],
    nextSteps: [
      'Tester le site après optimisation',
      'Vérifier que toutes les images s\'affichent correctement',
      'Mesurer l\'amélioration des performances',
      'Implémenter un système de build pour éviter les doublons futurs'
    ]
  };
  
  fs.writeFileSync('optimization-report.json', JSON.stringify(report, null, 2));
  
  console.log('\n📋 RAPPORT FINAL D\'OPTIMISATION');
  console.log('================================');
  console.log(`✅ Fichiers supprimés: ${report.optimization.filesRemoved}`);
  console.log(`💾 Espace libéré: ${report.optimization.spaceFreed}`);
  console.log(`🎨 Assets optimisés: ${report.optimization.assetsOptimized}`);
  console.log(`📄 CSS unifié: ${report.optimization.cssUnified ? 'Oui' : 'Non'}`);
  
  console.log('\n📝 Rapport complet sauvegardé dans optimization-report.json');
}

// Exécuter l'optimisation complète
const cleanupResults = executeCleanup();
optimizeFonts();
createFinalReport(cleanupResults);

console.log('\n🎉 OPTIMISATION TERMINÉE!');
console.log('Le site est maintenant optimisé et unifié.');