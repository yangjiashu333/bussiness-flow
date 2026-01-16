import { useState } from 'react';
import './App.css';

const defaultPayload = JSON.stringify(
  {
    message: 'hello from client',
    userName: 'Alice',
    action: 'test',
  },
  null,
  2,
);

interface ResponseData {
  payload: Record<string, unknown>;
  meta: {
    processed?: boolean;
    requestId?: string;
    explanation?: string;
    explanationModel?: string;
  };
}

const parseJsonInput = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) {
    return { ok: false as const, error: '请输入 JSON 内容' };
  }

  try {
    const parsed = JSON.parse(trimmed) as unknown;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return { ok: false as const, error: 'JSON 必须是对象格式' };
    }
    return { ok: true as const, value: parsed as Record<string, unknown> };
  } catch (error) {
    return { ok: false as const, error: `JSON 格式错误: ${String(error)}` };
  }
};

function App() {
  const [payload, setPayload] = useState(defaultPayload);
  const [responseData, setResponseData] = useState<ResponseData | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async () => {
    setResponseData(null);
    setError('');

    const parsed = parseJsonInput(payload);
    if (!parsed.ok) {
      setError(parsed.error);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/echo', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(parsed.value),
      });

      const text = await response.text();
      if (!response.ok) {
        setError(text);
        return;
      }

      const data = JSON.parse(text) as ResponseData;
      setResponseData(data);
    } catch (error) {
      setError(String(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header>
        <h1>Business Flow Worker</h1>
        <p>发送 JSON 数据，获取处理结果与 AI 解释</p>
      </header>

      <section className="panel">
        <label htmlFor="payload">请求数据 (JSON)</label>
        <textarea
          id="payload"
          value={payload}
          onChange={(event) => setPayload(event.target.value)}
          spellCheck={false}
        />
        <button type="button" onClick={send} disabled={loading}>
          {loading ? '处理中...' : '发送请求'}
        </button>
      </section>

      {error && (
        <section className="panel error-panel">
          <label>错误</label>
          <pre className="error">{error}</pre>
        </section>
      )}

      {responseData && (
        <>
          {responseData.meta.explanation && (
            <section className="panel ai-panel">
              <div className="ai-header">
                <label>AI 解释</label>
                {responseData.meta.explanationModel && (
                  <span className="model-badge">{responseData.meta.explanationModel}</span>
                )}
              </div>
              <div className="ai-explanation">{responseData.meta.explanation}</div>
            </section>
          )}

          <section className="panel">
            <label>原始数据</label>
            <pre className="payload-result">{JSON.stringify(responseData.payload, null, 2)}</pre>
          </section>

          <section className="panel metadata-panel">
            <label>处理信息</label>
            <div className="metadata-grid">
              <div className="metadata-item">
                <span className="metadata-label">状态</span>
                <span className="metadata-value">
                  {responseData.meta.processed ? '已处理' : '未处理'}
                </span>
              </div>
              {responseData.meta.requestId && (
                <div className="metadata-item">
                  <span className="metadata-label">请求 ID</span>
                  <span className="metadata-value mono">{responseData.meta.requestId}</span>
                </div>
              )}
              {!responseData.meta.explanation && (
                <div className="metadata-item info-message">
                  <span>AI 功能未启用或不可用</span>
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {!responseData && !error && !loading && (
        <section className="panel empty-state">
          <div className="empty-content">
            <p>还没有响应数据</p>
            <p className="empty-hint">点击上方按钮发送请求</p>
          </div>
        </section>
      )}
    </div>
  );
}

export default App;
