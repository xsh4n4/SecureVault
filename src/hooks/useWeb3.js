import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useWalletConnect } from './useWalletConnect'

// Time-Locked Wallet Contract ABI
const TIME_LOCKED_WALLET_ABI = [
  {
    "inputs": [{"internalType": "uint256", "name": "_unlockTimestamp", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "account", "type": "address"}
    ],
    "name": "AddressWhitelisted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "sender", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"}
    ],
    "name": "FundsDeposited",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "recipient", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"}
    ],
    "name": "FundsWithdrawn",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": false, "internalType": "uint256", "name": "oldTimestamp", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "newTimestamp", "type": "uint256"}
    ],
    "name": "UnlockTimeExtended",
    "type": "event"
  },
  {
    "inputs": [{"internalType": "address", "name": "_account", "type": "address"}],
    "name": "addToWhitelist",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_newUnlockTimestamp", "type": "uint256"}],
    "name": "extendUnlockTime",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "unlockTimestamp",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "", "type": "address"}],
    "name": "whitelistedAddresses",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  }
]

export const useWeb3 = () => {
  const {
    provider,
    signer,
    account,
    isConnected,
    loading: walletLoading,
    error: walletError,
    connectWalletConnect,
    connectMetaMask,
    disconnectWallet: disconnectWalletConnect
  } = useWalletConnect()

  const [contract, setContract] = useState(null)
  const [contractAddress, setContractAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Connect wallet (MetaMask)
  const connectWallet = async () => {
    await connectMetaMask()
  }

  // Connect wallet (WalletConnect)
  const connectWalletConnectProvider = async () => {
    await connectWalletConnect()
  }

  // Disconnect wallet
  const disconnectWallet = () => {
    disconnectWalletConnect()
    setContract(null)
    setContractAddress('')
  }

  // Deploy contract
  const deployContract = async (unlockTimestamp) => {
    try {
      setLoading(true)
      setError('')
      
      if (!signer) {
        throw new Error('Wallet not connected')
      }

      // Simulate deployment delay
      await new Promise(resolve => setTimeout(resolve, 2000))

      // For demo purposes, we'll simulate contract deployment
      const mockContractAddress = '0x' + Math.random().toString(16).substr(2, 40)
      setContractAddress(mockContractAddress)
      
      // Create contract instance (mock)
      const contractInstance = new ethers.Contract(
        mockContractAddress,
        TIME_LOCKED_WALLET_ABI,
        signer
      )
      setContract(contractInstance)
      
      // Store deployment data in localStorage for persistence
      localStorage.setItem('contractAddress', mockContractAddress)
      localStorage.setItem('unlockTimestamp', unlockTimestamp.toString())
      localStorage.setItem('contractBalance', '0')
      localStorage.setItem('whitelist', '[]')
      
      // Add to deployed contracts list
      const deployedContracts = JSON.parse(localStorage.getItem('deployedContracts') || '[]')
      const newContract = {
        address: mockContractAddress,
        unlockTimestamp: unlockTimestamp,
        balance: '0',
        deployedAt: Math.floor(Date.now() / 1000),
        owner: account
      }
      deployedContracts.push(newContract)
      localStorage.setItem('deployedContracts', JSON.stringify(deployedContracts))
      
      return mockContractAddress
    } catch (err) {
      setError('Failed to deploy contract')
      console.error(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Connect to existing contract
  const connectToContract = async (address) => {
    try {
      setLoading(true)
      setError('')
      
      if (!signer) {
        throw new Error('Wallet not connected')
      }

      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      const contractInstance = new ethers.Contract(
        address,
        TIME_LOCKED_WALLET_ABI,
        signer
      )
      
      setContract(contractInstance)
      setContractAddress(address)
      
      // Store in localStorage
      localStorage.setItem('contractAddress', address)
      
    } catch (err) {
      setError('Failed to connect to contract')
      console.error(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Deposit funds
  const depositFunds = async (amount) => {
    try {
      setLoading(true)
      setError('')
      
      if (!contract) {
        throw new Error('Contract not connected')
      }

      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Update balance in localStorage
      const currentBalance = parseFloat(localStorage.getItem('contractBalance') || '0')
      const newBalance = currentBalance + parseFloat(amount)
      localStorage.setItem('contractBalance', newBalance.toString())
      
      // Update deployed contracts list
      const deployedContracts = JSON.parse(localStorage.getItem('deployedContracts') || '[]')
      const contractIndex = deployedContracts.findIndex(c => c.address === contractAddress)
      if (contractIndex !== -1) {
        deployedContracts[contractIndex].balance = newBalance.toString()
        localStorage.setItem('deployedContracts', JSON.stringify(deployedContracts))
      }
      
      console.log(`Deposited ${amount} ETH to contract ${contractAddress}`)
      
      return { hash: '0x' + Math.random().toString(16).substr(2, 64) }
    } catch (err) {
      setError('Failed to deposit funds')
      console.error(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Withdraw funds
  const withdrawFunds = async () => {
    try {
      setLoading(true)
      setError('')
      
      if (!contract) {
        throw new Error('Contract not connected')
      }

      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Reset balance in localStorage
      localStorage.setItem('contractBalance', '0')
      
      // Update deployed contracts list
      const deployedContracts = JSON.parse(localStorage.getItem('deployedContracts') || '[]')
      const contractIndex = deployedContracts.findIndex(c => c.address === contractAddress)
      if (contractIndex !== -1) {
        deployedContracts[contractIndex].balance = '0'
        localStorage.setItem('deployedContracts', JSON.stringify(deployedContracts))
      }
      
      console.log('Withdrew all funds from contract')
      
      return { hash: '0x' + Math.random().toString(16).substr(2, 64) }
    } catch (err) {
      setError('Failed to withdraw funds')
      console.error(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Extend unlock time
  const extendUnlockTime = async (newTimestamp) => {
    try {
      setLoading(true)
      setError('')
      
      if (!contract) {
        throw new Error('Contract not connected')
      }

      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Update timestamp in localStorage
      localStorage.setItem('unlockTimestamp', newTimestamp.toString())
      
      console.log(`Extended unlock time to ${newTimestamp}`)
      
      return { hash: '0x' + Math.random().toString(16).substr(2, 64) }
    } catch (err) {
      setError('Failed to extend unlock time')
      console.error(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Add to whitelist
  const addToWhitelist = async (address) => {
    try {
      setLoading(true)
      setError('')
      
      if (!contract) {
        throw new Error('Contract not connected')
      }

      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Store in localStorage
      const currentWhitelist = JSON.parse(localStorage.getItem('whitelist') || '[]')
      if (!currentWhitelist.includes(address)) {
        currentWhitelist.push(address)
        localStorage.setItem('whitelist', JSON.stringify(currentWhitelist))
      }
      
      console.log(`Added ${address} to whitelist`)
      
      return { hash: '0x' + Math.random().toString(16).substr(2, 64) }
    } catch (err) {
      setError('Failed to add to whitelist')
      console.error(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Get contract balance
  const getContractBalance = async () => {
    try {
      if (!contractAddress) {
        return '0'
      }

      // Get balance from localStorage
      const balance = localStorage.getItem('contractBalance') || '0'
      return balance
      
    } catch (err) {
      console.error('Failed to get contract balance:', err)
      return '0'
    }
  }

  // Get unlock timestamp
  const getUnlockTimestamp = async () => {
    try {
      if (!contractAddress) {
        return null
      }

      // Get timestamp from localStorage
      const timestamp = localStorage.getItem('unlockTimestamp')
      return timestamp ? parseInt(timestamp) : null
      
    } catch (err) {
      console.error('Failed to get unlock timestamp:', err)
      return null
    }
  }

  // Check if address is whitelisted
  const isWhitelisted = async (address) => {
    try {
      if (!contract) {
        return false
      }

      // Get whitelist from localStorage
      const whitelist = JSON.parse(localStorage.getItem('whitelist') || '[]')
      return whitelist.includes(address)
      
    } catch (err) {
      console.error('Failed to check whitelist status:', err)
      return false
    }
  }

  // Load contract data from localStorage on mount
  useEffect(() => {
    const savedContractAddress = localStorage.getItem('contractAddress')
    if (savedContractAddress && signer) {
      setContractAddress(savedContractAddress)
      const contractInstance = new ethers.Contract(
        savedContractAddress,
        TIME_LOCKED_WALLET_ABI,
        signer
      )
      setContract(contractInstance)
    }
  }, [signer])

  // Select a different contract
  const selectContract = async (address) => {
    try {
      setLoading(true)
      setError('')
      
      if (!signer) {
        throw new Error('Wallet not connected')
      }

      // Find contract data in deployed contracts
      const deployedContracts = JSON.parse(localStorage.getItem('deployedContracts') || '[]')
      const contractData = deployedContracts.find(c => c.address === address)
      
      if (!contractData) {
        throw new Error('Contract not found')
      }

      const contractInstance = new ethers.Contract(
        address,
        TIME_LOCKED_WALLET_ABI,
        signer
      )
      
      setContract(contractInstance)
      setContractAddress(address)
      
      // Update localStorage to current contract
      localStorage.setItem('contractAddress', address)
      localStorage.setItem('unlockTimestamp', contractData.unlockTimestamp.toString())
      localStorage.setItem('contractBalance', contractData.balance || '0')
      
      // Load whitelist for this contract (each contract has its own whitelist)
      const contractWhitelist = localStorage.getItem(`whitelist_${address}`) || '[]'
      localStorage.setItem('whitelist', contractWhitelist)
      
    } catch (err) {
      setError('Failed to select contract')
      console.error(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Delete contract
  const deleteContract = () => {
    setContract(null)
    setContractAddress('')
    setError('')
  }

  // Use wallet error if no local error
  const finalError = error || walletError
  const finalLoading = loading || walletLoading

  return {
    provider,
    signer,
    account,
    isConnected,
    contract,
    contractAddress,
    loading: finalLoading,
    error: finalError,
    connectWallet,
    connectWalletConnectProvider,
    disconnectWallet,
    deployContract,
    connectToContract,
    depositFunds,
    withdrawFunds,
    extendUnlockTime,
    addToWhitelist,
    getContractBalance,
    getUnlockTimestamp,
    isWhitelisted
  }
}

