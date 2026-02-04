"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function JournalFilters() {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      {/* Date Range */}
      <Select defaultValue="all">
        <SelectTrigger className="w-[140px] bg-card border-border">
          <SelectValue placeholder="Date Range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Time</SelectItem>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="week">This Week</SelectItem>
          <SelectItem value="month">This Month</SelectItem>
          <SelectItem value="year">This Year</SelectItem>
        </SelectContent>
      </Select>

      {/* Asset Filter */}
      <Select defaultValue="all">
        <SelectTrigger className="w-[140px] bg-card border-border">
          <SelectValue placeholder="Asset" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Assets</SelectItem>
          <SelectItem value="btc">BTC-PERP</SelectItem>
          <SelectItem value="eth">ETH-PERP</SelectItem>
          <SelectItem value="sol">SOL-PERP</SelectItem>
          <SelectItem value="xrp">XRP-PERP</SelectItem>
        </SelectContent>
      </Select>

      {/* Direction Filter */}
      <Select defaultValue="all">
        <SelectTrigger className="w-[120px] bg-card border-border">
          <SelectValue placeholder="Direction" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="long">Long</SelectItem>
          <SelectItem value="short">Short</SelectItem>
        </SelectContent>
      </Select>

      {/* Strategy Filter */}
      <Select defaultValue="all">
        <SelectTrigger className="w-[140px] bg-card border-border">
          <SelectValue placeholder="Strategy" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Strategies</SelectItem>
          <SelectItem value="breakout">Breakout</SelectItem>
          <SelectItem value="momentum">Momentum</SelectItem>
          <SelectItem value="scalping">Scalping</SelectItem>
          <SelectItem value="mean-revert">Mean Revert</SelectItem>
        </SelectContent>
      </Select>

      {/* Tags Filter */}
      <Select defaultValue="all">
        <SelectTrigger className="w-[120px] bg-card border-border">
          <SelectValue placeholder="Tags" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Tags</SelectItem>
          <SelectItem value="scalp">Scalp</SelectItem>
          <SelectItem value="breakout">Breakout</SelectItem>
          <SelectItem value="long">Long</SelectItem>
        </SelectContent>
      </Select>

      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search entries..." 
          className="pl-9 bg-card border-border"
        />
      </div>
    </div>
  )
}
