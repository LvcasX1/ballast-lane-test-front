import { useState } from 'react'
import { Button, Card, Typography, Space, Badge, Progress } from 'antd'
import { PlusOutlined, MinusOutlined, ThunderboltFilled } from '@ant-design/icons'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const { Title, Paragraph } = Typography

function App() {
  const [count, setCount] = useState(0)

  return (
    <Card style={{ 
      background: 'linear-gradient(135deg, rgba(137, 180, 250, 0.1), rgba(166, 227, 161, 0.1))',
      border: '1px solid rgba(137, 180, 250, 0.2)'
    }}>
      <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
        <div>
          <a href="https://vite.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        
        <Title level={1} style={{ 
          background: 'linear-gradient(45deg, #89b4fa, #a6e3a1, #fab387)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Vite + React + Catppuccin
        </Title>
        
        <Card 
          title={
            <span style={{ color: '#fab387' }}>
              <ThunderboltFilled style={{ marginRight: '8px' }} />
              Interactive Counter Demo
            </span>
          } 
          size="small" 
          style={{ 
            textAlign: 'center',
            background: 'rgba(49, 50, 68, 0.5)',
            border: '1px solid rgba(250, 179, 135, 0.3)'
          }}
        >
          <Space direction="vertical" size="large">
            <div>
              <Badge 
                count={count} 
                showZero 
                style={{ 
                  backgroundColor: '#cba6f7',
                  boxShadow: '0 0 10px rgba(203, 166, 247, 0.5)'
                }}
              >
                <div style={{ 
                  width: '100px', 
                  height: '100px', 
                  background: 'linear-gradient(45deg, #313244, #45475a)', 
                  borderRadius: '16px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  border: '2px solid #585b70',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                }}>
                  <span style={{ color: '#cdd6f4', fontWeight: 'bold', fontSize: '14px' }}>
                    Count
                  </span>
                </div>
              </Badge>
            </div>
            
            <Progress 
              percent={(count / 20) * 100} 
              strokeColor={{
                '0%': '#cba6f7',
                '50%': '#89b4fa',
                '100%': '#a6e3a1',
              }}
              trailColor="#313244"
              showInfo={false}
              style={{ maxWidth: '200px' }}
            />
            
            <Space size="large">
              <Button 
                type="primary"
                danger
                icon={<MinusOutlined />} 
                onClick={() => setCount((count) => Math.max(0, count - 1))}
                disabled={count <= 0}
                style={{
                  background: count <= 0 ? undefined : 'linear-gradient(45deg, #f38ba8, #eba0ac)',
                  border: 'none',
                  boxShadow: count <= 0 ? undefined : '0 4px 15px rgba(243, 139, 168, 0.4)'
                }}
              >
                Decrease
              </Button>
              <Button 
                type="primary"
                icon={<PlusOutlined />} 
                onClick={() => setCount((count) => count + 1)}
                style={{
                  background: 'linear-gradient(45deg, #a6e3a1, #94e2d5)',
                  border: 'none',
                  boxShadow: '0 4px 15px rgba(166, 227, 161, 0.4)',
                  color: '#1e1e2e'
                }}
              >
                Increase
              </Button>
            </Space>
            
            {count >= 10 && (
              <div style={{ 
                padding: '12px', 
                background: 'rgba(166, 227, 161, 0.1)', 
                borderRadius: '8px',
                border: '1px solid rgba(166, 227, 161, 0.3)'
              }}>
                <Paragraph style={{ margin: 0, color: '#a6e3a1' }}>
                  🎉 Great job! You've reached {count} clicks!
                </Paragraph>
              </div>
            )}
          </Space>
        </Card>
        
        <Space direction="vertical" size="small">
          <Paragraph style={{ color: '#bac2de' }}>
            Edit <code style={{ 
              background: 'rgba(203, 166, 247, 0.2)', 
              padding: '2px 6px', 
              borderRadius: '4px',
              color: '#cba6f7'
            }}>src/App.tsx</code> and save to test HMR
          </Paragraph>
          
          <Paragraph style={{ color: '#a6adc8', fontSize: '14px' }}>
            Click on the Vite and React logos to learn more
          </Paragraph>
        </Space>
      </Space>
    </Card>
  )
}

export default App
