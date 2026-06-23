import { CameraView } from '@/components/CameraView'
import { ARScene } from '@/components/ARScene'
import { SpawnPanel } from '@/components/SpawnPanel'

export default function Home() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black">
      <CameraView />
      <ARScene />
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-24">
        <p className="text-white/70 text-sm mb-4 bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm">
          Tap a character below to spawn them into your space
        </p>
      </div>
      <SpawnPanel />
    </main>
  )
}
