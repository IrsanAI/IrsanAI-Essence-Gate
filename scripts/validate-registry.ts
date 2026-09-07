import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { EssenceSchema } from '../packages/schemas/src/essence.schema.js';

const dir = join(process.cwd(), 'registry/essences');
const files = readdirSync(dir).filter(f => f.endsWith('.json'));
let valid = 0;
let invalid = 0;

for (const file of files) {
  const raw = JSON.parse(readFileSync(join(dir, file), 'utf-8'));
  const parsed = EssenceSchema.safeParse(raw);
  if (parsed.success) {
    console.log(`✓ ${file}`);
    valid++;
  } else {
    console.log(`✗ ${file}: ${parsed.error.message}`);
    invalid++;
  }
}

console.log(`\n[EG:validate:registry] ${valid + invalid} files — ${valid} valid, ${invalid} invalid`);
if (invalid === 0) console.log('All valid — Build Gate GRÜN');
