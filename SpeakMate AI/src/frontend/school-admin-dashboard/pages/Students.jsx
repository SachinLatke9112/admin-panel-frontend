import { motion } from "framer-motion";
import { Plus, Users } from "lucide-react";

import Button from "@components/common/Button";
import Input from "@components/common/Input";

import SectionCard from "@school-admin/components/SectionCard";
import StudentsTable from "@school-admin/components/StudentsTable";
import { useStudents } from "@school-admin/hooks/useSchoolData";

export function Students() {
    const { students, totalStudents, searchTerm, setSearchTerm } = useStudents();
    const openAddModal = () => {};

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
                        <Users className="h-5 w-5" />
                    </span>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
                            Students
                        </h1>
                        <p className="text-xs text-[var(--text-secondary)]">
                            {totalStudents} students registered
                        </p>
                    </div>
                </div>
                <Button onClick={openAddModal} className="!h-11 shrink-0">
                    <Plus className="mr-1.5 h-4 w-4" />
                    Add Student
                </Button>
            </motion.div>

            <SectionCard
                title="All Students"
                subtitle="Search, view and manage student records"
                delay={0.05}
                bodyClassName="p-0"
                action={
                    <div className="w-full sm:w-auto sm:max-w-[16rem]">
                        <Input
                            placeholder="Search students…"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                }
            >
                <StudentsTable students={students} onEdit={(s) => setFormModal({ isOpen: true, mode: "edit", student: s })} onDelete={(s) => { if (confirm(`Delete ${s.name}?`)) deleteStudent(s.id); }} />
            </SectionCard>
        </div>
    );
}

export default Students;
