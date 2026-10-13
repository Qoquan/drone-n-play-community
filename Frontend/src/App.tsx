import { ThemeToggle } from './components/ThemeToggle'

export default function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold">
            Drone'n Play
          </h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="app-main">
        <div className="max-w-7xl mx-auto">
          <p>Welcome to Drone'n Play! 🚁</p>
        </div>
      </main>
    </div>
  )
}