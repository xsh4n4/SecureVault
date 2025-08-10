
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { 
  Clock, 
  Shield, 
  Wallet, 
  Users, 
  Calendar, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle,
  Lock,
  Unlock,
  Plus,
  Send,
  Loader2
} from 'lucide-react'
import { useWeb3 } from './hooks/useWeb3'
import { WalletConnection } from './components/WalletConnection'
import { ContractDeployment } from './components/ContractDeployment'
import { TimeSelector } from './components/TimeSelector'
import './App.css'

function App() {
  const {
    account,
    isConnected,
    contractAddress,
    loading,
    error,
    connectWallet,
    connectWalletConnectProvider,
    disconnectWallet,
    deployContract,
    connectToContract,
    depositFunds,
    withdrawFunds,
    extendUnlockTime,
    addToWhitelist: addToWhitelistWeb3,
    getContractBalance,
    getUnlockTimestamp
  } = useWeb3()

  const [walletBalance, setWalletBalance] = useState('0')
  const [unlockTime, setUnlockTime] = useState('')
  const [timeRemaining, setTimeRemaining] = useState('')
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [whitelistedAddresses, setWhitelistedAddresses] = useState([])
  const [newAddress, setNewAddress] = useState('')
  const [depositAmount, setDepositAmount] = useState('')
  const [extendTimestamp, setExtendTimestamp] = useState(null)
  const [transactionLoading, setTransactionLoading] = useState(false)

  // Update contract data when contract is connected
  useEffect(() => {
    if (contractAddress) {
      updateContractData()
    }
  }, [contractAddress])

  const updateContractData = async () => {
    try {
      const balance = await getContractBalance()
      setWalletBalance(balance)

      const timestamp = await getUnlockTimestamp()
      if (timestamp) {
        const unlockDate = new Date(timestamp * 1000)
        setUnlockTime(unlockDate.toISOString())
      }

      // Get whitelist from localStorage
      const whitelist = JSON.parse(localStorage.getItem('whitelist') || '[]')
      setWhitelistedAddresses(whitelist)
    } catch (err) {
      console.error('Failed to update contract data:', err)
    }
  }

  // Update time remaining every second
  useEffect(() => {
    if (!unlockTime) return

    const interval = setInterval(() => {
      const now = new Date()
      const unlock = new Date(unlockTime)
      const diff = unlock - now
      
      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)
        setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`)
        setIsUnlocked(false)
      } else {
        setTimeRemaining('Unlocked!')
        setIsUnlocked(true)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [unlockTime])

  const handleDeposit = async () => {
    if (!depositAmount || !contractAddress) return
    
    try {
      setTransactionLoading(true)
      await depositFunds(depositAmount)
      setDepositAmount('')
      await updateContractData()
    } catch (err) {
      console.error('Deposit failed:', err)
    } finally {
      setTransactionLoading(false)
    }
  }

  const handleWithdraw = async () => {
    if (!contractAddress) return
    
    try {
      setTransactionLoading(true)
      await withdrawFunds()
      await updateContractData()
    } catch (err) {
      console.error('Withdrawal failed:', err)
    } finally {
      setTransactionLoading(false)
    }
  }

  const handleExtendTime = async () => {
    if (!extendTimestamp || !contractAddress) return
    
    try {
      setTransactionLoading(true)
      await extendUnlockTime(extendTimestamp)
      setExtendTimestamp(null)
      await updateContractData()
    } catch (err) {
      console.error('Extend time failed:', err)
    } finally {
      setTransactionLoading(false)
    }
  }

  const handleAddToWhitelist = async () => {
    if (!newAddress || !contractAddress) return
    
    try {
      setTransactionLoading(true)
      await addToWhitelistWeb3(newAddress)
      setNewAddress('')
      // Refresh the whitelist display
      const whitelist = JSON.parse(localStorage.getItem('whitelist') || '[]')
      setWhitelistedAddresses(whitelist)
    } catch (err) {
      console.error('Add to whitelist failed:', err)
    } finally {
      setTransactionLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="mr-3"
            >
              <Shield className="w-12 h-12 text-purple-400" />
            </motion.div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              SecureVault
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Secure your cryptocurrency with time-based access control and multi-signature functionality
          </p>
        </motion.header>

        {/* Wallet Connection */}
        <WalletConnection
          isConnected={isConnected}
          account={account}
          loading={loading}
          error={error}
          onConnect={connectWallet}
          onConnectWalletConnect={connectWalletConnectProvider}
          onDisconnect={disconnectWallet}
        />

        {/* Contract Deployment */}
        <ContractDeployment
          isConnected={isConnected}
          contractAddress={contractAddress}
          loading={loading}
          onDeploy={deployContract}
          onConnect={connectToContract}
        />

        {/* Main Interface - Only show when contract is connected */}
        {contractAddress && (
          <>
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Wallet Status */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white">
                      <Clock className="w-6 h-6 mr-2 text-purple-400" />
                      Wallet Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Balance */}
                    <div className="text-center">
                      <p className="text-gray-400 mb-2">Current Balance</p>
                      <p className="text-4xl font-bold text-white">{walletBalance} ETH</p>
                    </div>

                    <Separator className="bg-white/20" />

                    {/* Lock Status */}
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-4">
                        {isUnlocked ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex items-center text-green-400"
                          >
                            <Unlock className="w-8 h-8 mr-2" />
                            <span className="text-xl font-semibold">Unlocked</span>
                          </motion.div>
                        ) : (
                          <motion.div
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="flex items-center text-orange-400"
                          >
                            <Lock className="w-8 h-8 mr-2" />
                            <span className="text-xl font-semibold">Locked</span>
                          </motion.div>
                        )}
                      </div>
                      
                      <div className="bg-black/30 rounded-lg p-4">
                        <p className="text-gray-400 mb-1">Time Remaining</p>
                        <p className="text-2xl font-mono text-white">{timeRemaining}</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <Button 
                        onClick={handleWithdraw}
                        disabled={!isUnlocked || transactionLoading}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transform hover:scale-105 transition-all duration-200"
                      >
                        {transactionLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Withdraw Funds
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Management Panel */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-6"
              >
                {/* Deposit Funds */}
                <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white">
                      <Wallet className="w-6 h-6 mr-2 text-green-400" />
                      Deposit Funds
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Add ETH to your time-locked wallet
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="deposit" className="text-gray-300">Amount (ETH)</Label>
                      <Input
                        id="deposit"
                        type="number"
                        placeholder="0.0"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        className="bg-black/30 border-white/20 text-white placeholder-gray-500"
                      />
                    </div>
                    <Button 
                      onClick={handleDeposit}
                      disabled={!depositAmount || transactionLoading}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                    >
                      {transactionLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Depositing...
                        </>
                      ) : (
                        'Deposit ETH'
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {/* Extend Lock Time */}
                <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white">
                      <Calendar className="w-6 h-6 mr-2 text-blue-400" />
                      Extend Lock Time
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Extend the unlock timestamp (Owner only)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <TimeSelector 
                      onTimeChange={setExtendTimestamp}
                      value={extendTimestamp}
                    />
                    <Button 
                      onClick={handleExtendTime}
                      disabled={!extendTimestamp || transactionLoading}
                      className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                    >
                      {transactionLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Extending...
                        </>
                      ) : (
                        'Extend Lock Time'
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Whitelist Management */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-8"
            >
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Users className="w-6 h-6 mr-2 text-purple-400" />
                    Whitelisted Addresses
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Manage addresses that can withdraw funds (Owner only)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Add New Address */}
                  <div className="flex space-x-3">
                    <Input
                      placeholder="0x..."
                      value={newAddress}
                      onChange={(e) => setNewAddress(e.target.value)}
                      className="bg-black/30 border-white/20 text-white placeholder-gray-500"
                    />
                    <Button 
                      onClick={handleAddToWhitelist}
                      disabled={!newAddress || transactionLoading}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      {transactionLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          Add
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Address List */}
                  <div className="space-y-3">
                    <AnimatePresence>
                      {whitelistedAddresses.map((address, index) => (
                        <motion.div
                          key={address}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between bg-black/30 rounded-lg p-4 hover:bg-black/40 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                            <span className="text-white font-mono">{address}</span>
                          </div>
                          <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                            Whitelisted
                          </Badge>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12 text-gray-400"
        >
          <p>Built with Solidity ^0.8.0 • Secured by blockchain technology</p>
        </motion.footer>
      </div>
    </div>
  )
}

export default App

