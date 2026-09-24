/**
 * Encrypts the CV so that only ciphertext is ever published.
 *
 *   node tools/encrypt-resume.mjs private/Pawel_Godkowicz_CV.pdf
 *
 * The password is read from stdin, never from a flag — arguments end up in
 * your shell history. The output file is written to assets/docs/resume.enc
 * and is the only version that belongs in the repository.
 *
 * Container layout (all binary, no encoding):
 *
 *   offset  size  field
 *   0       8     magic "PGRESUME"
 *   8       16    PBKDF2 salt
 *   24      12    AES-GCM initialisation vector
 *   36      4     PBKDF2 iteration count, big-endian uint32
 *   40      ..    AES-256-GCM ciphertext followed by its 16-byte tag
 *
 * The iteration count travels with the file so the page can never fall out of
 * step with whatever this script used.
 */

import { createCipheriv, pbkdf2Sync, randomBytes } from 'node:crypto';
import { createInterface } from 'node:readline/promises';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const MAGIC = Buffer.from('PGRESUME', 'ascii');
const SALT_BYTES = 16;
const IV_BYTES = 12;
const KEY_BYTES = 32;
const ITERATIONS = 310_000; // OWASP guidance for PBKDF2-HMAC-SHA256.
const OUTPUT = 'assets/docs/resume.enc';

const source = process.argv[2];
if (!source) {
  console.error('Usage: node tools/encrypt-resume.mjs <path-to-pdf>');
  process.exit(1);
}

const plaintext = readFileSync(source);
if (plaintext.subarray(0, 4).toString('ascii') !== '%PDF') {
  console.error(`Refusing to encrypt ${source}: it does not look like a PDF.`);
  process.exit(1);
}

const rl = createInterface({ input: process.stdin, output: process.stderr });
const password = (await rl.question('Password: ')).trim();
rl.close();

if (password.length < 8) {
  console.error('Refusing to encrypt: use a password of at least 8 characters.');
  process.exit(1);
}

const salt = randomBytes(SALT_BYTES);
const iv = randomBytes(IV_BYTES);
const key = pbkdf2Sync(password, salt, ITERATIONS, KEY_BYTES, 'sha256');

const cipher = createCipheriv('aes-256-gcm', key, iv);
const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);

const iterationField = Buffer.alloc(4);
iterationField.writeUInt32BE(ITERATIONS);

const container = Buffer.concat([
  MAGIC,
  salt,
  iv,
  iterationField,
  ciphertext,
  cipher.getAuthTag(),
]);

mkdirSync(dirname(OUTPUT), { recursive: true });
writeFileSync(OUTPUT, container);

console.error(
  `Wrote ${OUTPUT} — ${(container.length / 1024).toFixed(1)} KB ` +
    `from ${(plaintext.length / 1024).toFixed(1)} KB of PDF.`,
);
console.error('Publish this file. Keep the source PDF out of the repository.');
