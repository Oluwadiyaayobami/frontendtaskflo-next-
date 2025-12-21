"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Shield, Lock, CheckCircle, Zap, ArrowRight, Sparkles, Key, ListTodo } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated background gradient */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-purple-950/20" />
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, rgba(124, 58, 237, 0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 50% 80%, rgba(124, 58, 237, 0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 50%, rgba(124, 58, 237, 0.15) 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="border-b border-border/50 backdrop-blur-lg bg-background/80 sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
              SecureVault
            </span>
          </motion.div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="hover:bg-primary/10">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32 text-center relative">
        <div className="max-w-5xl mx-auto">
          {/* Floating badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Trusted by 10,000+ professionals</span>
          </motion.div>

          {/* Main heading with staggered animation */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-6 text-balance"
          >
            <span className="bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">
              {"Secure Your Digital Life with "}
            </span>
            <span className="bg-gradient-to-r from-primary via-blue-400 to-primary bg-clip-text text-transparent">
              {"Military-Grade Encryption"}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-2xl text-muted-foreground mb-10 text-pretty max-w-3xl mx-auto leading-relaxed"
          >
            {
              "Manage tasks and store passwords in one unified platform. Built for professionals who refuse to compromise on security."
            }
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link href="/register">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="text-lg px-8 h-14 bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 shadow-lg shadow-primary/25"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </Link>
            <Link href="/login">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 h-14 bg-background/50 backdrop-blur border-primary/20 hover:bg-primary/10 hover:border-primary/40"
                >
                  Sign In
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          {/* Animated feature pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-wrap items-center justify-center gap-4 text-sm"
          >
            {["Zero-knowledge encryption", "Cross-platform sync", "Instant access"].map((feature, i) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.8 + i * 0.1 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur border border-border/50"
              >
                <CheckCircle className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">{feature}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Floating elements */}
        <motion.div
          animate={{
            y: [0, -20, 0],
          }}
          transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="absolute top-40 left-10 hidden lg:block"
        >
          <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-blue-500/20 backdrop-blur border border-primary/20">
            <Key className="h-8 w-8 text-primary" />
          </div>
        </motion.div>

        <motion.div
          animate={{
            y: [0, 20, 0],
          }}
          transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1 }}
          className="absolute top-60 right-10 hidden lg:block"
        >
          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-primary/20 backdrop-blur border border-blue-500/20">
            <ListTodo className="h-8 w-8 text-blue-400" />
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
            {"Everything you need. "}
            <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
              {"Nothing you don't."}
            </span>
          </h2>
          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
            {"Enterprise-grade security meets intuitive design for seamless productivity"}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Shield,
              title: "End-to-End Encryption",
              description: "Military-grade AES-256 encryption protects your data. Not even we can access it.",
              color: "from-primary/20 to-purple-500/20",
              iconColor: "text-primary",
              delay: 0,
            },
            {
              icon: Lock,
              title: "Zero-Knowledge Architecture",
              description: "Your master password never leaves your device. Complete privacy guaranteed.",
              color: "from-blue-500/20 to-primary/20",
              iconColor: "text-blue-400",
              delay: 0.1,
            },
            {
              icon: CheckCircle,
              title: "Smart Task Management",
              description: "Organize your work with powerful, secure task management built right in.",
              color: "from-purple-500/20 to-primary/20",
              iconColor: "text-primary",
              delay: 0.2,
            },
            {
              icon: Zap,
              title: "Lightning Fast Access",
              description: "Instant sync across all devices. Your vault is always ready when you are.",
              color: "from-primary/20 to-blue-500/20",
              iconColor: "text-blue-400",
              delay: 0.3,
            },
          ].map((feature) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: feature.delay }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
            >
              <Card
                className={`p-6 border-border/50 bg-gradient-to-br ${feature.color} backdrop-blur h-full group hover:border-primary/50 transition-all duration-300`}
              >
                <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: "spring", stiffness: 400 }}>
                  <feature.icon className={`h-12 w-12 ${feature.iconColor} mb-4`} />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-primary/10 via-background to-blue-500/10 rounded-3xl border border-primary/20 p-12 md:p-16"
        >
          <div className="grid md:grid-cols-3 gap-12 text-center">
            {[
              { value: "10,000+", label: "Active Users" },
              { value: "99.9%", label: "Uptime SLA" },
              { value: "256-bit", label: "AES Encryption" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground text-lg">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-gradient-to-r from-primary via-purple-600 to-blue-500 text-primary-foreground p-12 md:p-16 text-center relative overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                  backgroundSize: "30px 30px",
                }}
              />
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative z-10"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">{"Ready to secure your digital life?"}</h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                {"Join thousands of professionals who trust SecureVault with their most sensitive data."}
              </p>
              <Link href="/register">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="lg"
                    variant="secondary"
                    className="text-lg px-8 h-14 bg-white text-primary hover:bg-white/90 shadow-xl"
                  >
                    Create Your Free Account
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 backdrop-blur">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold text-foreground">SecureVault</span>
            </div>
            <p className="text-muted-foreground text-center">
              © 2025 SecureVault. Built with security and privacy in mind.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="h-4 w-4" />
              <span>256-bit encrypted</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
