"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Link from "next/link";
import { DATA } from "../data";

export default function CreateInstitutionPage() {
  const [account, setAccount] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    institutionLogo: "",
    rectorAddress: "",
    secretariaAddress: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const factoryAddress = DATA.factoryAddress;
  const factoryAbi = DATA.factoryABI;

  const connectWallet = async () => {
    if (!window.ethereum) return;
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);
    } catch (error) {
      console.error("Error conectando wallet:", error);
    }
  };

  const switchAccount = async () => {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: {} }],
      });
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      setAccount(accounts[0]);
    } catch (error) {
      console.error("Error cambiando cuenta:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const createInstitution = async (e) => {
    e.preventDefault();
    if (!account) {
      alert("Por favor conecta tu wallet primero");
      return;
    }
    setLoading(true);
    console.log("Creando institución con datos:", formData);

    try {
      await createInstitutionContract(
        formData.name,
        formData.symbol,
        formData.institutionLogo,
        formData.rectorAddress,
        formData.secretariaAddress
      );
      setSuccess(true);
    } catch (error) {
      console.error("Error creando institución:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) setAccount(accounts[0]);
      }
    };
    checkConnection();
  }, []);

  async function createInstitutionContract(name, symbol, logo, rector, secretaria) {
    if (!window.ethereum) throw new Error("Necesitas Metamask o un proveedor inyectado");
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const factory = new ethers.Contract(factoryAddress, factoryAbi, signer);

    const tx = await factory.createInstitution(name, symbol, logo, rector, secretaria);
    console.log("Tx enviada:", tx.hash);
    const receipt = await tx.wait();
    console.log("Tx confirmada en bloque:", receipt.blockNumber);

    const event = receipt.logs
      .map((log) => {
        try {
          return factory.interface.parseLog(log);
        } catch {
          return null;
        }
      })
      .filter((e) => e && e.name === "InstitutionCreated")[0];

    if (event) {
      console.log("Nueva institución creada en:", event.args.institutionAddress);
      return event.args.institutionAddress;
    }
    return null;
  }

  if (success) {
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
            </div>          </div>
        </nav>

        {/* Mensaje de éxito */}
        <main className="max-w-4xl mx-auto px-6 py-12 text-center space-y-6">
          <div className="w-16 h-16 bg-accent/10 rounded-full mx-auto flex items-center justify-center">
            <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold">¡Institución Creada!</h1>
          <p className="text-muted-foreground">
            Tu institución ha sido registrada exitosamente en la blockchain.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/institutions"
              className="px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 font-medium"
            >
              Ver Instituciones
            </Link>
            <button
              onClick={() => {
                setSuccess(false);
                setFormData({ name: "", symbol: "", institutionLogo: "", rectorAddress: "", secretariaAddress: "" });
              }}
              className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 font-medium"
            >
              Crear Otra
            </button>
          </div>
        </main>
      </div>
    );
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

      {/* Contenido principal */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground">Crear Nueva Institución</h1>
            <p className="text-muted-foreground mt-2">
              Registra tu universidad en la blockchain para comenzar a emitir diplomas verificables
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-8">
            <form onSubmit={createInstitution} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Nombre de la Institución</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Oxford University"
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Símbolo</label>
                  <input
                    name="symbol"
                    value={formData.symbol}
                    onChange={handleInputChange}
                    placeholder="OXF"
                    maxLength="5"
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg"
                    required
                  />
                </div>
              </div>

              {/* Campo para el logo */}
              <div>
                <label className="block text-sm font-medium mb-2">URL del Logo de la Institución</label>
                <input
                  name="institutionLogo"
                  value={formData.institutionLogo}
                  onChange={handleInputChange}
                  placeholder="https://ejemplo.com/logo.png"
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Proporciona una URL de imagen válida para representar el logo de tu institución.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Dirección del Rector</label>
                <input
                  name="rectorAddress"
                  value={formData.rectorAddress}
                  onChange={handleInputChange}
                  placeholder="0x742d35Cc6634C0532925a3b8D4C9db96590c6C87"
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Wallet autorizada para emitir diplomas como Rector
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Dirección de Secretaría</label>
                <input
                  name="secretariaAddress"
                  value={formData.secretariaAddress}
                  onChange={handleInputChange}
                  placeholder="0x8ba1f109551bD432803012645Hac136c9c1e3a9"
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Wallet autorizada para emitir diplomas como Secretaría
                </p>
              </div>

              {/* Información importante */}
              <div className="bg-muted/50 border border-border rounded-lg p-4">
                <h3 className="font-medium text-foreground mb-2">Información importante:</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Solo las direcciones de Rector y Secretaría podrán emitir diplomas</li>
                  <li>• La creación de la institución requiere gas fees en Sepolia ETH</li>
                  <li>• Una vez creada, la institución será inmutable en la blockchain</li>
                  <li>• Asegúrate de que las direcciones sean correctas antes de continuar</li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={loading || !account}
                className="w-full px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 font-medium disabled:opacity-50"
              >
                {loading ? "Creando Institución..." : "Crear Institución"}
              </button>

              {!account && (
                <p className="text-center text-sm text-muted-foreground">
                  Conecta tu wallet para crear una institución
                </p>
              )}
            </form>
          </div>

          {/* Contratos de referencia */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-semibold text-foreground mb-3">Contratos de Referencia</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Factory Contract:</span>
                <span className="ml-2 font-mono text-foreground">
                  {factoryAddress}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Red:</span>
                <span className="ml-2 text-foreground">Sepolia Testnet</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
