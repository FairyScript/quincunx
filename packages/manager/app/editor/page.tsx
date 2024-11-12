import {
  AppShell,
  AppShellHeader,
  AppShellMain,
  AppShellNavbar,
} from '@mantine/core'
import FlowEditor from './flow/FlowEditor'

export default function HomePage() {
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
      }}
      padding="md"
    >
      <AppShellHeader>
        <div>Logo</div>
      </AppShellHeader>

      <AppShellNavbar p="md">Navbar</AppShellNavbar>

      <AppShellMain h="100dvh">
        <FlowEditor />
      </AppShellMain>
    </AppShell>
  )
}
