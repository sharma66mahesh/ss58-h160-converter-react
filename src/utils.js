import { encodeAddress, decodeAddress, blake2AsHex } from '@polkadot/util-crypto';
import { Buffer } from 'buffer';

export const ADDRESS_FORMAT = {
  ss58: 'SS58',
  h160: 'H160',
  snow: 'SNOW',
  pubKey: 'Public Key',
};

export const CHAIN_PREFIX = {
  snow: 2207,
  ss58: 42,
};

export function convertH160ToSs58(h160Addr) {
  validateH160(h160Addr);
  const addressBytes = Buffer.from(h160Addr.slice(2), 'hex');
  const prefixBytes = Buffer.from('evm:');
  const convertBytes = Uint8Array.from(Buffer.concat([ prefixBytes, addressBytes ]));
  const finalAddressHex = blake2AsHex(convertBytes, 256);
  return encodeAddress(finalAddressHex, CHAIN_PREFIX.ss58);
}

export function convertSs58ToH160(ss58Addr) {
  validateSs58(ss58Addr);

  const pubKey = getPubKey(ss58Addr);
  return pubKey.slice(0, 40);
}

export function getPubKey(ss58addr) {
  return '0x' + Buffer.from(decodeAddress(ss58addr)).toString('hex');
}

export function encodePubKey(pubKey, prefix) {
  validatePubKey(pubKey);
  return encodeAddress(pubKey, prefix);
}

export function encodePolkadotAddress(addr, prefix) {
  try {
    return encodeAddress(addr, prefix);
  } catch(e) {
    throw 'Invalid Address provided!';
  }
}

function validateH160(h160Addr) {
  const re = /0x[0-9A-Fa-f]{40}/g;
  if(!re.test(h160Addr)) {
    throw 'Invalid H160 address provided!';
  } 
}

export function validateSs58(ss58Addr) {
  if(ss58Addr.length !== 48 || ss58Addr.at(0) !== '5') {
    throw 'Invalid SS58 address provided!';
  }
}

export function validatePubKey(pubkey) {
  const re = /0x[0-9a-fA-F]{64}/;
  if(!re.test(pubkey)) {
    throw 'Invalid Public Key provided!';
  }
}