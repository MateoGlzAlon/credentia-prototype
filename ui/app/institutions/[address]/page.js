"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function InstitutionDetailPage() {
  const params = useParams()
  const [account, setAccount] = useState("")
  const [institution, setInstitution] = useState(null)
  const [diplomas, setDiplomas] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [showAwardForm, setShowAwardForm] = useState(false)
  const [awardForm, setAwardForm] = useState({
    recipient: "",
    metadataURI: "",
  })

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

  const awardDiploma = async (e) => {
    e.preventDefault()
    if (!awardForm.recipient || !awardForm.metadataURI) return

    // Aquí implementarás la función awardItem del contrato
    console.log("Emitiendo diploma:", awardForm)

    // Simulación
    setTimeout(() => {
      setShowAwardForm(false)
      setAwardForm({ recipient: "", metadataURI: "" })
      // Recargar diplomas
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

    // Simular carga de datos de la institución
    setTimeout(() => {
      setInstitution({
        address: params.address,
        name: "Universidad Ejemplo",
        symbol: "UEJ",
        rector: "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
        secretaria: "0x8ba1f109551bD432803012645Hac136c9c1e3a9",
      })

      setDiplomas([
        {
          tokenId: 1,
          owner: "0x123...abc",
          metadataURI: "https://ipfs.io/ipfs/QmExample1",
          metadata: {
            name: "Grado en Ingeniería Informática",
            studentName: "Juan Pérez",
            graduationDate: "2024-06-15",
          },
        },
        {
          tokenId: 2,
          owner: "0x456...def",
          metadataURI: "https://ipfs.io/ipfs/QmExample2",
          metadata: {
            name: "Máster en Ciencias de Datos",
            studentName: "María García",
            graduationDate: "2024-07-20",
          },
        },
      ])

      setLoading(false)
    }, 1000)
  }, [params.address])

  useEffect(() => {
    if (account && institution) {
      // Verificar si la cuenta conectada es rector o secretaria
      const authorized =
        account.toLowerCase() === institution.rector.toLowerCase() ||
        account.toLowerCase() === institution.secretaria.toLowerCase()
      setIsAuthorized(authorized)
    }
  }, [account, institution])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <nav className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-2xl font-bold text-foreground">
                Credentia
              </Link>
              <div className="flex items-center space-x-4">
                {account ? (
                  <div className="text-sm text-muted-foreground">
                    {account.slice(0, 6)}...{account.slice(-4)}
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
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

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
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="space-y-8">
          {/* Institution Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground">{institution.name}</h1>
              <p className="text-muted-foreground mt-2">
                Símbolo: {institution.symbol} • {diplomas.length} diplomas emitidos
              </p>
            </div>
            {isAuthorized && (
              <button
                onClick={() => setShowAwardForm(true)}
                className="px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors font-medium"
              >
                Emitir Diploma
              </button>
            )}
          </div>

          {/* Institution Info */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-semibold text-foreground mb-4">Información de la Institución</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Dirección del Contrato:</span>
                <p className="font-mono text-foreground">{institution.address}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Rector:</span>
                <p className="font-mono text-foreground">{institution.rector}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Secretaría:</span>
                <p className="font-mono text-foreground">{institution.secretaria}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Red:</span>
                <p className="text-foreground">Sepolia Testnet</p>
              </div>
            </div>
          </div>

          {/* Award Form Modal */}
          {showAwardForm && (
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md">
                <h3 className="text-xl font-semibold text-foreground mb-4">Emitir Nuevo Diploma</h3>
                <form onSubmit={awardDiploma} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Dirección del Estudiante</label>
                    <input
                      type="text"
                      value={awardForm.recipient}
                      onChange={(e) => setAwardForm((prev) => ({ ...prev, recipient: e.target.value }))}
                      placeholder="0x..."
                      className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">URI de Metadatos (IPFS)</label>
                    <input
                      type="text"
                      value={awardForm.metadataURI}
                      onChange={(e) => setAwardForm((prev) => ({ ...prev, metadataURI: e.target.value }))}
                      placeholder="https://ipfs.io/ipfs/..."
                      className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                      required
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors"
                    >
                      Emitir
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAwardForm(false)}
                      className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Diplomas List */}
          <div>
            <h3 className="text-2xl font-semibold text-foreground mb-6">Diplomas Emitidos</h3>
            {diplomas.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-foreground mb-2">No hay diplomas emitidos</h4>
                <p className="text-muted-foreground">Esta institución aún no ha emitido ningún diploma</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {diplomas.map((diploma) => (
                  <div
                    key={diploma.tokenId}
                    className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-foreground">{diploma.metadata.name}</h4>
                        <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">#{diploma.tokenId}</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Estudiante:</span>
                          <p className="text-foreground">{diploma.metadata.studentName}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Graduación:</span>
                          <p className="text-foreground">{diploma.metadata.graduationDate}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Propietario:</span>
                          <p className="font-mono text-foreground text-xs">{diploma.owner}</p>
                        </div>
                      </div>
                      <div className="pt-3 border-t border-border">
                        <a
                          href={`https://sepolia.blockscout.com/token/${institution.address}/instance/${diploma.tokenId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:text-accent/80 text-sm font-medium"
                        >
                          Ver en Blockscout →
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
