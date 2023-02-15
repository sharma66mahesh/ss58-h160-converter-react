import { useState } from 'react';

import {convertH160ToSs58, convertSs58ToH160, 
  ADDRESS_FORMAT, encodePubKey, CHAIN_PREFIX, encodePolkadotAddress, validateSs58, getPubKey} from './utils';

import './App.css';



function App() {

  const [inputAddrFormat, setInputAddrFormat] = useState(ADDRESS_FORMAT.snow);
  const [inputAddress, setInputAddress] = useState('');
  const [outputAddress, setOutputAddress] = useState('');
  const [error, setError] = useState('');

  function handleInputFormatChange (e) {
    setInputAddrFormat(e.target.value);
  }

  function handleInputAddrChange (e) {
    setInputAddress(e.target.value);
  }

  function getAllAddresses(ss58Address, defaultH160) {
    const res = {};
    res[ADDRESS_FORMAT.snow] = encodePolkadotAddress(ss58Address, CHAIN_PREFIX.snow);
    res[ADDRESS_FORMAT.arctic] = encodePolkadotAddress(ss58Address, CHAIN_PREFIX.arctic);
    res[ADDRESS_FORMAT.h160] = defaultH160 ? defaultH160 : convertSs58ToH160(ss58Address);
    res[ADDRESS_FORMAT.ss58] = ss58Address;
    res[ADDRESS_FORMAT.pubKey] = getPubKey(ss58Address);

    return res;
  }

  function formatAddresses(addressObj) {
    const outputArray = [];
    Object.entries(addressObj).forEach((entry) => {
      outputArray.push(`<b>${entry[0]}</b>: \t${entry[1]}<br/><br/>`);
    })

    return outputArray.join('\n');
  }

  function handleSubmit (e) {
    e.preventDefault();
    try {
      const inputAddressTrimmed = inputAddress.trim();
      let eqvSs58Addr = inputAddressTrimmed;
      let defaultH160;

      if (inputAddrFormat === ADDRESS_FORMAT.h160) {
        // convert h160 to ss58
        defaultH160 = inputAddressTrimmed; // limitation of bidirectional H160 mapping
        eqvSs58Addr = convertH160ToSs58(inputAddressTrimmed);

      } else if (inputAddrFormat === ADDRESS_FORMAT.pubKey) {
        // convert pubkey to ss58
        eqvSs58Addr = encodePubKey(inputAddressTrimmed, CHAIN_PREFIX.ss58);

      } else if(inputAddrFormat === ADDRESS_FORMAT.snow) {
        // convert SNOW to ss58
        eqvSs58Addr = encodePolkadotAddress(inputAddressTrimmed, CHAIN_PREFIX.ss58);
      } else if(inputAddrFormat === ADDRESS_FORMAT.arctic) {
        // convert arctic to ss58
        eqvSs58Addr = encodePolkadotAddress(inputAddressTrimmed, CHAIN_PREFIX.ss58);
      }

      validateSs58(eqvSs58Addr);

      setOutputAddress(formatAddresses(getAllAddresses(eqvSs58Addr, defaultH160)));
      setError('');

    } catch (e) {
      console.error(e);
      if (typeof e === 'string') {
        setError(e);
      } else {
        setError(`Invalid ${inputAddrFormat} address provided`);
      }
      setOutputAddress('');
    }
  }

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className='form-label'>Input address format: </label>
          <select value={inputAddrFormat} onChange={handleInputFormatChange}>
            <option value={ADDRESS_FORMAT.snow}>SNOW Mainnet</option>
            <option value={ADDRESS_FORMAT.snow}>Arctic Testnet</option>
            <option value={ADDRESS_FORMAT.ss58}>SS58 (Substrate)</option>
            <option value={ADDRESS_FORMAT.h160}>H160 (Etheruem)</option>
            <option value={ADDRESS_FORMAT.pubKey}>Public Key (Global)</option>
          </select>
        </div>

        <div className="form-group">
          <label className='form-label'>Address: </label>
          <input 
            type='text'
            value={inputAddress}
            onChange={handleInputAddrChange}
          />
        </div>

        <div className="form-group">
          <button type='submit'>Go!</button>
        </div>
        
        <div className='error'>
          {error}
        </div>

      </form>
      <div className='output-address' dangerouslySetInnerHTML={{__html: outputAddress}} />

    </div>
  );
}

export default App;
