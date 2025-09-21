"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export default function HomePage() {
  const [account, setAccount] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)

  const connectWallet = async () => {
    if (!window.ethereum) return alert("Por favor instala MetaMask")
    setIsConnecting(true)
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
      setAccount(accounts[0])
    } catch (error) {
      console.error("Error conectando wallet:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const switchAccount = async () => {
    if (!window.ethereum) return
    try {
      await window.ethereum.request({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: {} }],
      })
      const accounts = await window.ethereum.request({ method: "eth_accounts" })
      setAccount(accounts[0])
    } catch (error) {
      console.error("Error cambiando cuenta:", error)
    }
  }

  useEffect(() => {
    const checkConnection = async () => {
      if (!window.ethereum) return
      const accounts = await window.ethereum.request({ method: "eth_accounts" })
      if (accounts.length > 0) setAccount(accounts[0])
    }
    checkConnection()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-background text-foreground">
      {/* Navbar */}
      <nav className="border-b border-border bg-card/70 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <div className="flex items-center">
              <img src="/credentiaLogo.svg" alt="Credentia Logo" className="w-10 h-10" />
              <Link href="/" className="text-2xl font-extrabold tracking-tight">
                Credentia
              </Link>
            </div>
            <div className="hidden md:flex gap-6 text-sm">
              <Link href="/institutions" className="hover:text-accent transition">Instituciones</Link>
              <Link href="/verify" className="hover:text-accent transition">Verificar</Link>
              <Link href="/create" className="hover:text-accent transition">Crear Institución</Link>
            </div>
          </div>
          {account ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {account.slice(0, 6)}...{account.slice(-4)}
              </span>
              <button
                onClick={switchAccount}
                className="px-4 py-2 bg-secondary rounded-lg hover:bg-secondary/80 text-sm transition"
              >
                Cambiar Wallet
              </button>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              disabled={isConnecting}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition"
            >
              {isConnecting ? "Conectando..." : "Conectar Wallet"}
            </button>
          )}
        </div>
      </nav>

      {/* Hero */}
      <header className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
          Títulos universitarios{" "}
          <span className="block text-accent">verificables en blockchain</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Credentia permite a las universidades emitir diplomas como NFTs verificables, eliminando la falsificación y
          facilitando la verificación instantánea para empleadores.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-6">
          <Link
            href="/institutions"
            className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-medium hover:scale-105 hover:bg-primary/90 shadow-lg transition"
          >
            Ver Instituciones
          </Link>
          <Link
            href="/verify"
            className="px-8 py-4 bg-secondary text-secondary-foreground rounded-lg font-medium hover:scale-105 hover:bg-secondary/80 shadow-lg transition"
          >
            Verificar Diploma
          </Link>
        </div>
      </header>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center mt-12">
        {[
          { title: "100%", subtitle: "Verificable" },
          { title: "Sepolia", subtitle: "Testnet" },
          { title: "NFT", subtitle: "Estándar" },
          { title: "Inmutable", subtitle: "Blockchain" },
        ].map((stat) => (
          <div key={stat.title} className="space-y-2">
            <div className="text-3xl font-bold text-accent">{stat.title}</div>
            <div className="text-muted-foreground">{stat.subtitle}</div>
          </div>
        ))}
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-10">
        {[
          {
            icon: (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            ),
            title: "Verificación Instantánea",
            desc: "Los empleadores pueden verificar la autenticidad de cualquier diploma en segundos usando blockchain.",
          },
          {
            icon: (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            ),
            title: "Seguridad Absoluta",
            desc: "Imposible de falsificar gracias a la tecnología blockchain y contratos inteligentes.",
          },
          {
            icon: (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            ),
            title: "Emisión Rápida",
            desc: "Las universidades pueden emitir diplomas digitales inmediatamente tras la graduación.",
          },
        ].map((feature) => (
          <div
            key={feature.title}
            className="bg-card border border-border rounded-xl p-8 shadow-sm hover:shadow-lg transition flex flex-col items-center text-center"
          >
            <div className="w-14 h-14 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {feature.icon}
              </svg>
            </div>
            <h3 className="text-xl font-semibold">{feature.title}</h3>
            <p className="text-muted-foreground mt-2">{feature.desc}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="bg-card/50 border-t border-border py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Credentia
      </footer>
    </div>
  )
}
