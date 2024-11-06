import { AppShell, Group } from '@mantine/core'
import { ReactFlow } from '@xyflow/react'
import '@xyflow/react/dist/style.css'

const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
]
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }]

const NodeEditor: React.FC = () => {
  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Group align="center" h="100%">
          <div>Logo</div>
        </Group>
      </AppShell.Header>

      <AppShell.Main h="100dvh">
        <ReactFlow nodes={initialNodes} edges={initialEdges} />
      </AppShell.Main>
    </AppShell>
  )
}

export default NodeEditor
