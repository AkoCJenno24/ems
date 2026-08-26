import { Component, type ErrorInfo, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[Uncaught EMS Application Error]:", error, errorInfo)
  }

  private handleReload = () => {
    window.location.reload()
  }

  private handleGoHome = () => {
    window.location.href = "/"
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-muted/40">
          <Card className="max-w-lg w-full shadow-xl border-destructive/20">
            <CardHeader className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <CardTitle className="text-xl">Something went wrong</CardTitle>
              <CardDescription>
                An unexpected application error occurred. You can attempt to refresh the page or return to the dashboard.
              </CardDescription>
            </CardHeader>
            {this.state.error && (
              <CardContent>
                <div className="p-3 bg-muted rounded-md text-xs font-mono text-muted-foreground overflow-x-auto max-h-32 border">
                  {this.state.error.message}
                </div>
              </CardContent>
            )}
            <CardFooter className="flex flex-col sm:flex-row gap-2 justify-end">
              <Button variant="outline" onClick={this.handleGoHome} className="w-full sm:w-auto">
                <Home className="w-4 h-4 mr-2" />
                Go to Dashboard
              </Button>
              <Button onClick={this.handleReload} className="w-full sm:w-auto">
                <RefreshCw className="w-4 h-4 mr-2" />
                Reload Application
              </Button>
            </CardFooter>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
