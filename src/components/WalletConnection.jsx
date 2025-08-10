import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  Wallet, 
  LogOut, 
  AlertCircle, 
  CheckCircle, 
  Loader2,
  Smartphone,
  Chrome
} from 'lucide-react'

export const WalletConnection = ({ 
  isConnected, 
  account, 
  loading, 
  error, 
  onConnect, 
  onConnectWalletConnect,
  onDisconnect 
}) => {
  const formatAddress = (address) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (isConnected && account) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-white">
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 mr-2 text-green-400" />
                Wallet Connected
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onDisconnect}
                className="border-red-500/50 text-red-400 hover:bg-red-500/20"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Disconnect
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between bg-black/30 rounded-lg p-4">
              <div>
                <p className="text-gray-400 text-sm">Connected Account</p>
                <p className="text-white font-mono">{formatAddress(account)}</p>
              </div>
              <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                Connected
              </Badge>
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
            Connect Your Wallet
          </CardTitle>
          <CardDescription className="text-gray-400">
            Choose your preferred wallet to get started with SecureVault
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="flex items-center p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
              <AlertCircle className="w-5 h-5 mr-2 text-red-400" />
              <p className="text-red-400">{error}</p>
            </div>
          )}
          
          <div className="grid gap-3">
            {/* MetaMask Option */}
            <Button
              onClick={onConnect}
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-medium py-6 justify-start"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Chrome className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-semibold">MetaMask</div>
                    <div className="text-sm opacity-80">Connect using browser extension</div>
                  </div>
                </>
              )}
            </Button>

            {/* WalletConnect Option */}
            <Button
              onClick={onConnectWalletConnect}
              disabled={loading}
              variant="outline"
              className="w-full border-blue-500/50 text-blue-400 hover:bg-blue-500/20 font-medium py-6 justify-start"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Smartphone className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-semibold">WalletConnect</div>
                    <div className="text-sm opacity-80">Scan with mobile wallet</div>
                  </div>
                </>
              )}
            </Button>
          </div>

          <div className="text-center">
            <p className="text-gray-500 text-sm">
              New to Ethereum? <a href="https://ethereum.org/wallets/" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">Learn about wallets</a>
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

