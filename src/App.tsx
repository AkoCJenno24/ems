import { useState } from 'react'
import { LoginPage } from "@/components/login-page"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Sparkles, 
  Layers, 
  Zap, 
  Palette, 
  CheckCircle2, 
  Moon, 
  Sun, 
  Plus, 
  Minus, 
  RotateCcw, 
  Code2,
  LogIn,
  LayoutDashboard
} from "lucide-react"

export default function App() {
  const [view, setView] = useState<'login' | 'dashboard'>('login')
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null)
  const [count, setCount] = useState(0)
  const [isDark, setIsDark] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [items, setItems] = useState<string[]>([
    'Vite 6 + React 19 Scaffolding',
    'Tailwind CSS v4 Integration',
    'shadcn/ui Component Suite',
    'Full TypeScript & Path Aliasing (@/*)',
    'Default Styled Login Component'
  ])

  const toggleTheme = () => {
    const nextDark = !isDark
    setIsDark(nextDark)
    if (nextDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const handleLoginSuccess = (email: string) => {
    setLoggedInUser(email)
    setTimeout(() => {
      setView('dashboard')
    }, 1000)
  }

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return
    setItems((prev) => [...prev, inputValue.trim()])
    setInputValue('')
  }

  if (view === 'login') {
    return (
      <div className="relative">
        <div className="fixed bottom-4 right-4 z-50">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setView('dashboard')}
            className="shadow-lg backdrop-blur-md bg-background/90 gap-1.5"
          >
            <LayoutDashboard className="h-4 w-4" />
            Switch to Dashboard View
          </Button>
        </div>
        <LoginPage onSuccess={handleLoginSuccess} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-300">
      {/* Top Navbar */}
      <header className="border-b sticky top-0 z-50 bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-sm">
              <Zap className="h-5 w-5" />
            </div>
            <span className="font-semibold text-lg tracking-tight">EMS Platform</span>
            <Badge variant="outline" className="ml-2 font-mono text-xs">
              {loggedInUser ? `Logged in: ${loggedInUser}` : 'React + Vite + shadcn'}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setView('login')}
              className="gap-1.5"
            >
              <LogIn className="h-4 w-4" />
              Login View
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              title="Toggle theme"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <a
              href="https://ui.shadcn.com"
              target="_blank"
              rel="noreferrer"
              className={buttonVariants({ variant: "default", size: "sm" })}
            >
              <Sparkles className="h-4 w-4 mr-1.5" />
              shadcn Docs
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl mx-auto px-4 py-12 flex flex-col gap-12 w-full">
        <section className="text-center space-y-4 max-w-3xl mx-auto pt-6">
          <div className="flex justify-center">
            <Badge variant="secondary" className="px-3 py-1 gap-1.5 text-xs rounded-full">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Login Page & Components Ready
            </Badge>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
            EMS Dashboard & Components
          </h1>
          <p className="text-muted-foreground text-lg sm:text-xl leading-relaxed">
            {loggedInUser ? `Welcome back, ${loggedInUser}! Your authentication flow is working smoothly.` : 'Explore the newly created Login Page component and default shadcn/ui design system.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button size="lg" className="gap-2 shadow-lg" onClick={() => setView('login')}>
              <LogIn className="h-4 w-4" /> View Login Page
            </Button>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              <Code2 className="h-4 w-4 mr-1.5" /> Source Code
            </a>
          </div>
        </section>

        {/* Feature Cards Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-2">
                <LogIn className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl">Login Component</CardTitle>
              <CardDescription>
                Clean card layout with form validation & social options.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Located at <code className="bg-muted px-1.5 py-0.5 rounded text-xs">src/components/login-page.tsx</code> with password toggling and remember-me checkbox.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-2">
                <Palette className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl">Default Styling</CardTitle>
              <CardDescription>
                Zero-runtime Tailwind CSS with shadcn theme tokens.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Standard neutral palette with smooth dark and light mode switching.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-2">
                <Layers className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl">Extensible UI</CardTitle>
              <CardDescription>
                Add more components with the shadcn CLI anytime.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Built on accessible primitives. Run <code className="bg-muted px-1.5 py-0.5 rounded text-xs">npx shadcn add &lt;component&gt;</code> to expand.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Interactive Showcase Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Interactive Counter Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Interactive State Demo</CardTitle>
              <CardDescription>Test React state and shadcn button variants</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center p-8 bg-muted/40 rounded-xl border">
                <span className="text-5xl font-mono font-bold tracking-tight">{count}</span>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                <Button variant="outline" size="icon" onClick={() => setCount(c => c - 1)}>
                  <Minus className="h-4 w-4" />
                </Button>
                <Button variant="default" onClick={() => setCount(c => c + 1)} className="gap-1.5">
                  <Plus className="h-4 w-4" /> Increment
                </Button>
                <Button variant="secondary" size="icon" onClick={() => setCount(0)}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground justify-center">
              State updates reactively with instant UI synchronization.
            </CardFooter>
          </Card>

          {/* Checklist / Input Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Installed Stack Features</CardTitle>
              <CardDescription>Interactive list powered by shadcn Input & Button</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleAddItem} className="flex gap-2">
                <Input
                  placeholder="Add a custom feature..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <Button type="submit" size="sm">
                  Add
                </Button>
              </form>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2.5 p-2 rounded-lg bg-muted/30 border text-sm"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span className="flex-1">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground justify-between">
              <span>{items.length} items configured</span>
              <span className="font-mono text-[11px]">@/components/ui/*</span>
            </CardFooter>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} EMS Platform • React + Vite + Tailwind + shadcn/ui</p>
          <div className="flex items-center gap-4 text-xs">
            <span>TypeScript Ready</span>
            <span>•</span>
            <span>Tailwind CSS</span>
            <span>•</span>
            <span>shadcn/ui</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
