import { httpsCallable } from 'firebase/functions'
import { useState } from 'react'

import { functions } from '@app/configs/firebase'

interface GenerateResponseData {
  prompt: string
}

interface GenerateResponseResult {
  text: string
}

const OpenAIDemo = () => {
  const [prompt, setPrompt] = useState<string>('')
  const [result, setResult] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  // Firebase Functions の httpsCallable を使って関数を呼び出す
  const generateResponseCallable = httpsCallable<GenerateResponseData, GenerateResponseResult>(
    functions,
    'generateResponse'
  )

  const handleGenerate = async () => {
    console.log('Generating response for prompt:', prompt)
    if (!prompt) {
      console.warn('Prompt is empty, skipping function call')
      return
    }
    setLoading(true)
    setError(null)
    try {
      // prompt を渡して関数を呼び出し
      const response = await generateResponseCallable({ prompt })
      // 返却された text をステートにセット
      setResult(response.data.text)
    } catch (e: unknown) {
      console.error('Error calling function:', e)
      setError(e instanceof Error ? e.message : 'エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h2>OpenAI API デモ</h2>
      <textarea
        rows={4}
        cols={50}
        placeholder="ここにプロンプトを入力..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <br />
      <button onClick={() => void handleGenerate()} disabled={loading || !prompt}>
        {loading ? '生成中...' : 'テキスト生成'}
      </button>
      {error && <p style={{ color: 'red' }}>エラー: {error}</p>}
      {result && (
        <div style={{ marginTop: '1rem' }}>
          <h3>生成結果：</h3>
          <div
            style={{
              whiteSpace: 'pre-wrap',
              color: '#333',
              backgroundColor: '#f5f5f5',
              padding: '1rem',
              borderRadius: '4px',
            }}
          >
            {result}
          </div>
        </div>
      )}
    </div>
  )
}

export default OpenAIDemo
