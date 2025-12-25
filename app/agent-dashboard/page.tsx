"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function AgentDashboardPage() {
  const router = useRouter()
  const { agent, token, logout, isLoading, refreshAgent } = useAuth()
  const { toast } = useToast()
  const [isPaying, setIsPaying] = useState(false)
  const [paystackLoaded, setPaystackLoaded] = useState(false)

  // Load Paystack inline.js dynamically
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://js.paystack.co/v1/inline.js"
    script.async = true
    script.onload = () => setPaystackLoaded(true)
    script.onerror = () => console.error("Paystack script failed to load")
    document.body.appendChild(script)
  }, [])

  useEffect(() => {
    if (!isLoading && !token) {
      router.push("/agent-login")
    }
  }, [token, isLoading, router])

  const handleLogout = () => {
    logout()
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    })
    router.push("/agent-login")
  }

  const handlePaystackPayment = () => {
    if (!paystackLoaded || !(window as any).PaystackPop) {
      toast({ title: "Error", description: "Paystack not loaded", variant: "destructive" })
      return
    }

    setIsPaying(true)

    const handler = (window as any).PaystackPop.setup({
      key: "pk_test_fad2b13af8eb1e2190fec2c5b24bae5536321864",
      email: agent.email,
      amount: 5000, // Amount in Kobo (50 Naira)
      currency: "NGN",
      callback: function (response: { reference: string }) {
        // Use regular function for callback
        fetch(`http://localhost:5000/verify/${response.reference}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then(res => res.json())
          .then(data => {
            if (data.message?.toLowerCase().includes("successful")) {
              toast({ title: "Payment Successful", description: "Your seller account is now verified!" })
              refreshAgent() 
            } else {
              toast({
                title: "Payment Failed",
                description: data.message || "Please try again",
                variant: "destructive",
              })
            }
          })
          .catch(err => {
            console.error(err)
            toast({
              title: "Error",
              description: "Something went wrong verifying your payment",
              variant: "destructive",
            })
          })
          .finally(() => setIsPaying(false))
      },
      onClose: function () {
        toast({
          title: "Payment Cancelled",
          description: "You did not complete the payment.",
          variant: "destructive",
        })
        setIsPaying(false)
      },
    })

    handler.openIframe()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">Loading...</div>
      </div>
    )
  }

  if (!agent) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <header className="border-b bg-white dark:bg-slate-900 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">CampusHub</h1>
          <div className="flex items-center gap-4">
            <Link href="/marketplace">
              <Button variant="outline">Browse Marketplace</Button>
            </Link>
            <Button variant="ghost" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Agent Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>Your campus marketplace account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-semibold">{agent.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Agent Name</p>
                <p className="font-semibold">@{agent.agentName}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Matric Number</p>
                  <p className="font-semibold">{agent.matricNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Room Number</p>
                  <p className="font-semibold">{agent.roomNumber}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Residence</p>
                <p className="font-semibold">{agent.residence}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-semibold">{agent.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-semibold">{agent.phoneNumber}</p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Status & Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Seller Status</CardTitle>
              <CardDescription>Manage your seller account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800">
                <p className="text-sm text-muted-foreground mb-2">Payment Status</p>
                <div className="flex items-center justify-between">
                  <p className="font-bold text-lg">{agent.hasPaid ? "✓ Verified Seller" : "⚠ Not Verified"}</p>
                  <div className={`w-3 h-3 rounded-full ${agent.hasPaid ? "bg-green-500" : "bg-yellow-500"}`} />
                </div>
              </div>

              {agent.hasPaid ? (
                <Link href="/add-product" className="block">
                  <Button className="w-full">Add New Product</Button>
                </Link>
              ) : (
                <Button className="w-full" onClick={handlePaystackPayment} disabled={isPaying}>
                  {isPaying ? "Processing Payment..." : "Pay Now to Verify"}
                </Button>
              )}

              <Link href="/marketplace" className="block">
                <Button variant="outline" className="w-full bg-transparent">
                  Browse Marketplace
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
