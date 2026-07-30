import { motion } from "framer-motion";
import { Download } from "lucide-react";
import Button from "@components/common/Button";
import Input from "@components/common/Input";

import KpiCard from "@school-admin/components/KpiCard";
import SectionCard from "@school-admin/components/SectionCard";
import ResultsTable from "@school-admin/components/ResultsTable";
import { useResults } from "@school-admin/hooks/useSchoolData";

export function Dashboard() {
    const { results, totalResults, searchTerm, setSearchTerm } = useResults();
    const recentResults = results.slice(0, 5);

    const topRowKpis = [
        { id: "total-students", label: "Total Students", value: 124, change: 4.2, trend: "up", icon: "users", accent: "#6c63ff", sparkline: [110, 112, 115, 118, 119, 121, 122, 123, 123.5, 124] },
        { id: "active-students", label: "Active Students", value: 98, change: 2.1, trend: "up", icon: "users", accent: "#22c55e", sparkline: [85, 87, 88, 90, 91, 93, 94, 95, 96, 98] },
    ];

    const secondRowKpis = [
        { id: "total-tests", label: "Total Tests", value: 24, change: 12.5, trend: "up", icon: "clipboard", accent: "#6c63ff", sparkline: [15, 17, 18, 19, 20, 21, 22, 23, 23.5, 24] },
        { id: "recent-results", label: "Recent Results", value: totalResults, change: 8.0, trend: "up", icon: "chart", accent: "#ff6584", sparkline: [20, 22, 23, 24, 25, 26, 27, 28, 29, totalResults] },
    ];

    return (
        <div className="space-y-5 sm:space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="relative overflow-hidden rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-sm)] sm:p-8"
            >
                <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-20 blur-3xl"
                    style={{ background: "linear-gradient(135deg,#6c63ff,#ff6584)" }}
                />
                <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-default)] bg-[var(--bg-subtle)] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                            School Admin
                        </span>
                        <h1 className="mt-3 text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">
                            Dashboard
                        </h1>
                        <p className="mt-1.5 max-w-xl text-sm leading-6 text-[var(--text-secondary)]">
                            Monitor students and recent results across your school.
                        </p>
                    </div>
                    <div className="flex shrink-0 flex-wrap gap-2.5">
                        <Button variant="secondary" className="!h-10 !px-4">
                            <Download className="mr-1.5 h-4 w-4" />
                            Export
                        </Button>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {topRowKpis.map((kpi, i) => (
                    <KpiCard key={kpi.id} kpi={kpi} index={i} />
                ))}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {secondRowKpis.map((kpi, i) => (
                    <KpiCard key={kpi.id} kpi={kpi} index={i} />
                ))}
            </div>

            <SectionCard
                title="Recent Results"
                subtitle={`${totalResults} results recorded`}
                className="xl:col-span-2"
                delay={0.05}
                bodyClassName="p-0"
                action={
                    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                        <Input
                            placeholder="Search results…"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                }
            >
                <ResultsTable results={recentResults} />
            </SectionCard>
        </div>
    );
}

export default Dashboard;
