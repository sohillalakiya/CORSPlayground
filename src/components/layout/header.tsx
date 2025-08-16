'use client'

import { ThemeToggle } from '@/components/theme/theme-toggle'
import { UserMenu } from '@/components/layout/user-menu'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              CORSPlayground
            </h1>
            <span className="text-sm text-muted-foreground hidden sm:inline">
              API Testing Tool
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  )
}