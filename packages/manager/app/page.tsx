import {
  AppShell,
  AppShellHeader,
  AppShellMain,
  AppShellNavbar,
  Button,
  Group,
} from '@mantine/core'
import Link from 'next/link'

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

      <AppShellMain>
        <Group>
          <Button component={Link} href="/editor">
            编辑器
          </Button>
        </Group>
      </AppShellMain>
    </AppShell>
  )
}
