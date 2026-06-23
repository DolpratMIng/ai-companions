import { CameraView } from '@/components/CameraView'
import { ARScene } from '@/components/ARScene'
import { SpawnPanel } from '@/components/SpawnPanel'
import { ChatInput } from '@/components/ChatInput'

export default function Home() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black">
      <CameraView />
      <ARScene />
      <SpawnPanel />
      <ChatInput />
    </main>
  )
}
