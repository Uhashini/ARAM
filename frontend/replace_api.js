const fs = require('fs');
const path = require('path');

const API_URL = 'https://aram-ira2.onrender.com';

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;
      if (content.includes('http://localhost:5001')) {
        content = content.split('http://localhost:5001').join(API_URL);
        modified = true;
      }
      if (content.includes('http://127.0.0.1:5001')) {
        content = content.split('http://127.0.0.1:5001').join(API_URL);
        modified = true;
      }
      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Modified', fullPath);
      }
    }
  }
}

replaceInDir('e:/6th sem/full stack/Project/ARAM/frontend/src');
