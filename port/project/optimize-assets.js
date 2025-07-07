const fs = require('fs');
const path = require('path');

// Lire le rapport d'analyse
const report = JSON.parse(fs.readFileSync('duplicates-report.json', 'utf8'));

// Plan d'optimisation des assets
function createOptimizationPlan() {
  const plan = {
    toKeep: [],
    toRemove: [],
    toRename: [],
    cssUpdates: [],
    jsUpdates: []
  };
  
  // Optimiser les montagnes (garder les versions les plus récentes)
  const mountainFiles = report.categories.mountains;
  if (mountainFiles.length > 0) {
    // Garder les versions avec les noms les plus courts (versions principales)
    const mountainsToKeep = mountainFiles.filter(file => 
      !file.includes('.df731db') && !file.includes('.9af468f') && !file.includes('.752e830')
    );
    const mountainsToRemove = mountainFiles.filter(file => 
      file.includes('.df731db') || file.includes('.9af468f') || file.includes('.752e830')
    );
    
    plan.toKeep.push(...mountainsToKeep);
    plan.toRemove.push(...mountainsToRemove);
  }
  
  // Optimiser les sols
  const floorFiles = report.categories.floor;
  if (floorFiles.length > 0) {
    const floorsToKeep = floorFiles.filter(file => !file.includes('.58cc03e'));
    const floorsToRemove = floorFiles.filter(file => file.includes('.58cc03e'));
    
    plan.toKeep.push(...floorsToKeep);
    plan.toRemove.push(...floorsToRemove);
  }
  
  // Optimiser les logos (garder les versions principales)
  const logoFiles = report.categories.logos;
  if (logoFiles.length > 0) {
    // Garder logo principal, logo long, et versions blanches
    const logosToKeep = logoFiles.filter(file => 
      file.includes('logo.febfd59') || 
      file.includes('logo_long.33c8981') || 
      file.includes('logo_white.7b164f1') ||
      file.includes('logo_long_white.e8a3851')
    );
    const logosToRemove = logoFiles.filter(file => !logosToKeep.includes(file));
    
    plan.toKeep.push(...logosToKeep);
    plan.toRemove.push(...logosToRemove);
  }
  
  return plan;
}

// Créer le plan d'optimisation
const optimizationPlan = createOptimizationPlan();

console.log('📋 PLAN D\'OPTIMISATION');
console.log('======================');

console.log(`\n✅ Fichiers à conserver (${optimizationPlan.toKeep.length}):`);
optimizationPlan.toKeep.forEach(file => {
  console.log(`  - ${path.basename(file)}`);
});

console.log(`\n🗑️  Fichiers à supprimer (${optimizationPlan.toRemove.length}):`);
optimizationPlan.toRemove.forEach(file => {
  console.log(`  - ${path.basename(file)}`);
});

// Sauvegarder le plan
fs.writeFileSync('optimization-plan.json', JSON.stringify(optimizationPlan, null, 2));

console.log('\n✅ Plan d\'optimisation sauvegardé dans optimization-plan.json');