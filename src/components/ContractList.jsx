import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  Trash2, 
  ExternalLink, 
  Copy, 
  Clock,
  Wallet,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

export const ContractList = ({ 
  currentContractAddress,
  onSelectContract,
  onDeleteContract
}) => {
  const [contracts, setContracts] = useState([])

  // Load contracts from localStorage
  useEffect(() => {
    const savedContracts = JSON.parse(localStorage.getItem('deployedContracts') || '[]')
    setContracts(savedContracts)
  }, [currentContractAddress])

  const formatAddress = (address) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown'
    return new Date(timestamp * 1000).toLocaleString()
  }

  const getTimeRemaining = (timestamp) => {
    if (!timestamp) return 'Unknown'
    
    const now = new Date()
    const unlock = new Date(timestamp * 1000)
    const diff = unlock - now
    
    if (diff > 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      return `${hours}h ${minutes}m`
    } else {
      return 'Unlocked'
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  const handleDelete = (address) => {
    const updatedContracts = contracts.filter(contract => contract.address !== address)
    setContracts(updatedContracts)
    localStorage.setItem('deployedContracts', JSON.stringify(updatedContracts))
    
    // If deleting the current contract, clear it
    if (address === currentContractAddress) {
      localStorage.removeItem('contractAddress')
      localStorage.removeItem('unlockTimestamp')
      localStorage.removeItem('contractBalance')
      localStorage.removeItem('whitelist')
      onDeleteContract()
    }
  }

  if (contracts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardContent className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <Wallet className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No contracts deployed yet</p>
              <p className="text-sm">Deploy your first time-locked wallet to get started</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <Card className="bg-white/10 backdrop-blur-lg border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Wallet className="w-6 h-6 mr-2 text-purple-400" />
            Your Contracts ({contracts.length})
          </CardTitle>
          <CardDescription className="text-gray-400">
            Manage your deployed time-locked wallet contracts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {contracts.map((contract, index) => (
            <motion.div
              key={contract.address}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border transition-all duration-200 ${
                contract.address === currentContractAddress
                  ? 'bg-purple-500/20 border-purple-500/50'
                  : 'bg-black/30 border-white/20 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <p className="text-white font-mono text-sm">
                      {formatAddress(contract.address)}
                    </p>
                    {contract.address === currentContractAddress && (
                      <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Balance</p>
                      <p className="text-white">{contract.balance || '0'} ETH</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Unlock Time</p>
                      <p className="text-white">{getTimeRemaining(contract.unlockTimestamp)}</p>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <p className="text-gray-500 text-xs">
                      Created: {formatDate(contract.deployedAt)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(contract.address)}
                    className="border-gray-500/50 text-gray-400 hover:bg-gray-500/20"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                  
                  {contract.address !== currentContractAddress && (
                    <Button
                      size="sm"
                      onClick={() => onSelectContract(contract.address)}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      Select
                    </Button>
                  )}
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(contract.address)}
                    className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  )
}

