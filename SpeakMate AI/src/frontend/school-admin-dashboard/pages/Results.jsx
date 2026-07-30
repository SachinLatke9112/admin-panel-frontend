import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";

import Input from "@components/common/Input";
import SectionCard from "@school-admin/components/SectionCard";
import ResultsTable from "@school-admin/components/ResultsTable";
import { useResults } from "@school-admin/hooks/useSchoolData";

export function Results() {
    const { results, totalResults, searchTerm, setSearchTerm } = useResults();

    return (
        <div className="space-y-5 sm:space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-3 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-sm)] sm:flex-row sm:items-center sm:justify-between sm:p-6"
            >
                <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                        <BarChart3 className="h-5 w-5" />
                    </span>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
                            Results
                        </h1>
                        <p className="text-xs text-[var(--text-secondary)]">
                            {totalResults} results recorded
                        </p>
                    </div>
                </div>
            </motion.div>

            <SectionCard
                title="All Results"
                subtitle="Review student performance across tests"
                delay={0.05}
                bodyClassName="p-0"
                action={
                    <div className="w-full sm:w-auto sm:max-w-[16rem]">
                        <Input
                            placeholder="Search results…"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                }
            >
                <ResultsTable results={results} />
            </SectionCard>
        </div>
    );
}

export default Results;
