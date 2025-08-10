import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { TimeSelector } from './TimeSelector.jsx'
import { 
  Rocket, 
  Link, 
  Calendar, 
  Loader2, 
  CheckCircle,
  Copy,
  ExternalLink
} from 'lucide-react'

export const ContractDeployment = ({ 
  isConnected,
  contractAddress,
  loading,
  onDeploy,
  onConnect
}) => {
  const [unlockTimestamp, setUnlockTimestamp] = useState(null)
  const [existingAddress, setExistingAddress] = useState('')
  const [deploymentMode, setDeploymentMode] = useState('deploy') // 'deploy' or 'connect'

  const handleDeploy = async () => {
    if (!unlockTimestamp) return
    
    await onDeploy(unlockTimestamp)
  }

  const handleConnect = async () => {
    if (!existingAddress) return
    await onConnect(existingAddress)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  if (contractAddress) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <CheckCircle className="w-6 h-6 mr-2 text-green-400" />
              Contract Connected
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between bg-black/30 rounded-lg p-4">
              <div>
                <p className="text-gray-400 text-sm">Contract Address</p>
                <p className="text-white font-mono">{contractAddress}</p>
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(contractAddress)}
                  className="border-purple-500/50 text-purple-400 hover:bg-purple-500/20"
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
              Ready to use
            </Badge>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  if (!isConnected) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardContent className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <Rocket className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Connect your wallet to deploy or connect to a Time-Locked Wallet contract</p>
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
            <Rocket className="w-6 h-6 mr-2 text-purple-400" />
            Contract Setup
          </CardTitle>
          <CardDescription className="text-gray-400">
            Deploy a new contract or connect to an existing one
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mode Selection */}
          <div className="flex space-x-2">
            <Button
              variant={deploymentMode === 'deploy' ? 'default' : 'outline'}
              onClick={() => setDeploymentMode('deploy')}
              className={deploymentMode === 'deploy' 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                : 'border-white/20 text-gray-300'
              }
            >
              <Rocket className="w-4 h-4 mr-2" />
              Deploy New
            </Button>
            <Button
              variant={deploymentMode === 'connect' ? 'default' : 'outline'}
              onClick={() => setDeploymentMode('connect')}
              className={deploymentMode === 'connect' 
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500' 
                : 'border-white/20 text-gray-300'
              }
            >
              <Link className="w-4 h-4 mr-2" />
              Connect Existing
            </Button>
          </div>

          <Separator className="bg-white/20" />

          {deploymentMode === 'deploy' ? (
            <div className="space-y-4">
              <TimeSelector 
                onTimeChange={setUnlockTimestamp}
                value={unlockTimestamp}
              />
              
              <Button
                onClick={handleDeploy}
                disabled={!unlockTimestamp || loading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deploying Contract...
                  </>
                ) : (
                  <>
                    <Rocket className="w-4 h-4 mr-2" />
                    Deploy Contract
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="contract-address" className="text-gray-300">
                  Contract Address
                </Label>
                <Input
                  id="contract-address"
                  placeholder="0x..."
                  value={existingAddress}
                  onChange={(e) => setExistingAddress(e.target.value)}
                  className="bg-black/30 border-white/20 text-white placeholder-gray-500"
                />
                <p className="text-gray-500 text-sm mt-1">
                  Enter the address of an existing Time-Locked Wallet contract
                </p>
              </div>
              
              <Button
                onClick={handleConnect}
                disabled={!existingAddress || loading}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Link className="w-4 h-4 mr-2" />
                    Connect to Contract
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

