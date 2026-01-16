import { useState } from 'react';
import './App.css';

const defaultPayload = JSON.stringify(
  {
    message: 'hello from client',
  },
  null,
  2,
);

function App() {
  const [payload, setPayload] = useState(defaultPayload);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async () => {
    setLoading(true);
    setResult('');

    try {
      const response = await fetch('/api/echo', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          // Warning: hard-coded API keys in the client are visible to attackers.
          'x-api-key': 'change-me',
        },
        body: payload,
      });

      const text = await response.text();
      if (!response.ok) {
        setResult(text);
        return;
      }

      setResult(JSON.stringify(JSON.parse(text), null, 2));
    } catch (error) {
      setResult(String(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header>
        <h1>Worker Echo Demo</h1>
        <p>Send JSON to the Worker, get it back with processed: true.</p>
      </header>
      <section className="panel">
        <label htmlFor="payload">Request JSON</label>
        <textarea
          id="payload"
          value={payload}
          onChange={(event) => setPayload(event.target.value)}
          spellCheck={false}
        />
        <button type="button" onClick={send} disabled={loading}>
          {loading ? 'Sending...' : 'Send to Worker'}
        </button>
      </section>
      <section className="panel">
        <label htmlFor="result">Response</label>
        <pre id="result">{result || 'No response yet.'}</pre>
      </section>
    </div>
  );
}

export default App;
