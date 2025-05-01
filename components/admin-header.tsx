import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Film, LogOut } from "lucide-react"
import { logoutAdmin } from "@/lib/auth"

export default function AdminHeader() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Film className="h-6 w-6" />
          <span className="text-xl font-bold">VideoPortfolio Admin</span>
        </div>

        <nav className="flex items-center gap-6">
          <Link href="/admin" className="text-sm font-medium transition-colors hover:text-primary">
            Dashboard
          </Link>
          <Link href="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            View Site
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <form action={logoutAdmin}>
            <Button variant="outline" size="sm" className="flex gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </form>
        </div>
      </div>
    </header>
  )
}

