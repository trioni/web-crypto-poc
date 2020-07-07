import React, { FormEvent, useState, useEffect } from 'react';
import './App.css';
import { encryptionService } from './encryptionService';

const PUBLIC_KEY_FILE = 'public.pem';
async function fetchPublicKey() {
  return fetch(`/${PUBLIC_KEY_FILE}`).then(res => res.text());
}

function App() {
  const [encrypted, setEncrypted] = useState<string | undefined>(undefined)
  const [pkey, setPublicKey] = useState<string | undefined>(undefined);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!pkey) {
      return;
    }
    const form = e.target as HTMLFormElement;
    const fd = new FormData(form);
    const msg = fd.get('message') as string;
    const pubKey = await encryptionService.importPublicKey(pkey);
    const arrayBufferData = await encryptionService.encrypt(pubKey, msg);
    const base64EncodedData = encryptionService.prepareForTransport(arrayBufferData);
    setEncrypted(base64EncodedData);
  }
  useEffect(() => {
    const fetchData = async () => {
      const myPublicKey = await fetchPublicKey();
      setPublicKey(myPublicKey);
    }
    fetchData();
  }, []);
  return (
    <div className="App">
      <div>
        <h2>Public key</h2>
        <textarea rows={20} value={pkey} />
      </div>
      <div>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <input name="message" type="text" />
          <button type="submit">Encrypt</button>
        </div>
      </form>
      {encrypted && (
        <div>
          <h2>Encrypted data</h2>
          <textarea rows={20} readOnly value={encrypted}></textarea>
        </div>
      )}
      </div>
    </div>
  );
}

export default App;
