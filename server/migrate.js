const fs = require('fs');
const path = require('path');
const db = require('./db');
const { v4: uuidv4 } = require('uuid');

function importArticlesFromJson(filepath){
  if(!fs.existsSync(filepath)){ console.log('File not found:', filepath); return; }
  const raw = fs.readFileSync(filepath,'utf8');
  const list = JSON.parse(raw);
  const insert = db.prepare('INSERT OR REPLACE INTO articles (id, client, reference, designation, dateEntree, dateSortie, emplacement, quantite, autresInfos) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
  db.transaction(()=>{
    for(const a of list){
      insert.run(a.id || uuidv4(), a.client, a.reference, a.designation, a.dateEntree || '', a.dateSortie || '', a.emplacement || '', a.quantite || 0, a.autresInfos || '');
    }
  })();
  console.log('Import complete. Imported', list.length, 'articles.');
}

const importPath = path.join(__dirname, 'articles_export.json');
if(fs.existsSync(importPath)){
  importArticlesFromJson(importPath);
} else {
  console.log('No articles_export.json found in server/. Nothing to import automatically.');
}
