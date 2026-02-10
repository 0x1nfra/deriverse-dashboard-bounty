"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";

// Sub-tab content components
import { TradingTabContent } from "@/components/portfolio/tabs/trading-tab";
import { AnalyticsTabContent } from "@/components/portfolio/tabs/analytics-tab";
import { JournalTabContent } from "@/components/portfolio/tabs/journal-tab";
import { VolumeFeesTabContent } from "@/components/portfolio/tabs/volume-fees-tab";
import { RiskTabContent } from "@/components/portfolio/tabs/risk-tab";
import { PersistentSummaryCard } from "@/components/portfolio/persistent-summary-card";
import { OpenPositionsTable } from "@/components/dashboard/open-positions-table";
import { OpenOrdersTabContent } from "@/components/portfolio/tabs/open-orders-tab";

// Filter components
import { FilterProvider } from "@/components/providers/filter-provider";
import { GlobalFilterBar } from "@/components/filters/global-filter-bar";

// Sub-tabs configuration
const subTabs = [
  { id: "positions", label: "Positions" },
  { id: "open-orders", label: "Open Orders" },
  { id: "history", label: "History" },
  { id: "analytics", label: "Analytics" },
  { id: "journal", label: "Journal" },
  { id: "volume-fees", label: "Volume & Fees" },
  { id: "risk", label: "Risk" },
];

export default function PortfolioDashboard() {
  const [activeTab, setActiveTab] = useState("history");

  const renderTabContent = () => {
    switch (activeTab) {
      case "positions":
        return <OpenPositionsTable />;
      case "open-orders":
        return <OpenOrdersTabContent />;
      case "history":
        return <TradingTabContent />;
      case "analytics":
        return <AnalyticsTabContent />;
      case "journal":
        return <JournalTabContent />;
      case "volume-fees":
        return <VolumeFeesTabContent />;
      case "risk":
        return <RiskTabContent />;
      default:
        return <OpenPositionsTable />;
    }
  };

  return (
    <FilterProvider>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Page Header with Title and Actions */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
              Portfolio
            </h1>
            {/* <p className="text-muted-foreground mt-1 text-sm sm:text-base">Manage and track your trading portfolio</p> */}
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="outline"
              size="sm"
              aria-label="Withdraw"
              className="gap-2 bg-transparent sm:size-default"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Withdraw</span>
            </Button>
            <Button
              size="sm"
              aria-label="Deposit"
              className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground sm:size-default"
            >
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Deposit</span>
            </Button>
          </div>
        </div>

        {/* Persistent Summary Card */}
        <PersistentSummaryCard />

        {/* Global Filter Bar */}
        <GlobalFilterBar />

        {/* Sub-Tab Navigation */}
        <div className="border-b border-border mb-6 overflow-x-auto scrollbar-hide">
          <nav className="flex items-center gap-1 min-w-max">
            {subTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-3 sm:px-4 py-3 text-sm font-medium transition-colors relative whitespace-nowrap",
                  activeTab === tab.id
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Dynamic Tab Content */}
        <div className="min-h-[600px]">{renderTabContent()}</div>
      </div>
    </FilterProvider>
  );
}
