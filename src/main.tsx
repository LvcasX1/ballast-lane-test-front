import '@ant-design/v5-patch-for-react-19';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { unstableSetRender } from 'antd'
import './index.css'
import Providers from './Providers'

// Configure Ant Design rendering for React 19 compatibility
unstableSetRender((node, container) => {
  (container as any)._reactRoot ||= createRoot(container as HTMLElement)
  const root = (container as any)._reactRoot
  root.render(node)
  return async () => {
    await new Promise((resolve) => setTimeout(resolve, 0))
    root.unmount()
  }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers />
  </StrictMode>,
)
