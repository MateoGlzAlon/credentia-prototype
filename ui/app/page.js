"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export default function HomePage() {
  const [account, setAccount] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      setIsConnecting(true)
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        })
        setAccount(accounts[0])
      } catch (error) {
        console.error("Error conectando wallet:", error)
      } finally {
        setIsConnecting(false)
      }
    } else {
      alert("Por favor instala MetaMask")
    }
  }

  const switchAccount = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({
          method: "wallet_requestPermissions",
          params: [{ eth_accounts: {} }],
        })
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        })
        setAccount(accounts[0])
      } catch (error) {
        console.error("Error cambiando cuenta:", error)
      }
    }
  }

  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== "undefined") {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        })
        if (accounts.length > 0) {
          setAccount(accounts[0])
        }
      }
    }
    checkConnection()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-2xl font-bold text-foreground">
                Credentia
              </Link>
              <div className="hidden md:flex space-x-6">
                <Link href="/institutions" className="text-muted-foreground hover:text-foreground transition-colors">
                  Instituciones
                </Link>
                <Link href="/verify" className="text-muted-foreground hover:text-foreground transition-colors">
                  Verificar
                </Link>
                <Link href="/create" className="text-muted-foreground hover:text-foreground transition-colors">
                  Crear Institución
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {account ? (
                <div className="flex items-center space-x-3">
                  <div className="text-sm text-muted-foreground">
                    {account.slice(0, 6)}...{account.slice(-4)}
                  </div>
                  <button
                    onClick={switchAccount}
                    className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors text-sm"
                  >
                    Cambiar Wallet
                  </button>
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isConnecting ? "Conectando..." : "Conectar Wallet"}
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
              Títulos universitarios
              <span className="block text-accent">verificables en blockchain</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Credentia es la plataforma que permite a las universidades emitir diplomas como NFTs verificables,
              eliminando la falsificación y facilitando la verificación instantánea para empleadores.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/institutions"
              className="px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Ver Instituciones
            </Link>
            <Link
              href="/verify"
              className="px-8 py-4 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium"
            >
              Verificar Diploma
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-accent">100%</div>
            <div className="text-muted-foreground">Verificable</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-accent">Sepolia</div>
            <div className="text-muted-foreground">Testnet</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-accent">NFT</div>
            <div className="text-muted-foreground">Estándar</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-accent">Inmutable</div>
            <div className="text-muted-foreground">Blockchain</div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-card border border-border rounded-lg p-8 space-y-4">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-foreground">Verificación Instantánea</h3>
            <p className="text-muted-foreground">
              Los empleadores pueden verificar la autenticidad de cualquier diploma en segundos usando la blockchain.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-8 space-y-4">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-foreground">Seguridad Absoluta</h3>
            <p className="text-muted-foreground">
              Imposible de falsificar gracias a la tecnología blockchain y los contratos inteligentes.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-8 space-y-4">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-foreground">Emisión Rápida</h3>
            <p className="text-muted-foreground">
              Las universidades pueden emitir diplomas digitales de forma inmediata tras la graduación.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
