/**
 * Lion Track Safari - Express REST API Entry Point
 */
import fs from 'fs';

if (fs.existsSync('./dist/server.cjs')) {
  import('./dist/server.cjs');
} else {
  import('./server.ts');
}
