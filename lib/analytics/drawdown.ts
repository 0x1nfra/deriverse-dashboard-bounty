// Drawdown calculation utilities for portfolio analytics

export interface PortfolioDataPoint {
  date: string
  value: number
  timestamp: number
}

export interface DrawdownPeriod {
  startDate: string
  endDate: string
  startValue: number
  endValue: number
  peakValue: number
  troughValue: number
  drawdownPercentage: number
  durationDays: number
}

export interface MaxDrawdownResult {
  percentage: number
  peakDate: string
  troughDate: string
  peakValue: number
  troughValue: number
  durationDays: number
}

export interface CurrentDrawdownResult {
  percentage: number
  peakDate: string
  peakValue: number
  currentValue: number
  daysInDrawdown: number
}

/**
 * Calculate the maximum drawdown from a series of portfolio values
 * Returns the peak-to-trough percentage, dates, and duration
 */
export function calculateMaxDrawdown(data: PortfolioDataPoint[]): MaxDrawdownResult | null {
  if (data.length < 2) return null

  let maxDrawdown = 0
  let peakValue = data[0].value
  let peakDate = data[0].date
  let troughValue = data[0].value
  let troughDate = data[0].date
  let currentPeakValue = data[0].value
  let currentPeakDate = data[0].date
  let currentPeakTimestamp = data[0].timestamp
  let currentTroughTimestamp = data[0].timestamp
  let maxTroughValue = data[0].value
  let maxTroughDate = data[0].date
  let maxTroughTimestamp = data[0].timestamp

  for (const point of data) {
    if (point.value > currentPeakValue) {
      // New peak reached, check if we were in a drawdown
      if (currentPeakValue > 0) {
        const drawdown = (currentPeakValue - troughValue) / currentPeakValue
        if (drawdown > maxDrawdown) {
          maxDrawdown = drawdown
          peakValue = currentPeakValue
          peakDate = currentPeakDate
          maxTroughValue = troughValue
          maxTroughDate = troughDate
          maxTroughTimestamp = currentTroughTimestamp
        }
      }
      // Reset for new peak
      currentPeakValue = point.value
      currentPeakDate = point.date
      currentPeakTimestamp = point.timestamp
      troughValue = point.value
      troughDate = point.date
      currentTroughTimestamp = point.timestamp
    } else if (point.value < troughValue) {
      // New trough
      troughValue = point.value
      troughDate = point.date
      currentTroughTimestamp = point.timestamp
    }
  }

  // Check final drawdown
  const finalDrawdown = (currentPeakValue - troughValue) / currentPeakValue
  if (finalDrawdown > maxDrawdown) {
    maxDrawdown = finalDrawdown
    peakValue = currentPeakValue
    peakDate = currentPeakDate
    maxTroughValue = troughValue
    maxTroughDate = troughDate
    maxTroughTimestamp = currentTroughTimestamp
  }

  if (maxDrawdown === 0) return null

  const durationDays = Math.ceil(
    (maxTroughTimestamp - new Date(peakDate).getTime()) / (1000 * 60 * 60 * 24)
  )

  return {
    percentage: Math.round(maxDrawdown * 10000) / 100,
    peakDate,
    troughDate: maxTroughDate,
    peakValue,
    troughValue: maxTroughValue,
    durationDays: Math.max(0, durationDays),
  }
}

/**
 * Get all drawdown periods from portfolio data
 * Returns array of drawdown periods with details
 */
export function getDrawdownPeriods(data: PortfolioDataPoint[]): DrawdownPeriod[] {
  if (data.length < 2) return []

  const periods: DrawdownPeriod[] = []
  let peakValue = data[0].value
  let peakDate = data[0].date
  let peakTimestamp = data[0].timestamp
  let troughValue = data[0].value
  let troughDate = data[0].date
  let troughTimestamp = data[0].timestamp
  let inDrawdown = false

  for (let i = 1; i < data.length; i++) {
    const point = data[i]

    if (point.value > peakValue) {
      // New peak - if we were in a drawdown, close it
      if (inDrawdown && troughValue < peakValue) {
        const drawdownPercentage = ((peakValue - troughValue) / peakValue) * 100
        const durationDays = Math.ceil(
          (troughTimestamp - peakTimestamp) / (1000 * 60 * 60 * 24)
        )

        periods.push({
          startDate: peakDate,
          endDate: troughDate,
          startValue: peakValue,
          endValue: troughValue,
          peakValue,
          troughValue,
          drawdownPercentage: Math.round(drawdownPercentage * 100) / 100,
          durationDays: Math.max(0, durationDays),
        })
      }

      // Reset for new peak
      peakValue = point.value
      peakDate = point.date
      peakTimestamp = point.timestamp
      troughValue = point.value
      troughDate = point.date
      troughTimestamp = point.timestamp
      inDrawdown = false
    } else if (point.value < troughValue) {
      // New trough - we're in a drawdown
      troughValue = point.value
      troughDate = point.date
      troughTimestamp = point.timestamp
      inDrawdown = true
    }
  }

  // Don't include current drawdown if we're still in one
  return periods
}

/**
 * Calculate current drawdown if portfolio is below peak
 * Returns null if at new peak
 */
export function calculateCurrentDrawdown(data: PortfolioDataPoint[]): CurrentDrawdownResult | null {
  if (data.length < 2) return null

  const currentPoint = data[data.length - 1]
  let peakValue = data[0].value
  let peakDate = data[0].date
  let peakTimestamp = data[0].timestamp

  // Find the most recent peak
  for (const point of data) {
    if (point.value > peakValue) {
      peakValue = point.value
      peakDate = point.date
      peakTimestamp = point.timestamp
    }
  }

  // If current value is at or above peak, no drawdown
  if (currentPoint.value >= peakValue) return null

  const drawdownPercentage = ((peakValue - currentPoint.value) / peakValue) * 100
  const daysInDrawdown = Math.ceil(
    (currentPoint.timestamp - peakTimestamp) / (1000 * 60 * 60 * 24)
  )

  return {
    percentage: Math.round(drawdownPercentage * 100) / 100,
    peakDate,
    peakValue,
    currentValue: currentPoint.value,
    daysInDrawdown: Math.max(0, daysInDrawdown),
  }
}

/**
 * Seeded random number generator for deterministic data
 * This ensures server and client render the same data
 */
function seededRandom(seed: number): number {
  const x = Math.sin(seed++) * 10000
  return x - Math.floor(x)
}

/**
 * Generate 90 days of realistic portfolio data with drawdowns
 * Creates a time series that looks like real trading performance
 * Uses seeded random for SSR/client consistency
 */
export function generatePortfolioData(): PortfolioDataPoint[] {
  const data: PortfolioDataPoint[] = []
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 90)

  // Start with base value
  let currentValue = 40000
  let peakValue = currentValue
  let seed = 12345 // Fixed seed for deterministic generation

  // Generate 90 days of data
  for (let i = 0; i < 90; i++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)

    // Simulate realistic price movements
    // Mix of trends: uptrend, downtrend (drawdown), sideways
    const dayOfPeriod = i
    let dailyChange: number

    if (dayOfPeriod < 20) {
      // Initial uptrend: +0.5% to +2% per day
      dailyChange = currentValue * (0.005 + seededRandom(seed++) * 0.015)
    } else if (dayOfPeriod < 35) {
      // First drawdown: -0.5% to -2% per day
      dailyChange = -currentValue * (0.005 + seededRandom(seed++) * 0.015)
    } else if (dayOfPeriod < 50) {
      // Recovery: +0.3% to +1.5% per day
      dailyChange = currentValue * (0.003 + seededRandom(seed++) * 0.012)
    } else if (dayOfPeriod < 65) {
      // Second drawdown (deeper): -0.8% to -2.5% per day
      dailyChange = -currentValue * (0.008 + seededRandom(seed++) * 0.017)
    } else if (dayOfPeriod < 80) {
      // Recovery to new highs: +0.5% to +2% per day
      dailyChange = currentValue * (0.005 + seededRandom(seed++) * 0.015)
    } else {
      // Current drawdown (shallow): -0.3% to -1% per day
      dailyChange = -currentValue * (0.003 + seededRandom(seed++) * 0.007)
    }

    // Add some randomness (noise)
    dailyChange += currentValue * (seededRandom(seed++) - 0.5) * 0.01

    currentValue += dailyChange
    currentValue = Math.max(currentValue, 10000) // Floor at $10k

    // Track peak
    if (currentValue > peakValue) {
      peakValue = currentValue
    }

    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: Math.round(currentValue * 100) / 100,
      timestamp: date.getTime(),
    })
  }

  return data
}

/**
 * Calculate running drawdown for each data point
 * Returns array of drawdown percentages for chart overlay
 */
export function calculateRunningDrawdown(data: PortfolioDataPoint[]): number[] {
  const drawdowns: number[] = []
  let peakValue = data[0]?.value || 0

  for (const point of data) {
    if (point.value > peakValue) {
      peakValue = point.value
      drawdowns.push(0)
    } else {
      const drawdown = ((peakValue - point.value) / peakValue) * 100
      drawdowns.push(Math.round(drawdown * 100) / 100)
    }
  }

  return drawdowns
}

/**
 * Format drawdown percentage for display
 */
export function formatDrawdown(percentage: number): string {
  return `-${percentage.toFixed(2)}%`
}
