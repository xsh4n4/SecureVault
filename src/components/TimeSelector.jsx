import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Card, CardContent } from '@/components/ui/card.jsx'
import { Clock } from 'lucide-react'

export const TimeSelector = ({ onTimeChange, value }) => {
  const [timeValue, setTimeValue] = useState(1)
  const [timeUnit, setTimeUnit] = useState('minutes')
  const [mode, setMode] = useState('relative') // 'relative' or 'absolute'

  const handleRelativeTimeChange = (newValue, newUnit) => {
    const val = newValue || timeValue
    const unit = newUnit || timeUnit
    
    setTimeValue(val)
    setTimeUnit(unit)
    
    // Calculate timestamp
    const now = new Date()
    let futureTime = new Date(now)
    
    switch (unit) {
      case 'minutes':
        futureTime.setMinutes(now.getMinutes() + parseInt(val))
        break
      case 'hours':
        futureTime.setHours(now.getHours() + parseInt(val))
        break
      case 'days':
        futureTime.setDate(now.getDate() + parseInt(val))
        break
      default:
        break
    }
    
    onTimeChange(Math.floor(futureTime.getTime() / 1000))
  }

  const handleAbsoluteTimeChange = (dateTimeString) => {
    if (dateTimeString) {
      const timestamp = Math.floor(new Date(dateTimeString).getTime() / 1000)
      onTimeChange(timestamp)
    }
  }

  const formatPreview = () => {
    if (mode === 'relative') {
      const now = new Date()
      let futureTime = new Date(now)
      
      switch (timeUnit) {
        case 'minutes':
          futureTime.setMinutes(now.getMinutes() + parseInt(timeValue))
          break
        case 'hours':
          futureTime.setHours(now.getHours() + parseInt(timeValue))
          break
        case 'days':
          futureTime.setDate(now.getDate() + parseInt(timeValue))
          break
        default:
          break
      }
      
      return futureTime.toLocaleString()
    }
    return ''
  }

  return (
    <div className="space-y-4">
      <Label className="text-gray-300 flex items-center">
        <Clock className="w-4 h-4 mr-2" />
        Lock Duration
      </Label>
      
      {/* Mode Selection */}
      <div className="flex space-x-2">
        <Button
          type="button"
          variant={mode === 'relative' ? 'default' : 'outline'}
          onClick={() => setMode('relative')}
          className={mode === 'relative' 
            ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
            : 'border-white/20 text-black'
          }
          size="sm"
        >
          Quick Select
        </Button>
        <Button
          type="button"
          variant={mode === 'absolute' ? 'default' : 'outline'}
          onClick={() => setMode('absolute')}
          className={mode === 'absolute' 
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 ' 
            : 'border-white/20 text-black '
          }
          size="sm"
        >
          Specific Date
        </Button>
      </div>

      {mode === 'relative' ? (
        <div className="space-y-4">
          <div className="flex space-x-2">
            <div className="flex-1">
              <Input
                type="number"
                min="1"
                value={timeValue}
                onChange={(e) => handleRelativeTimeChange(e.target.value, timeUnit)}
                className="bg-black/30 border-white/20 text-white"
                placeholder="Enter duration"
              />
            </div>
            <div className="flex-1">
              <Select value={timeUnit} onValueChange={(value) => handleRelativeTimeChange(timeValue, value)}>
                <SelectTrigger className="bg-black/30 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="minutes" className="text-white hover:bg-gray-700">Minutes</SelectItem>
                  <SelectItem value="hours" className="text-white hover:bg-gray-700">Hours</SelectItem>
                  <SelectItem value="days" className="text-white hover:bg-gray-700">Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Quick preset buttons */}
          <div className="grid grid-cols-3 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleRelativeTimeChange(1, 'minutes')}
              className="border-white/20 text-black hover:bg-white/10 hover:text-black"
              size="sm"
            >
              1 min
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleRelativeTimeChange(5, 'minutes')}
              className="border-white/20 text-black hover:bg-white/10 hover:text-black"
              size="sm"
            >
              5 min
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleRelativeTimeChange(10, 'minutes')}
              className="border-white/20 text-black hover:bg-white/10 hover:text-black"
              size="sm"
            >
              10 min
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleRelativeTimeChange(1, 'hours')}
              className="border-white/20 text-black hover:bg-white/10 hover:text-black"
              size="sm"
            >
              1 hour
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleRelativeTimeChange(24, 'hours')}
              className="border-white/20 text-black hover:bg-white/10 hover:text-black"
              size="sm"
            >
              1 day
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleRelativeTimeChange(7, 'days')}
              className="border-white/20 text-black hover:bg-white/10 hover:text-black"
              size="sm"
            >
              1 week
            </Button>
          </div>
          
          {/* Preview */}
          <Card className="bg-black/30 border-white/20">
            <CardContent className="p-3">
              <p className="text-gray-400 text-sm">Unlock time:</p>
              <p className="text-white font-mono text-sm">{formatPreview()}</p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div>
          <Input
            type="datetime-local"
            onChange={(e) => handleAbsoluteTimeChange(e.target.value)}
            className="bg-black/30 border-white/20 text-white"
            min={new Date().toISOString().slice(0, 16)}
          />
          <p className="text-gray-500 text-sm mt-1">
            Select a specific date and time for unlock
          </p>
        </div>
      )}
    </div>
  )
}

