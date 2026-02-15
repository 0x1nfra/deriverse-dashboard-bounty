import { Trade } from "@/lib/mock/trades"

export interface DayOfWeekPerformance {
  day: number
  dayShort: string
  pnl: number
  winRate: number
  trades: number
  avgPnl: number
}

export interface HourOfDayPerformance {
  hour: number
  hourLabel: string
  pnl: number
  winRate: number
  trades: number
  avgPnl: number
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export function calculateDayOfWeekPerformance(trades: Trade[]): DayOfWeekPerformance[] {
  const days = Array.from({ length: 7 }, (_, i) => ({
    day: i,
    dayShort: DAY_NAMES[i],
    trades: [] as Trade[],
  }))

  for (const trade of trades) {
    const dayOfWeek = trade.timestamp.getDay()
    days[dayOfWeek].trades.push(trade)
  }

  return days.map(({ day, dayShort, trades: dayTrades }) => {
    const pnl = dayTrades.reduce((sum, t) => sum + t.pnl, 0)
    const wins = dayTrades.filter((t) => t.pnl > 0).length
    const winRate = dayTrades.length > 0 ? (wins / dayTrades.length) * 100 : 0
    const avgPnl = dayTrades.length > 0 ? pnl / dayTrades.length : 0

    return { day, dayShort, pnl, winRate, trades: dayTrades.length, avgPnl }
  })
}

export function calculateHourOfDayPerformance(trades: Trade[]): HourOfDayPerformance[] {
  const hours = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    hourLabel: `${i.toString().padStart(2, "0")}:00`,
    trades: [] as Trade[],
  }))

  for (const trade of trades) {
    const hour = trade.timestamp.getHours()
    hours[hour].trades.push(trade)
  }

  return hours.map(({ hour, hourLabel, trades: hourTrades }) => {
    const pnl = hourTrades.reduce((sum, t) => sum + t.pnl, 0)
    const wins = hourTrades.filter((t) => t.pnl > 0).length
    const winRate = hourTrades.length > 0 ? (wins / hourTrades.length) * 100 : 0
    const avgPnl = hourTrades.length > 0 ? pnl / hourTrades.length : 0

    return { hour, hourLabel, pnl, winRate, trades: hourTrades.length, avgPnl }
  })
}
