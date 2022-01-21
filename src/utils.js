import { encodeAddress, decodeAddress, blake2AsHex } from '@polkadot/util-crypto';
import { Buffer } from 'buffer';

export function convertH160ToSs58(h160Addr) {
  validateH160(h160Addr);
  const prefix = 42;
  const addressBytes = Buffer.from(h160Addr.slice(2), 'hex');
  const prefixBytes = Buffer.from('evm:');
  const convertBytes = Uint8Array.from(Buffer.concat([ prefixBytes, addressBytes ]));
  const finalAddressHex = blake2AsHex(convertBytes, 256);
  return encodeAddress(finalAddressHex, prefix);
}

export function convertSs58ToH160(ss58Addr) {
  validateSs58(ss58Addr);

  const pubKey = Buffer.from(decodeAddress(ss58Addr)).toString('hex');
  return '0x' + pubKey.slice(0, 40);
}

function validateH160(h160Addr) {
  const re = /0x[0-9A-Fa-f]{40}/g;
  if(!re.test(h160Addr)) {
    throw 'Invalid H160 address';
  } 
}

function validateSs58(ss58Addr) {
  console.log('------------');
  console.log(ss58Addr.length);
  console.log(ss58Addr.at(0));
  if(ss58Addr.length !== 48 || ss58Addr.at(0) !== '5') {
    throw 'Invalid SS58 address';
  }
}