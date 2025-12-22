"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Shield, Lock, CheckCircle, Zap, ArrowRight, Sparkles, Key, ListTodo, 
  Globe, Users, Cloud, Smartphone, Clock, TrendingUp, Fingerprint, Database,
  Award, ShieldCheck, Bell, BarChart, CreditCard, HelpCircle
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [stars, setStars] = useState<Array<{ x: number; y: number; size: number; speed: number }>>([])

  useEffect(() => {
    // Mouse tracking for parallax effects
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ 
        x: (e.clientX - window.innerWidth / 2) * 0.01, 
        y: (e.clientY - window.innerHeight / 2) * 0.01 
      })
    }
    
    // Create floating stars
    const newStars = Array.from({ length: 50 }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      speed: Math.random() * 0.5 + 0.2
    }))
    setStars(newStars)
    
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Main gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-gray-950 to-purple-950/40" />
        
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-primary/10 to-purple-600/10 blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-blue-600/10 to-primary/10 blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 5 }}
        />
        
        {/* Floating stars */}
        {stars.map((star, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10"
            style={{
              left: `${star.x}vw`,
              top: `${star.y}vh`,
              width: star.size,
              height: star.size,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + star.speed * 2,
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Enhanced Navigation with Glass Morphism */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="border-b border-border/30 backdrop-blur-xl bg-background/60 sticky top-0 z-50 supports-[backdrop-filter]:bg-background/40"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-500 blur-lg opacity-70" />
                <Shield className="relative h-8 w-8 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-primary via-white to-blue-400 bg-clip-text text-transparent leading-none">
                  SecureVault
                </span>
                <span className="text-xs text-muted-foreground">Enterprise Security</span>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {["Features", "Security", "Pricing", "Resources"].map((item, i) => (
                <motion.a
                  key={item}
                  href="#"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 + 0.5 }}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group"
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-blue-500 group-hover:w-full transition-all duration-300" />
                </motion.a>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative overflow-hidden rounded-lg"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary via-blue-500 to-purple-600 opacity-90" />
                  <Button size="sm" className="relative">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section - Enhanced */}
      <section className="container mx-auto px-4 py-20 md:py-40 text-center relative">
        {/* Floating Elements */}
        <motion.div
          animate={{
            y: [0, -30, 0],
            rotate: [0, 5, 0],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-40 left-10 hidden lg:block"
        >
          <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-blue-500/20 backdrop-blur-lg border border-primary/30 shadow-xl">
            <ShieldCheck className="h-10 w-10 text-primary" />
          </div>
        </motion.div>

        <motion.div
          animate={{
            y: [0, 30, 0],
            rotate: [0, -5, 0],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-40 right-10 hidden lg:block"
        >
          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 backdrop-blur-lg border border-blue-500/30 shadow-xl">
            <Fingerprint className="h-10 w-10 text-blue-400" />
          </div>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 to-blue-500/10 border border-primary/20 mb-12 backdrop-blur"
          >
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-blue-500 border-2 border-background" />
                ))}
              </div>
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-medium text-primary">
              Trusted by 10,000+ security professionals worldwide
            </span>
          </motion.div>

          {/* Main Heading with Typing Effect */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 text-balance leading-tight"
          >
            <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Secure Your{" "}
            </span>
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-primary via-blue-400 to-purple-500 bg-clip-text text-transparent">
                Digital Life
              </span>
              <motion.div
                className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-primary to-blue-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 1, duration: 1 }}
              />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground mb-12 text-pretty max-w-3xl mx-auto leading-relaxed"
          >
            Enterprise-grade password management and task organization with 
            <span className="text-primary font-semibold"> military-grade encryption</span>. 
            Built for professionals who value security and productivity.
          </motion.p>

          {/* CTA Buttons with Enhanced Design */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20"
          >
            <Link href="/register" className="w-full sm:w-auto">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative group"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-primary via-blue-500 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300" />
                <Button
                  size="lg"
                  className="relative text-lg px-10 h-14 bg-background text-foreground hover:bg-background/90 w-full"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Start Free Trial - 14 Days
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </Link>
            
            <Link href="/demo" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-10 h-14 bg-background/30 backdrop-blur border-primary/20 hover:bg-primary/10 hover:border-primary/40 w-full"
              >
                <Smartphone className="mr-2 h-5 w-5" />
                Live Demo
              </Button>
            </Link>
          </motion.div>

          {/* Feature Highlights */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
          >
            {[
              { icon: ShieldCheck, text: "SOC 2 Certified" },
              { icon: Database, text: "Zero-Knowledge" },
              { icon: Globe, text: "99.9% Uptime" },
              { icon: Users, text: "Team Ready" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-card/30 backdrop-blur border border-border/50 hover:border-primary/50 transition-colors"
              >
                <item.icon className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-16 bg-gradient-to-b from-transparent to-background/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-muted-foreground mb-8">Trusted by innovative teams at</p>
            <div className="flex flex-wrap items-center justify-center gap-12 opacity-60">
              {["Microsoft", "Google", "Spotify", "Slack", "Notion", "Figma"].map((company, i) => (
                <motion.div
                  key={company}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-2xl font-bold text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                >
                  {company}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid - Enhanced */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
            <Zap className="mr-2 h-3 w-3" />
            Features
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Built for{" "}
            <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
              maximum security
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to secure your digital life, all in one place
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: Shield,
              title: "Military-Grade Encryption",
              description: "AES-256 encryption that meets military standards. Your data is encrypted before it leaves your device.",
              color: "from-primary/20 to-purple-600/20",
              features: ["End-to-end encryption", "Zero-knowledge architecture", "Local encryption"]
            },
            {
              icon: Fingerprint,
              title: "Biometric Authentication",
              description: "Secure access with Face ID, Touch ID, or Windows Hello. No passwords to remember.",
              color: "from-blue-500/20 to-cyan-500/20",
              features: ["Face ID/Touch ID", "Windows Hello", "Hardware keys"]
            },
            {
              icon: Cloud,
              title: "Secure Cloud Sync",
              description: "Sync across all devices with end-to-end encryption. Your data is always available, always secure.",
              color: "from-purple-600/20 to-pink-500/20",
              features: ["Real-time sync", "Offline access", "Conflict resolution"]
            },
            {
              icon: ListTodo,
              title: "Smart Task Management",
              description: "Secure task management with encryption. Organize your work without compromising security.",
              color: "from-green-500/20 to-emerald-600/20",
              features: ["Encrypted tasks", "Team collaboration", "Due dates & reminders"]
            },
            {
              icon: BarChart,
              title: "Security Dashboard",
              description: "Monitor your security health with detailed analytics and breach monitoring.",
              color: "from-orange-500/20 to-red-500/20",
              features: ["Password health", "Breach monitoring", "Security score"]
            },
            {
              icon: Users,
              title: "Team Management",
              description: "Secure team password sharing and permission management for organizations.",
              color: "from-indigo-500/20 to-blue-600/20",
              features: ["Role-based access", "Audit logs", "Team sharing"]
            },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
            >
              <Card className="p-8 border-border/30 bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-lg h-full group hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500">
                <div className="relative">
                  <div className={`absolute -top-4 -left-4 w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} blur-xl opacity-50`} />
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="relative mb-6 inline-flex p-3 rounded-xl bg-gradient-to-br from-background to-background/50 border border-border/30"
                  >
                    <feature.icon className="h-8 w-8 text-primary" />
                  </motion.div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {feature.description}
                </p>
                <ul className="space-y-2">
                  {feature.features.map((item, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section with Animation */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-primary/10 via-transparent to-blue-500/10 rounded-3xl border border-primary/20 p-12 md:p-20 relative overflow-hidden"
          >
            {/* Animated background elements */}
            <div className="absolute inset-0 opacity-5">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-primary"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    width: Math.random() * 100 + 50,
                    height: Math.random() * 100 + 50,
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.2, 0.1],
                  }}
                  transition={{
                    duration: Math.random() * 10 + 10,
                    repeat: Infinity,
                    delay: Math.random() * 5,
                  }}
                />
              ))}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
              {[
                { value: "10K+", label: "Active Users", icon: Users },
                { value: "99.9%", label: "Uptime SLA", icon: Clock },
                { value: "256-bit", label: "Encryption", icon: Lock },
                { value: "24/7", label: "Support", icon: Bell },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-blue-500/20 mb-6">
                    <stat.icon className="h-10 w-10 text-primary" />
                  </div>
                  <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-lg text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border-blue-500/20">
              <CreditCard className="mr-2 h-3 w-3" />
              Pricing
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Simple, transparent{" "}
              <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                pricing
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that fits your needs. No hidden fees, no surprises.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Free",
                price: "$0",
                description: "For individuals getting started",
                features: ["Up to 50 passwords", "1 device", "Basic encryption", "Community support"],
                cta: "Get Started",
                popular: false,
              },
              {
                name: "Professional",
                price: "$8",
                period: "/month",
                description: "For security-conscious professionals",
                features: ["Unlimited passwords", "5 devices", "Advanced encryption", "Priority support", "Task management"],
                cta: "Start Free Trial",
                popular: true,
              },
              {
                name: "Enterprise",
                price: "$20",
                period: "/user/month",
                description: "For teams and organizations",
                features: ["Everything in Pro", "Unlimited devices", "Team management", "SAML SSO", "Custom security policies", "24/7 phone support"],
                cta: "Contact Sales",
                popular: false,
              },
            ].map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                whileHover={{ y: -10 }}
              >
                <Card className={`p-8 h-full border-2 ${plan.popular ? 'border-primary shadow-2xl shadow-primary/20' : 'border-border/30'}`}>
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary to-blue-500">
                      Most Popular
                    </Badge>
                  )}
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-5xl font-bold">{plan.price}</span>
                    {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                  </div>
                  <p className="text-muted-foreground mb-8">{plan.description}</p>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${plan.popular ? 'bg-gradient-to-r from-primary to-blue-500' : ''}`}
                    variant={plan.popular ? "default" : "outline"}
                    size="lg"
                  >
                    {plan.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-gradient-to-r from-primary via-purple-600 to-blue-600 text-primary-foreground p-12 md:p-20 text-center relative overflow-hidden">
              {/* Animated background */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.3)_0px,transparent_1px)] bg-[length:40px_40px]" />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative z-10"
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Ready to transform your digital security?
                </h2>
                <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
                  Join 10,000+ professionals who trust SecureVault with their most sensitive data.
                  Start your free 14-day trial today.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <Link href="/register">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative"
                    >
                      <div className="absolute -inset-1 bg-gradient-to-r from-white to-white/50 rounded-lg blur opacity-30" />
                      <Button
                        size="lg"
                        className="relative text-lg px-10 h-14 bg-white text-primary hover:bg-white/90 shadow-2xl"
                      >
                        <Sparkles className="mr-2 h-5 w-5" />
                        Start Free Trial
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </motion.div>
                  </Link>
                  
                  <Link href="/contact">
                    <Button
                      size="lg"
                      variant="outline"
                      className="text-lg px-10 h-14 bg-transparent border-white/30 text-white hover:bg-white/10"
                    >
                      Schedule Demo
                      <HelpCircle className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
                
                <p className="text-sm opacity-75 mt-8">
                  No credit card required • Cancel anytime • 24/7 support
                </p>
              </motion.div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="border-t border-border/30 py-12 backdrop-blur-lg bg-background/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-5 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold text-foreground">SecureVault</span>
              </div>
              <p className="text-muted-foreground mb-6 max-w-md">
                Enterprise-grade security meets intuitive design. Protecting your digital life since 2023.
              </p>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="border-primary/20">
                  <Lock className="mr-2 h-3 w-3" />
                  SOC 2 Certified
                </Badge>
                <Badge variant="outline" className="border-green-500/20">
                  <CheckCircle className="mr-2 h-3 w-3 text-green-500" />
                  GDPR Compliant
                </Badge>
              </div>
            </div>

            {/* Links */}
            {[
              {
                title: "Product",
                links: ["Features", "Security", "Pricing", "API", "Download"]
              },
              {
                title: "Company",
                links: ["About", "Blog", "Careers", "Press", "Partners"]
              },
              {
                title: "Resources",
                links: ["Documentation", "Help Center", "Community", "Legal", "Status"]
              }
            ].map((column) => (
              <div key={column.title}>
                <h4 className="font-semibold mb-4">{column.title}</h4>
                <ul className="space-y-3">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm">
              © 2025 SecureVault. All rights reserved. Built with ❤️ for security.
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-primary transition-colors">Cookie Policy</a>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span>English</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 p-3 rounded-full bg-gradient-to-r from-primary to-blue-500 text-white shadow-2xl z-40 hover:shadow-primary/30 transition-shadow"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ArrowRight className="h-5 w-5 rotate-90" />
      </motion.button>
    </div>
  )
}