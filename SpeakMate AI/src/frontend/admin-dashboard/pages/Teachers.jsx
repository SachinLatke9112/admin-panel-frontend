import { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus, Plus, Search } from "lucide-react";

import Button from "@components/common/Button";
import Input from "@components/common/Input";
import Modal from "@components/common/Modal";

import SectionCard from "@admin/components/SectionCard";
import { adminTeachers } from "@admin/data/adminTeachersMockData";

const STATUS_STYLES = {
    Active: "bg-emerald-100 text-emerald-700",
    Inactive: "bg-slate-100 text-slate-700",
};

export function Teachers() {
    const [search, setSearch] = useState("");
    const [modalOpen, setModalOpen] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({});

    const update = (field) => (event) => {
        setForm((prev) => ({ ...prev, [field]: event.target.value }));
        if (errors[field]) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next[field];
                return next;
            });
        }
    };

    const validate = () => {
        const next = {};
        if (!form.name.trim()) next.name = "Teacher name is required";
        if (!form.email.trim()) next.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(form.email)) next.email = "Enter a valid email";
        if (!form.password.trim()) next.password = "Password is required";
        if (form.password !== form.confirmPassword) next.confirmPassword = "Passwords do not match";
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!validate()) return;
        alert("Teacher added successfully");
        setModalOpen(false);
        setForm({ name: "", email: "", password: "", confirmPassword: "" });
        setErrors({});
    };

    const filtered = adminTeachers.filter((t) => {
        const q = search.trim().toLowerCase();
        if (!q) return true;
        return (
            t.name.toLowerCase().includes(q) ||
            t.email.toLowerCase().includes(q) ||
            t.schoolName.toLowerCase().includes(q)
        );
    });

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
                        <UserPlus className="h-5 w-5" />
                    </span>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
                            Teachers
                        </h1>
                        <p className="text-xs text-[var(--text-secondary)]">
                            Manage teachers across all schools
                        </p>
                    </div>
                </div>
                <Button onClick={() => setModalOpen(true)} className="!h-11 shrink-0">
                    <Plus className="mr-1.5 h-4 w-4" />
                    Add Teacher
                </Button>
            </motion.div>

            <SectionCard
                title="All Teachers"
                subtitle="Teachers registered across all schools"
                delay={0.05}
                bodyClassName="p-0"
                action={
                    <div className="relative w-full sm:w-56">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
                        <Input
                            placeholder="Search teachers…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="!pl-9"
                        />
                    </div>
                }
            >
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] border-collapse text-left">
                        <thead>
                            <tr className="border-b border-[var(--border-subtle)] text-[11px] uppercase tracking-wide text-[var(--text-muted)]">
                                <th className="px-4 py-3 font-semibold sm:px-5">Teacher Name</th>
                                <th className="px-4 py-3 font-semibold">School Name</th>
                                <th className="px-4 py-3 font-semibold">Email</th>
                                <th className="px-4 py-3 font-semibold">Phone</th>
                                <th className="px-4 py-3 font-semibold sm:px-5">Status</th>
                                <th className="px-4 py-3 text-right font-semibold sm:px-5">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-10 text-center text-sm text-[var(--text-muted)]">
                                        No teachers match your search.
                                    </td>
                                </tr>
                            )}
                            {filtered.map((t) => (
                                <tr
                                    key={t.id}
                                    className="border-b border-[var(--border-subtle)] text-sm transition-colors last:border-0 hover:bg-[var(--bg-hover)]"
                                >
                                    <td className="px-4 py-3 sm:px-5">
                                        <div className="flex items-center gap-3">
                                            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--color-primary)]/10 text-xs font-bold text-[var(--color-primary)]">
                                                {t.name
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")
                                                    .slice(0, 2)}
                                            </span>
                                            <span className="font-semibold text-[var(--text-primary)]">{t.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-[var(--text-secondary)]">{t.schoolName}</td>
                                    <td className="px-4 py-3 text-[var(--text-secondary)]">{t.email}</td>
                                    <td className="px-4 py-3 text-[var(--text-secondary)]">{t.phone}</td>
                                    <td className="px-4 py-3 sm:px-5">
                                        <span
                                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[t.status] || STATUS_STYLES["Inactive"]}`}
                                        >
                                            {t.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 sm:px-5">
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                type="button"
                                                aria-label={`Edit ${t.name}`}
                                                className="rounded-lg p-2 text-[var(--text-muted)] transition hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)]"
                                            >
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button
                                                type="button"
                                                aria-label={`Delete ${t.name}`}
                                                className="rounded-lg p-2 text-[var(--text-muted)] transition hover:bg-rose-500/10 hover:text-rose-500"
                                            >
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </SectionCard>

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Teacher" description="Register a new teacher.">
                <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <Input
                                label="Teacher Name"
                                placeholder="Enter Teacher Name"
                                value={form.name}
                                onChange={update("name")}
                                error={errors.name}
                                autoComplete="off"
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <Input
                                label="Teacher Email"
                                type="email"
                                placeholder="Enter Teacher Email"
                                value={form.email}
                                onChange={update("email")}
                                error={errors.email}
                                autoComplete="off"
                            />
                        </div>
                        <div>
                            <Input
                                label="Password"
                                type="password"
                                placeholder="Enter Password"
                                value={form.password}
                                onChange={update("password")}
                                error={errors.password}
                                autoComplete="new-password"
                            />
                        </div>
                        <div>
                            <Input
                                label="Confirm Password"
                                type="password"
                                placeholder="Confirm Password"
                                value={form.confirmPassword}
                                onChange={update("confirmPassword")}
                                error={errors.confirmPassword}
                                autoComplete="new-password"
                            />
                        </div>
                    </div>

                    <div className="mt-2 flex justify-end gap-3">
                        <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">Add Teacher</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

export default Teachers;
