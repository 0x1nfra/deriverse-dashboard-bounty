"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Download, Upload, Plus } from "lucide-react";

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
  { id: "journal", label: "Journal" },
  { id: "analytics", label: "Analytics" },
  { id: "volume-fees", label: "Volume & Fees" },
  { id: "risk", label: "Risk" },
];

const filterableTabs = ["positions", "open-orders", "history"];

export default function PortfolioDashboard() {
  const [activeTab, setActiveTab] = useState("positions");
  const [isJournalModalOpen, setIsJournalModalOpen] = useState(false);

  const handleNewJournalEntry = () => {
    setIsJournalModalOpen(true);
  };

  const handleCloseJournalModal = () => {
    setIsJournalModalOpen(false);
  };

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
        return (
          <JournalTabContent
            isModalOpen={isJournalModalOpen}
            onNewEntry={handleNewJournalEntry}
            onCloseModal={handleCloseJournalModal}
          />
        );
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

        {/* Sub-Tab Navigation + Inline Filters */}
        <div className="border-b border-border mb-6">
          <div className="flex items-center justify-between gap-4">
            {/* Tabs - left side */}
            <nav className="flex items-center gap-1 min-w-max overflow-x-auto scrollbar-hide">
              {subTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "px-3 sm:px-4 py-3 text-sm font-medium transition-colors relative whitespace-nowrap cursor-pointer",
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

            {/* Right side - filters or journal button */}
            <div className="hidden sm:flex items-center gap-2 flex-shrink-0 py-1.5">
              {filterableTabs.includes(activeTab) && <GlobalFilterBar />}
              {activeTab === "journal" && (
                <Button
                  size="sm"
                  onClick={handleNewJournalEntry}
                  className="gap-1.5 bg-primary hover:bg-primary/90"
                >
                  <Plus className="h-4 w-4" />
                  New Entry
                </Button>
              )}
            </div>
          </div>

          {/* Mobile: filters/journal button below tabs */}
          <div className="sm:hidden pb-2 px-1">
            {filterableTabs.includes(activeTab) && (
              <div className="pt-2">
                <GlobalFilterBar />
              </div>
            )}
            {activeTab === "journal" && (
              <div className="pt-2">
                <Button
                  size="sm"
                  onClick={handleNewJournalEntry}
                  className="gap-1.5 bg-primary hover:bg-primary/90"
                >
                  <Plus className="h-4 w-4" />
                  New Entry
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Tab Content */}
        <div className="min-h-[600px]">{renderTabContent()}</div>
      </div>
    </FilterProvider>
  );
}
