/**
 * Lion Track Safari - cPanel Startup File (app.js)
 * Automatically delegates to pre-compiled dist/server.cjs in production
 */
import fs from 'fs';

if (fs.existsSync('./dist/server.cjs')) {
  import('./dist/server.cjs');
} else {
  import('./server.ts');
}
