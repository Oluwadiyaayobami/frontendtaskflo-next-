"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function HomePage() {
  const router = useRouter()
  const { token, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && token) {
      router.push("/dashboard")
    }
  }, [token, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-primary">CampusHub</div>
          <div className="flex items-center gap-4">
            <Link href="/agent-login">
              <Button variant="ghost">Agent Login</Button>
            </Link>
            <Link href="/agent-register">
              <Button>Become an Agent</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-balance leading-tight">
              Buy and sell on campus with ease
            </h1>
            <p className="text-lg text-muted-foreground text-balance">
              Connect with fellow students, find great deals, and build your campus community through trusted
              peer-to-peer marketplace.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/marketplace">
                <Button size="lg" className="w-full sm:w-auto">
                  Browse Marketplace
                </Button>
              </Link>
              <Link href="/agent-register">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                  Start Selling
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative h-80 md:h-96 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl border border-primary/10 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <div className="text-6xl mb-4">🏢</div>
              <p className="text-sm font-medium">Campus Marketplace</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white dark:bg-slate-900/50 border-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary mb-2">1000+</p>
              <p className="text-muted-foreground">Active students</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary mb-2">5000+</p>
              <p className="text-muted-foreground">Products listed</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary mb-2">100%</p>
              <p className="text-muted-foreground">Safe transactions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Why choose CampusHub?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Everything you need for a seamless campus marketplace experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 space-y-4">
              <div className="text-4xl">🔍</div>
              <h3 className="text-xl font-semibold">Easy Discovery</h3>
              <p className="text-muted-foreground">
                Browse listings from your campus community with powerful search and filters.
              </p>
            </CardContent>
          </Card>

          {/* Feature 2 */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 space-y-4">
              <div className="text-4xl">🛡️</div>
              <h3 className="text-xl font-semibold">Safe & Secure</h3>
              <p className="text-muted-foreground">
                Verified student profiles and secure transactions for peace of mind.
              </p>
            </CardContent>
          </Card>

          {/* Feature 3 */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 space-y-4">
              <div className="text-4xl">💬</div>
              <h3 className="text-xl font-semibold">Direct Contact</h3>
              <p className="text-muted-foreground">
                Connect directly with sellers and negotiate deals within the campus.
              </p>
            </CardContent>
          </Card>

          {/* Feature 4 */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 space-y-4">
              <div className="text-4xl">📸</div>
              <h3 className="text-xl font-semibold">Rich Listings</h3>
              <p className="text-muted-foreground">
                Upload multiple images and detailed descriptions for your products.
              </p>
            </CardContent>
          </Card>

          {/* Feature 5 */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 space-y-4">
              <div className="text-4xl">⚡</div>
              <h3 className="text-xl font-semibold">Quick Setup</h3>
              <p className="text-muted-foreground">Create your account and start buying or selling in minutes.</p>
            </CardContent>
          </Card>

          {/* Feature 6 */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 space-y-4">
              <div className="text-4xl">👥</div>
              <h3 className="text-xl font-semibold">Community</h3>
              <p className="text-muted-foreground">Join thousands of students building a trusted campus marketplace.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Ready to start trading on campus?</h2>
          <p className="text-lg mb-8 opacity-90 text-balance max-w-2xl mx-auto">
            Join our community of students and discover amazing deals from your peers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/marketplace">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Browse Products
              </Button>
            </Link>
            <Link href="/agent-register">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                Become a Seller
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm">© 2025 CampusHub. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-primary transition-colors">
                Terms
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                Privacy
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
