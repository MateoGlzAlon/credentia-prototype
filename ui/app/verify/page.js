"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ethers } from "ethers"
import { ExternalLink } from "lucide-react"

export default function VerifyPage() {
  const [account, setAccount] = useState("")
  const [tokenId, setTokenId] = useState("")
  const [institutionAddress, setInstitutionAddress] = useState("")
  const [verificationResult, setVerificationResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const connectWallet = async () => {
    if (!window.ethereum) return
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
      setAccount(accounts[0])
    } catch (error) {
      console.error("Error conectando wallet:", error)
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

  const verifyDiploma = async (e) => {
    e.preventDefault()
    if (!tokenId || !institutionAddress) return
    setLoading(true)
    try {
      const institutionABI = [
        "function ownerOf(uint256 tokenId) view returns (address)",
        "function tokenURI(uint256 tokenId) view returns (string)",
      ]
      const provider = new ethers.BrowserProvider(window.ethereum)
      const contract = new ethers.Contract(institutionAddress, institutionABI, provider)

      const owner = await contract.ownerOf(tokenId)
      const tokenURI = await contract.tokenURI(tokenId)
      const metadataURL = tokenURI.startsWith("ipfs://")
        ? `https://ipfs.io/ipfs/${tokenURI.slice(7)}`
        : tokenURI
      const res = await fetch(metadataURL)
      const metadata = await res.json()

      const institutionAttr = metadata.attributes.find((a) => a.trait_type === "Institution")?.value
      const studentName = metadata.attributes.find((a) => a.trait_type === "Student name")?.value
      const startDate = metadata.attributes.find((a) => a.trait_type === "Start date")?.value
      const endDate = metadata.attributes.find((a) => a.trait_type === "End date")?.value
      const programme = metadata.attributes.find((a) => a.trait_type === "Programme")?.value

      setVerificationResult({
        valid: true,
        owner,
        institutionName: institutionAttr,
        tokenURI,
        metadata: {
          name: metadata.name,
          description: metadata.description,
          external_url: metadata.external_url,
          image: metadata.image,
          studentName,
          startDate,
          endDate,
          programme,
        },
      })
    } catch (err) {
      console.error("Error verificando diploma:", err)
      setVerificationResult({ valid: false })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_accounts" })
        if (accounts.length > 0) setAccount(accounts[0])
      }
    }
    checkConnection()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
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
              <Link href="/institutions" className="text-muted-foreground hover:text-foreground transition">
                Instituciones
              </Link>
              <Link href="/verify" className="font-medium text-foreground border-b-2 border-accent">
                Verificar
              </Link>
              <Link href="/create" className="text-muted-foreground hover:text-foreground transition">
                Crear Institución
              </Link>
            </div>
          </div>
          {account ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {account.slice(0, 6)}...{account.slice(-4)}
              </span>
              <button
                onClick={switchAccount}
                className="px-4 py-2 bg-secondary rounded-lg hover:bg-secondary/80 text-sm"
              >
                Cambiar Wallet
              </button>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
            >
              Conectar Wallet
            </button>
          )}
        </div>
      </nav>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight">
            Verificar Diploma
          </h1>
          <p className="text-muted-foreground mt-2">
            Comprueba la autenticidad de cualquier diploma emitido en blockchain.
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-card shadow-md border border-border rounded-xl p-8">
          <form onSubmit={verifyDiploma} className="space-y-6">
            <div>
              <label htmlFor="institutionAddress" className="block text-sm font-semibold mb-2">
                Dirección de la Institución
              </label>
              <input
                type="text"
                id="institutionAddress"
                value={institutionAddress}
                onChange={(e) => setInstitutionAddress(e.target.value)}
                placeholder="0xFE28e5F58534B1a4f7D80c73fc4B8fCDEe9E4bFA"
                className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-accent"
                required
              />
            </div>
            <div>
              <label htmlFor="tokenId" className="block text-sm font-semibold mb-2">
                ID del Token (NFT)
              </label>
              <input
                type="number"
                id="tokenId"
                value={tokenId}
                onChange={(e) => setTokenId(e.target.value)}
                placeholder="1"
                className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-accent"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading || !tokenId || !institutionAddress}
              className="w-full px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 font-medium disabled:opacity-50"
            >
              {loading ? "Verificando..." : "Verificar Diploma"}
            </button>
          </form>
        </div>

        {/* Resultado */}
        {verificationResult && (
          <div className="mt-10 bg-card shadow-lg border border-border rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              {verificationResult.valid ? (
                <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : (
                <div className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              )}
              <h3 className="text-2xl font-semibold">
                {verificationResult.valid ? "Diploma Verificado" : "Diploma No Válido"}
              </h3>
            </div>

            {verificationResult.valid && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">Título</p>
                  <p className="font-medium text-lg">{verificationResult.metadata.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estudiante</p>
                  <p className="font-medium">{verificationResult.metadata.studentName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Institución</p>
                  <p className="font-medium">{verificationResult.institutionName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Periodo</p>
                  <p className="font-medium">
                    {verificationResult.metadata.startDate} - {verificationResult.metadata.endDate}
                  </p>
                </div>
              </div>
            )}

            {verificationResult.valid && (
              <>
                <div className="border-t border-border mt-6 pt-4">
                  <p className="text-sm text-muted-foreground">Propietario del NFT</p>
                  <p className="font-mono text-sm break-all">{verificationResult.owner}</p>
                </div>
                {verificationResult.metadata.image && (
                  <div className="mt-6 flex justify-center">
                    <img
                      src={verificationResult.metadata.image}
                      alt="Logo Institución"
                      className="w-40 h-auto rounded-lg shadow-md"
                    />
                  </div>
                )}
                <div className="mt-6 flex flex-wrap gap-4">
                  <a
                    href={`https://sepolia.etherscan.io/address/${institutionAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 text-sm"
                  >
                    Ver en Etherscan →
                  </a>
                  <a
                    href={`https://eth-sepolia.blockscout.com/address/${institutionAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 text-sm"
                  >
                    Ver en Blockscout →
                  </a>
                  {verificationResult.metadata.external_url && (
                    <a
                      href={verificationResult.metadata.external_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 text-sm"
                    >
                      Sitio Oficial →
                    </a>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
