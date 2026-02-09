import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App.tsx' // 确保这里有花括号，且对应刚才导出的 export function App
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)