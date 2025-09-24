"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ethers } from "ethers"
import { DATA } from "../../data"

export default function InstitutionDetailPage() {
  const params = useParams()
  const [account, setAccount] = useState("")
  const [institution, setInstitution] = useState(null)
  const [diplomas, setDiplomas] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [showAwardForm, setShowAwardForm] = useState(false)
  const [awardForm, setAwardForm] = useState({ recipient: "", metadataURI: "" })

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

  const loadDiplomas = async () => {
    try {
      if (!window.ethereum) throw new Error("Necesitas Metamask")
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const instContract = new ethers.Contract(params.address, DATA.institutionABI, signer)

      const name = await instContract.name()
      const symbol = await instContract.symbol()

      // Total de diplomas emitidos
      let total = 0
      try {
        total = Number(await instContract._tokenIds())
      } catch {
        total = 0
        let index = 1
        while (true) {
          try {
            await instContract.ownerOf(index)
            total = index
            index++
          } catch {
            break
          }
        }
      }

      const diplomasTemp = []
      for (let i = 1; i <= total; i++) {
        try {
          const owner = await instContract.ownerOf(i)
          const tokenUri = await instContract.tokenURI(i)
          const metadataURL = tokenUri.startsWith("ipfs://")
            ? `https://ipfs.io/ipfs/${tokenUri.slice(7)}`
            : tokenUri
          const res = await fetch(metadataURL)
          const metadata = await res.json()

          const institutionAttr = metadata.attributes.find((a) => a.trait_type === "Institution")?.value
          const studentName = metadata.attributes.find((a) => a.trait_type === "Student name")?.value
          const startDate = metadata.attributes.find((a) => a.trait_type === "Start date")?.value
          const endDate = metadata.attributes.find((a) => a.trait_type === "End date")?.value
          const programme = metadata.attributes.find((a) => a.trait_type === "Programme")?.value

          diplomasTemp.push({
            tokenId: i,
            owner,
            metadataURI: tokenUri,
            metadata: {
              name: metadata.name,
              description: metadata.description,
              image: metadata.image,
              institution: institutionAttr,
              studentName,
              startDate,
              endDate,
              programme,
            },
          })
        } catch (err) {
          console.error(`Error cargando diploma #${i}:`, err)
        }
      }

      setInstitution({ address: params.address, name, symbol })
      setDiplomas(diplomasTemp)
      setLoading(false)

      if (account) {
        const role = await instContract.allowedWallets(account)
        setIsAuthorized(role === "Rector" || role === "Secretaria")
      }
    } catch (err) {
      console.error("Error cargando institución:", err)
      setLoading(false)
    }
  }

  const awardDiploma = async (e) => {
    e.preventDefault()
    if (!awardForm.recipient || !awardForm.metadataURI) return
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const instContract = new ethers.Contract(params.address, DATA.institutionABI, signer)

      const tx = await instContract.awardItem(awardForm.recipient, awardForm.metadataURI)
      await tx.wait()

      setShowAwardForm(false)
      setAwardForm({ recipient: "", metadataURI: "" })
      setLoading(true)
      await loadDiplomas()
    } catch (err) {
      console.error("Error emitiendo diploma:", err)
    }
  }

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_accounts" })
        if (accounts.length > 0) setAccount(accounts[0])
      }
      await loadDiplomas()
    }
    init()
  }, [params.address, account])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <nav className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center">
              <img src="/credentiaLogo.svg" alt="Credentia Logo" className="w-10 h-10" />
              <Link href="/" className="text-2xl font-extrabold tracking-tight">
                Credentia
              </Link>
            </div>          </div>
        </nav>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <p className="text-muted-foreground">Cargando diplomas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img src="/credentiaLogo.svg" alt="Credentia Logo" className="w-10 h-10" />
            <Link href="/" className="text-2xl font-extrabold tracking-tight">
              Credentia
            </Link>
          </div>          {account ? (
            <div className="flex items-center space-x-3">
              <span className="text-sm">{account.slice(0, 6)}...{account.slice(-4)}</span>
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
              className="px-6 py-2 bg-primary rounded-lg text-primary-foreground hover:bg-primary/90"
            >
              Conectar Wallet
            </button>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">{institution.name}</h1>
            <p className="text-muted-foreground mt-2">
              Símbolo: {institution.symbol} • {diplomas.length} diplomas emitidos
            </p>
          </div>
          {isAuthorized && (
            <button
              onClick={() => setShowAwardForm(true)}
              className="px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90"
            >
              Emitir Diploma
            </button>
          )}
        </div>

        <h3 className="text-2xl font-semibold text-foreground mb-6">Diplomas Emitidos</h3>
        {diplomas.length === 0 ? (
          <p className="text-muted-foreground">Esta institución aún no ha emitido diplomas.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {diplomas.map((d) => (
              <div
                key={d.tokenId}
                className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow flex flex-col"
              >
                {d.metadata.image && (
                  <img
                    src={d.metadata.image}
                    alt={`NFT ${d.tokenId}`}
                    className="w-full h-40 object-contain mb-4 rounded"
                  />
                )}
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold">{d.metadata.name}</h4>
                    <span className="text-xs bg-accent/10 px-2 py-1 rounded">#{d.tokenId}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {d.metadata.description.length < 100
                      ? d.metadata.description
                      : d.metadata.description.slice(0, 100) + "..."}
                  </p>
                  {d.metadata.studentName && (
                    <p className="mt-2 text-sm"><strong>Estudiante:</strong> {d.metadata.studentName}</p>
                  )}
                  {(d.metadata.startDate || d.metadata.endDate) && (
                    <p className="mt-1 text-sm">
                      <strong>Periodo:</strong> {d.metadata.startDate} - {d.metadata.endDate}
                    </p>
                  )}
                  {d.metadata.institution && (
                    <p className="mt-1 text-sm"><strong>Institución:</strong> {d.metadata.institution}</p>
                  )}
                  <p className="text-xs font-mono break-all mt-2 text-muted-foreground">
                    Propietario: {d.owner}
                  </p>
                </div>
                <a
                  href={`https://eth-sepolia.blockscout.com/token/${institution.address}/instance/${d.tokenId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 px-4 py-2 bg-primary text-primary-foreground text-center rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Ver en Blockscout →
                </a>
              </div>
            ))}
          </div>
        )}

        {showAwardForm && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">Emitir Nuevo Diploma</h3>
              <form onSubmit={awardDiploma} className="space-y-4">
                <input
                  type="text"
                  placeholder="Dirección del estudiante"
                  value={awardForm.recipient}
                  onChange={(e) => setAwardForm({ ...awardForm, recipient: e.target.value })}
                  className="w-full px-3 py-2 bg-input border border-border rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="URI de Metadatos"
                  value={awardForm.metadataURI}
                  onChange={(e) => setAwardForm({ ...awardForm, metadataURI: e.target.value })}
                  className="w-full px-3 py-2 bg-input border border-border rounded"
                  required
                />
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90"
                  >
                    Emitir
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAwardForm(false)}
                    className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
