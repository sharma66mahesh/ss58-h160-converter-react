import { useState } from 'react';

import {convertH160ToSs58, convertSs58ToH160} from './utils';

import './App.css';

const ADDRESS_FORMAT = {
  ss58: 'SS58',
  h160: 'H160',
};

function App() {

  const [inputAddrFormat, setInputAddrFormat] = useState(ADDRESS_FORMAT.ss58);
  const [inputAddress, setInputAddress] = useState('');
  const [outputAddress, setOutputAddress] = useState('');
  const [error, setError] = useState('');

  function handleFormatChange (e) {
    setInputAddrFormat(e.target.value);
  }

  function handleInputAddrChange (e) {
    setInputAddress(e.target.value);
  }

  function handleSubmit (e) {
    e.preventDefault();
    try {
      let output = '';
      if (inputAddrFormat === ADDRESS_FORMAT.ss58) {
        output = convertSs58ToH160(inputAddress.trim());
      } else {
        output = convertH160ToSs58(inputAddress.trim());
      }
      setOutputAddress(output);
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
          <select value={inputAddrFormat} onChange={handleFormatChange}>
            <option value={ADDRESS_FORMAT.ss58}>SS58 (Substrate)</option>
            <option value={ADDRESS_FORMAT.h160}>H160 (Etheruem)</option>
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
        
        <div className='output-address'>
          {outputAddress}
        </div>
        
        <div className='error'>
          {error}
        </div>

      </form>
    </div>
  );
}

export default App;
