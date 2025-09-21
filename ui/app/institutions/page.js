"use client"

import { useState, useEffect } from "react"
import { DATA } from "../data"
import { ethers } from "ethers"
import Link from "next/link"

export default function InstitutionsPage() {
  const [account, setAccount] = useState("")
  const [institutions, setInstitutions] = useState([])
  const [loading, setLoading] = useState(true)

  const factoryAddress = DATA.factoryAddress
  const factoryAbi = DATA.factoryABI
  const institutionAbi = DATA.institutionABI

  const connectWallet = async () => {
    if (!window.ethereum) return
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
      setAccount(accounts[0])
    } catch (err) {
      console.error("Error conectando wallet:", err)
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
    } catch (err) {
      console.error("Error cambiando cuenta:", err)
    }
  }

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_accounts" })
        if (accounts.length > 0) setAccount(accounts[0])
      }
      await getInstitutionsContract()
    }
    init()
  }, [])

  async function getInstitutionsContract() {
    try {
      if (!window.ethereum) throw new Error("Necesitas Metamask")
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const factory = new ethers.Contract(factoryAddress, factoryAbi, signer)

      const addrs = await factory.getInstitutions()
      if (!addrs || addrs.length === 0) {
        setInstitutions([])
        setLoading(false)
        return
      }

      const institutionsFromContract = []
      for (const addr of addrs) {
        const institution = new ethers.Contract(addr, institutionAbi, signer)
        const name = await institution.name()
        const symbol = await institution.symbol()
        const image = await institution.institutionLogo()
        let diplomasEmitidos = "No disponible"

        try {
          if (institution.totalMinted) {
            const minted = await institution.totalMinted()
            diplomasEmitidos = minted.toString()
          }
        } catch {
          diplomasEmitidos = "No disponible"
        }

        institutionsFromContract.push({ address: addr, name, symbol, image, diplomasEmitidos })
      }

      setInstitutions(institutionsFromContract)
      setLoading(false)
    } catch (err) {
      console.error("Error cargando instituciones:", err)
      setInstitutions([])
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img src="/credentiaLogo.svg" alt="Credentia Logo" className="w-10 h-10" />
            <Link href="/" className="text-2xl font-extrabold tracking-tight">
              Credentia
            </Link>
          </div>          {account ? (
            <div className="flex items-center space-x-3">
              <span className="text-sm text-muted-foreground">
                {account.slice(0, 6)}...{account.slice(-4)}
              </span>
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
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Instituciones Registradas</h1>
            <p className="text-muted-foreground mt-2">
              Universidades verificadas que pueden emitir diplomas en blockchain
            </p>
          </div>
          <Link
            href="/create"
            className="px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors font-medium"
          >
            Registrar Institución
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-6 animate-pulse">
                <div className="h-6 bg-muted rounded mb-4"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded mb-4"></div>
                <div className="h-10 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        ) : institutions.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No hay instituciones registradas
            </h3>
            <p className="text-muted-foreground mb-6">
              Sé la primera universidad en registrarse en la plataforma
            </p>
            <Link
              href="/create"
              className="px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors font-medium inline-block"
            >
              Registrar Primera Institución
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {institutions.map((inst) => (
              <div
                key={inst.address}
                className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow flex flex-col"
              >
                <div className="flex-grow space-y-4">
                  {inst.image && inst.image.startsWith("http") ? (
                    <img
                      src={inst.image}
                      alt={inst.name}
                      className="w-full h-32 object-contain rounded"
                    />
                  ) : (
                    <div className="w-full h-32 flex items-center justify-center bg-muted rounded">
                      <span className="text-muted-foreground text-sm">Sin logo</span>
                    </div>
                  )}
                  <h3 className="text-xl font-semibold text-foreground">{inst.name}</h3>
                  <p className="text-sm text-muted-foreground">Símbolo: {inst.symbol}</p>
                  <p className="text-sm text-muted-foreground">
                    Dirección:{" "}
                    <span
                      className="text-primary cursor-pointer"
                      onClick={() =>
                        window.open(
                          `https://eth-sepolia.blockscout.com/address/${inst.address}`,
                          "_blank"
                        )
                      }
                    >
                      {inst.address.slice(0, 6)}...{inst.address.slice(-4)}
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Diplomas emitidos: {inst.diplomasEmitidos}
                  </p>
                </div>
                <Link
                  href={`/institutions/${inst.address}`}
                  className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 text-center"
                >
                  Ver Detalles
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
