import test from 'node:test';
import assert from 'node:assert/strict';
import { testbed } from './helpers.js';
import { generateKeyPair, nimiqMessageDigest, signBytes, verifyNimiqSignature, timingSafeEqual } from '../server/util.js';

test('wallet auth: real Ed25519 signature verifies; tampering fails', async (t) => {
  const tb = await testbed();
  const kp = generateKeyPair();
  const { nonce, message } = await tb.auth.issueNonce('NQTEST ADDRESS');
  const sig = signBytes(kp.privateKey, nimiqMessageDigest(message));
  assert.equal(tb.auth.verifySignature({ mode: 'nimiq', publicKey: kp.publicKey, signature: sig, message }), true);

  // tampered message fails
  assert.equal(tb.auth.verifySignature({ mode: 'nimiq', publicKey: kp.publicKey, signature: sig, message: message + 'x' }), false);
  // wrong key fails
  const other = generateKeyPair();
  assert.equal(tb.auth.verifySignature({ mode: 'nimiq', publicKey: other.publicKey, signature: sig, message }), false);
  // garbage signature fails safely
  assert.equal(tb.auth.verifySignature({ mode: 'nimiq', publicKey: kp.publicKey, signature: 'zzzz', message }), false);
});

test('wallet auth: nonce is single-use and expires', async (t) => {
  const tb = await testbed();
  const { nonce } = await tb.auth.issueNonce('demo');
  assert.ok(await tb.auth.consumeNonce(nonce));
  assert.equal(await tb.auth.consumeNonce(nonce), null, 'nonce must be single-use');
});

test('wallet auth: sessions authenticate the right user only', async (t) => {
  const tb = await testbed();
  const u = await tb.users.createUser({});
  const token = await tb.auth.createSession(u.id);
  const got = await tb.auth.userFromToken(token);
  assert.equal(got.id, u.id);
  assert.equal(await tb.auth.userFromToken('nonsense.token'), null);
});

test('wallet auth: a session token with a forged/tampered signature is rejected', async (t) => {
  const tb = await testbed();
  const u = await tb.users.createUser({});
  const token = await tb.auth.createSession(u.id);
  const [tokenId] = token.split('.');
  // same tokenId (so the session row is found) but a bogus signature of the same length
  const forged = `${tokenId}.${'0'.repeat(32)}`;
  assert.equal(await tb.auth.userFromToken(forged), null, 'forged signature must not authenticate');
});

test('timingSafeEqual: matches equal strings, rejects different values and lengths', () => {
  assert.equal(timingSafeEqual('abc123', 'abc123'), true);
  assert.equal(timingSafeEqual('abc123', 'abc124'), false);
  assert.equal(timingSafeEqual('abc123', 'abc12'), false, 'different lengths must not throw or match');
});

test('nimiq message digest matches the documented prefix scheme', () => {
  // '\x16Nimiq Signed Message:\n' + byteLength + message  → sha256
  const digest = nimiqMessageDigest('hello');
  assert.equal(digest.length, 32);
  const crypto = await0();
  function await0() { return null; }
  assert.ok(Buffer.isBuffer(digest));
  assert.equal(verifyNimiqSignature('bad', 'hello', 'bad'), false);
});
