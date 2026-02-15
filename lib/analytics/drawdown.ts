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

  // Check final drawdown - guard against non-positive peak values
  if (currentPeakValue <= 0) return null
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

  // Guard against non-positive peak values
  if (peakValue <= 0) return null

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
 * Market regime definition for portfolio simulation
 * Each regime has a direction bias and magnitude range
 */
interface MarketRegime {
  days: number
  bias: number    // positive = uptrend, negative = downtrend
  magnitude: number // base magnitude of daily moves
  noise: number   // additional noise multiplier
}

/**
 * Generate 365 days of realistic portfolio data with multiple drawdown cycles
 * Creates a time series that looks like real trading performance
 * Uses seeded random for SSR/client consistency
 */
export function generatePortfolioData(): PortfolioDataPoint[] {
  const data: PortfolioDataPoint[] = []
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 365)

  // Define market regimes across a full year — creates ~7 recovery periods
  const regimes: MarketRegime[] = [
    // Q1: Strong start then first correction
    { days: 25, bias: 1, magnitude: 0.012, noise: 0.008 },   // Uptrend
    { days: 12, bias: -1, magnitude: 0.015, noise: 0.006 },   // Drawdown 1 (moderate)
    { days: 18, bias: 1, magnitude: 0.010, noise: 0.007 },    // Recovery

    // Q2: Volatile period with sharp drawdown
    { days: 15, bias: 1, magnitude: 0.008, noise: 0.010 },    // Choppy uptrend
    { days: 8, bias: -1, magnitude: 0.020, noise: 0.005 },    // Drawdown 2 (sharp, short)
    { days: 10, bias: 1, magnitude: 0.015, noise: 0.006 },    // Fast recovery
    { days: 20, bias: 1, magnitude: 0.006, noise: 0.009 },    // Slow grind up

    // Q3: Extended drawdown with slow recovery
    { days: 10, bias: -1, magnitude: 0.008, noise: 0.006 },   // Drawdown 3 (gradual)
    { days: 12, bias: -1, magnitude: 0.012, noise: 0.004 },   // Drawdown deepens
    { days: 25, bias: 1, magnitude: 0.008, noise: 0.007 },    // Slow recovery
    { days: 15, bias: 1, magnitude: 0.010, noise: 0.005 },    // Push to new highs

    // Q3-Q4: Another cycle
    { days: 6, bias: -1, magnitude: 0.025, noise: 0.008 },    // Drawdown 4 (flash crash)
    { days: 14, bias: 1, magnitude: 0.012, noise: 0.006 },    // Recovery
    { days: 20, bias: 1, magnitude: 0.007, noise: 0.008 },    // Steady climb

    // Q4: Year-end volatility
    { days: 15, bias: -1, magnitude: 0.010, noise: 0.007 },   // Drawdown 5 (moderate)
    { days: 20, bias: 1, magnitude: 0.009, noise: 0.006 },    // Recovery to highs
    { days: 10, bias: -1, magnitude: 0.006, noise: 0.005 },   // Drawdown 6 (shallow)
    { days: 12, bias: 1, magnitude: 0.011, noise: 0.006 },    // Recovery

    // Final: current mild drawdown (unrecovered)
    { days: 20, bias: 1, magnitude: 0.005, noise: 0.007 },    // Flat/up
    { days: 10, bias: -1, magnitude: 0.007, noise: 0.004 },   // Drawdown 7 (active)
  ]

  let currentValue = 40000
  let peakValue = currentValue
  let seed = 12345
  let dayIndex = 0

  for (const regime of regimes) {
    for (let d = 0; d < regime.days && dayIndex < 365; d++) {
      const date = new Date(startDate)
      date.setDate(date.getDate() + dayIndex)

      const baseMove = regime.bias * (regime.magnitude * (0.3 + seededRandom(seed++) * 0.7))
      const noise = (seededRandom(seed++) - 0.5) * regime.noise
      const dailyChange = currentValue * (baseMove + noise)

      currentValue += dailyChange
      currentValue = Math.max(currentValue, 10000)

      if (currentValue > peakValue) {
        peakValue = currentValue
      }

      data.push({
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        value: Math.round(currentValue * 100) / 100,
        timestamp: date.getTime(),
      })

      dayIndex++
    }
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

export interface RecoveryPeriod {
  peakDate: string
  troughDate: string
  recoveryDate: string | null
  depth: number
  drawdownDuration: number
  recoveryDuration: number | null
  totalDuration: number | null
  recovered: boolean
}

/**
 * Calculate recovery periods from portfolio data
 * Tracks how long it takes to recover from each drawdown
 */
export function calculateRecoveryPeriods(
  data: PortfolioDataPoint[]
): RecoveryPeriod[] {
  if (data.length < 2) return []

  const periods: RecoveryPeriod[] = []
  let peakValue = data[0].value
  let peakDate = data[0].date
  let peakTimestamp = data[0].timestamp
  let troughValue = data[0].value
  let troughDate = data[0].date
  let troughTimestamp = data[0].timestamp
  let inDrawdown = false

  for (let i = 1; i < data.length; i++) {
    const point = data[i]

    if (point.value >= peakValue) {
      if (inDrawdown && troughValue < peakValue) {
        const depth =
          Math.round(
            ((peakValue - troughValue) / peakValue) * 10000
          ) / 100
        const drawdownDays = Math.ceil(
          (troughTimestamp - peakTimestamp) / (1000 * 60 * 60 * 24)
        )
        const recoveryDays = Math.ceil(
          (point.timestamp - troughTimestamp) / (1000 * 60 * 60 * 24)
        )

        periods.push({
          peakDate,
          troughDate,
          recoveryDate: point.date,
          depth,
          drawdownDuration: Math.max(0, drawdownDays),
          recoveryDuration: Math.max(0, recoveryDays),
          totalDuration: Math.max(0, drawdownDays + recoveryDays),
          recovered: true,
        })
      }

      peakValue = point.value
      peakDate = point.date
      peakTimestamp = point.timestamp
      troughValue = point.value
      troughDate = point.date
      troughTimestamp = point.timestamp
      inDrawdown = false
    } else if (point.value < troughValue) {
      troughValue = point.value
      troughDate = point.date
      troughTimestamp = point.timestamp
      inDrawdown = true
    }
  }

  // Include current unrecovered drawdown
  if (inDrawdown && troughValue < peakValue) {
    const depth =
      Math.round(((peakValue - troughValue) / peakValue) * 10000) / 100
    const drawdownDays = Math.ceil(
      (troughTimestamp - peakTimestamp) / (1000 * 60 * 60 * 24)
    )

    periods.push({
      peakDate,
      troughDate,
      recoveryDate: null,
      depth,
      drawdownDuration: Math.max(0, drawdownDays),
      recoveryDuration: null,
      totalDuration: null,
      recovered: false,
    })
  }

  // Sort by deepest drawdown first
  return periods.sort((a, b) => b.depth - a.depth)
}
