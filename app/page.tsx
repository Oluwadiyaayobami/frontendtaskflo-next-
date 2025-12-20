"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Shield, Lock, CheckCircle, Zap } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">SecureVault</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
            {"Secure Task Management & Password Vault"}
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-pretty">
            {
              "Manage your tasks and passwords in one secure, encrypted platform. Built for professionals who value security and productivity."
            }
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 border-border bg-card hover:shadow-lg transition-shadow">
            <Shield className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-card-foreground">End-to-End Encryption</h3>
            <p className="text-muted-foreground">
              {"Your passwords are encrypted with industry-standard algorithms. We never see your data."}
            </p>
          </Card>

          <Card className="p-6 border-border bg-card hover:shadow-lg transition-shadow">
            <Lock className="h-12 w-12 text-accent mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-card-foreground">Zero-Knowledge Architecture</h3>
            <p className="text-muted-foreground">
              {"Only you have access to your vault. Not even our servers can decrypt your passwords."}
            </p>
          </Card>

          <Card className="p-6 border-border bg-card hover:shadow-lg transition-shadow">
            <CheckCircle className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-card-foreground">Task Management</h3>
            <p className="text-muted-foreground">
              {"Organize your work with powerful task management features integrated seamlessly."}
            </p>
          </Card>

          <Card className="p-6 border-border bg-card hover:shadow-lg transition-shadow">
            <Zap className="h-12 w-12 text-accent mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-card-foreground">Lightning Fast</h3>
            <p className="text-muted-foreground">
              {"Built with modern technologies for instant access to your secure vault anywhere."}
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-primary text-primary-foreground p-12 text-center">
          <h2 className="text-4xl font-bold mb-4">{"Ready to secure your digital life?"}</h2>
          <p className="text-xl mb-8 opacity-90">
            {"Join thousands of professionals who trust SecureVault with their sensitive data."}
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Create Your Free Account
            </Button>
          </Link>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 SecureVault. Built with security and privacy in mind.</p>
        </div>
      </footer>
    </div>
  )
}
