import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import EthereumProvider from '@walletconnect/ethereum-provider'

export const useWalletConnect = () => {
  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)
  const [account, setAccount] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Initialize WalletConnect provider
  const initializeWalletConnect = async () => {
    try {
      const walletConnectProvider = await EthereumProvider.init({
        projectId: 'demo-project-id', // You should replace this with your actual project ID
        chains: [1, 5, 137, 80001], // Ethereum mainnet, Goerli, Polygon, Mumbai
        showQrModal: true,
        methods: ['eth_sendTransaction', 'personal_sign'],
        events: ['chainChanged', 'accountsChanged'],
        metadata: {
          name: 'SecureVault',
          description: 'Time-locked wallet application',
          url: 'https://securevault.app',
          icons: ['https://securevault.app/icon.png']
        }
      })

      return walletConnectProvider
    } catch (err) {
      console.error('Failed to initialize WalletConnect:', err)
      throw err
    }
  }

  // Connect wallet via WalletConnect
  const connectWalletConnect = async () => {
    try {
      setLoading(true)
      setError('')

      const walletConnectProvider = await initializeWalletConnect()
      
      // Enable session (triggers QR Code modal)
      await walletConnectProvider.enable()

      const web3Provider = new ethers.BrowserProvider(walletConnectProvider)
      const web3Signer = await web3Provider.getSigner()
      const address = await web3Signer.getAddress()

      setProvider(web3Provider)
      setSigner(web3Signer)
      setAccount(address)
      setIsConnected(true)

      // Listen for account changes
      walletConnectProvider.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet()
        } else {
          setAccount(accounts[0])
        }
      })

      // Listen for chain changes
      walletConnectProvider.on('chainChanged', (chainId) => {
        console.log('Chain changed to:', chainId)
      })

      // Listen for disconnect
      walletConnectProvider.on('disconnect', () => {
        disconnectWallet()
      })

    } catch (err) {
      setError('Failed to connect via WalletConnect')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Connect wallet via MetaMask
  const connectMetaMask = async () => {
    try {
      setLoading(true)
      setError('')

      if (!window.ethereum) {
        throw new Error('MetaMask not installed')
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })

      if (accounts.length > 0) {
        const web3Provider = new ethers.BrowserProvider(window.ethereum)
        const web3Signer = await web3Provider.getSigner()

        setProvider(web3Provider)
        setSigner(web3Signer)
        setAccount(accounts[0])
        setIsConnected(true)

        // Listen for account changes
        window.ethereum.on('accountsChanged', (accounts) => {
          if (accounts.length === 0) {
            disconnectWallet()
          } else {
            setAccount(accounts[0])
          }
        })

        // Listen for chain changes
        window.ethereum.on('chainChanged', () => {
          window.location.reload()
        })
      }
    } catch (err) {
      setError('Failed to connect MetaMask')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Disconnect wallet
  const disconnectWallet = () => {
    setProvider(null)
    setSigner(null)
    setAccount('')
    setIsConnected(false)
    setError('')
  }

  // Check for existing connections on mount
  useEffect(() => {
    const checkConnection = async () => {
      // Check MetaMask connection
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' })
          if (accounts.length > 0) {
            const web3Provider = new ethers.BrowserProvider(window.ethereum)
            const web3Signer = await web3Provider.getSigner()
            
            setProvider(web3Provider)
            setSigner(web3Signer)
            setAccount(accounts[0])
            setIsConnected(true)
          }
        } catch (err) {
          console.error('Failed to check existing connection:', err)
        }
      }
    }

    checkConnection()
  }, [])

  return {
    provider,
    signer,
    account,
    isConnected,
    loading,
    error,
    connectWalletConnect,
    connectMetaMask,
    disconnectWallet
  }
}

