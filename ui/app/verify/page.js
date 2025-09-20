"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export default function VerifyPage() {
  const [account, setAccount] = useState("")
  const [tokenId, setTokenId] = useState("")
  const [institutionAddress, setInstitutionAddress] = useState("")
  const [verificationResult, setVerificationResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        })
        setAccount(accounts[0])
      } catch (error) {
        console.error("Error conectando wallet:", error)
      }
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

  const verifyDiploma = async (e) => {
    e.preventDefault()
    if (!tokenId || !institutionAddress) return

    setLoading(true)

    // Aquí implementarás la verificación real del contrato
    setTimeout(() => {
      setVerificationResult({
        valid: true,
        owner: "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
        institutionName: "Universidad Ejemplo",
        tokenURI: "https://ipfs.io/ipfs/QmExample...",
        metadata: {
          name: "Grado en Ingeniería Informática",
          description: "Título universitario verificado en blockchain",
          graduationDate: "2024-06-15",
          studentName: "Juan Pérez",
        },
      })
      setLoading(false)
    }, 2000)
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
                <Link href="/verify" className="text-foreground font-medium">
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
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Conectar Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground">Verificar Diploma</h1>
            <p className="text-muted-foreground mt-2">
              Verifica la autenticidad de cualquier diploma emitido en blockchain
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-8">
            <form onSubmit={verifyDiploma} className="space-y-6">
              <div>
                <label htmlFor="institutionAddress" className="block text-sm font-medium text-foreground mb-2">
                  Dirección de la Institución
                </label>
                <input
                  type="text"
                  id="institutionAddress"
                  value={institutionAddress}
                  onChange={(e) => setInstitutionAddress(e.target.value)}
                  placeholder="0xFE28e5F58534B1a4f7D80c73fc4B8fCDEe9E4bFA"
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                  required
                />
              </div>

              <div>
                <label htmlFor="tokenId" className="block text-sm font-medium text-foreground mb-2">
                  ID del Token (NFT)
                </label>
                <input
                  type="number"
                  id="tokenId"
                  value={tokenId}
                  onChange={(e) => setTokenId(e.target.value)}
                  placeholder="1"
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || !tokenId || !institutionAddress}
                className="w-full px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Verificando..." : "Verificar Diploma"}
              </button>
            </form>
          </div>

          {verificationResult && (
            <div className="bg-card border border-border rounded-lg p-8">
              <div className="flex items-center space-x-3 mb-6">
                {verificationResult.valid ? (
                  <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-destructive/10 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                )}
                <h3 className="text-xl font-semibold text-foreground">
                  {verificationResult.valid ? "Diploma Verificado ✓" : "Diploma No Válido ✗"}
                </h3>
              </div>

              {verificationResult.valid && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-muted-foreground">Título:</span>
                      <p className="text-foreground font-medium">{verificationResult.metadata.name}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Estudiante:</span>
                      <p className="text-foreground font-medium">{verificationResult.metadata.studentName}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Institución:</span>
                      <p className="text-foreground font-medium">{verificationResult.institutionName}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Fecha de Graduación:</span>
                      <p className="text-foreground font-medium">{verificationResult.metadata.graduationDate}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <span className="text-sm text-muted-foreground">Propietario del NFT:</span>
                    <p className="text-foreground font-mono text-sm">{verificationResult.owner}</p>
                  </div>

                  <div className="flex space-x-4">
                    <a
                      href={`https://sepolia.etherscan.io/address/${institutionAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors text-sm"
                    >
                      Ver en Etherscan
                    </a>
                    <a
                      href={`https://sepolia.blockscout.com/address/${institutionAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors text-sm"
                    >
                      Ver en Blockscout
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
