import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { programSchema } from '../src/data/confidence-program.schema';

const root = join(__dirname, '..');
const jsonPath = join(root, 'src', 'data', 'confidence-program.json');

const raw = readFileSync(jsonPath, 'utf8');
const data: unknown = JSON.parse(raw);
programSchema.parse(data);
console.log('confidence-program.json: schema OK');
