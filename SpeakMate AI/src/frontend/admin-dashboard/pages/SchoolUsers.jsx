import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Plus, School, ChevronDown, ChevronRight } from "lucide-react";

import Button from "@components/common/Button";
import Input from "@components/common/Input";

import SectionCard from "@admin/components/SectionCard";
import UsersTable from "@admin/components/UsersTable";
import UserFormModal from "@admin/components/UserFormModal";
import DeleteUserDialog from "@admin/components/DeleteUserDialog";

import { useUserManagement } from "@admin/hooks/useUserManagement";
import { STANDARD_OPTIONS } from "@admin/data/adminUsersMockData";

/**
 * admin-dashboard/pages/SchoolUsers.jsx
 *
 * Super Admin Panel > School Users — users grouped by standard (1st to 10th).
 * Each standard renders as a collapsible section containing the existing
 * UsersTable so the super admin can Add / Update / Delete school users per class.
 */
export function SchoolUsers() {
    const { users, addUser, updateUser, deleteUser } = useUserManagement();

    const [formModal, setFormModal] = useState({ isOpen: false, mode: "add", user: null });
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [collapsed, setCollapsed] = useState({});

    // Only school users, optionally filtered by search term.
    const schoolUsers = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        return users
            .filter((u) => u.userType === "school")
            .filter(
                (u) =>
                    !term ||
                    u.name.toLowerCase().includes(term) ||
                    u.email.toLowerCase().includes(term),
            );
    }, [users, searchTerm]);

    // Group by standard 1..10 (always render all standards so the structure is stable).
    const grouped = useMemo(() => {
        const map = {};
        STANDARD_OPTIONS.forEach((s) => (map[s] = []));
        schoolUsers.forEach((u) => {
            const std = Number(u.standard);
            if (map[std]) map[std].push(u);
        });
        return map;
    }, [schoolUsers]);

    const totalSchoolUsers = schoolUsers.length;

    const openAddModal = (standard) =>
        setFormModal({
            isOpen: true,
            mode: "add",
            user: { userType: "school", standard: Number(standard) || STANDARD_OPTIONS[0] },
        });
    const openEditModal = (u) => setFormModal({ isOpen: true, mode: "edit", user: u });
    const closeFormModal = () => setFormModal((prev) => ({ ...prev, isOpen: false }));

    const handleFormSubmit = (data) => {
        if (formModal.mode === "edit" && formModal.user) {
            updateUser(formModal.user.id, data);
        } else {
            addUser({ ...data, userType: "school" });
        }
        closeFormModal();
    };

    const handleConfirmDelete = (u) => {
        deleteUser(u.id);
        setDeleteTarget(null);
    };

    const toggle = (std) => setCollapsed((prev) => ({ ...prev, [std]: !prev[std] }));

    return (
        <div className="space-y-5 sm:space-y-6">
            {/* Page header */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-3 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-sm)] sm:flex-row sm:items-center sm:justify-between sm:p-6"
            >
                <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                        <School className="h-5 w-5" />
                    </span>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
                            School Users
                        </h1>
                        <p className="text-xs text-[var(--text-secondary)]">
                            {totalSchoolUsers} school users across standards 1st–10th
                        </p>
                    </div>
                </div>
                <div className="w-full sm:w-auto sm:max-w-[16rem]">
                    <Input
                        placeholder="Search school users…"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </motion.div>

            {/* Standards 1..10 */}
            {STANDARD_OPTIONS.map((std, idx) => {
                const list = grouped[std] || [];
                const isCollapsed = collapsed[std];
                return (
                    <SectionCard
                        key={std}
                        delay={idx * 0.03}
                        bodyClassName={isCollapsed ? "p-0" : "p-0"}
                        action={
                            <div className="flex items-center gap-2">
                                <span className="rounded-full bg-[var(--color-primary)]/10 px-2.5 py-1 text-[11px] font-bold text-[var(--color-primary)]">
                                    {list.length} {list.length === 1 ? "user" : "users"}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => toggle(std)}
                                    className="grid h-8 w-8 place-items-center rounded-lg text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
                                    aria-label={isCollapsed ? `Expand ${std}th standard` : `Collapse ${std}th standard`}
                                >
                                    {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                </button>
                            </div>
                        }
                    >
                        <div className="flex items-center justify-between gap-3 px-4 py-3.5 sm:px-5">
                            <div className="flex items-center gap-2">
                                <span className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--bg-subtle)] text-[13px] font-bold text-[var(--text-primary)]">
                                    {std}
                                </span>
                                <h3 className="text-[15px] font-bold tracking-tight text-[var(--text-primary)]">
                                    {std}th Standard
                                </h3>
                            </div>
                            <Button
                                variant="secondary"
                                onClick={() => openAddModal(std)}
                                className="!h-9 !px-3 text-xs"
                            >
                                <Plus className="mr-1 h-3.5 w-3.5" />
                                Add
                            </Button>
                        </div>

                        {!isCollapsed && (
                            <UsersTable
                                users={list}
                                onEdit={openEditModal}
                                onDelete={setDeleteTarget}
                            />
                        )}
                    </SectionCard>
                );
            })}

            {/* Modals */}
            <UserFormModal
                isOpen={formModal.isOpen}
                mode={formModal.mode}
                initialData={formModal.user}
                onClose={closeFormModal}
                onSubmit={handleFormSubmit}
            />

            <DeleteUserDialog
                isOpen={Boolean(deleteTarget)}
                user={deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
}

export default SchoolUsers;
