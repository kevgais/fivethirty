import { Outlet } from 'react-router-dom'
import { Navigation } from './Navigation'

export function Layout() {
  return (
    <div className="min-h-screen bg-cream flex flex-col md:flex-row">
      {/* Main content area */}
      <main className="flex-1 pb-20 md:pb-0 md:pl-20">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <Outlet />
        </div>
      </main>

      {/* Navigation - bottom on mobile, side on desktop */}
      <Navigation />
    </div>
  )
}
