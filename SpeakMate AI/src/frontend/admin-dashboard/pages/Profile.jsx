import { useState } from "react";
import { motion } from "framer-motion";
import {
    ShieldCheck,
    Mail,
    Phone,
    MapPin,
    Briefcase,
    CalendarDays,
    Save,
} from "lucide-react";

import Button from "@components/common/Button";
import Input from "@components/common/Input";

import SectionCard from "@admin/components/SectionCard";

/**
 * admin-dashboard/pages/Profile.jsx
 *
 * Super Admin Panel > Profile — super admin account details, editable form and role info.
 * Frontend-only; values are local state and can be wired to an API later.
 */

const ADMIN_PROFILE = {
    name: "Dnyaneshwar Algule",
    role: "Super Admin",
    email: "admin@speakmate.ai",
    phone: "+91 98765 43210",
    location: "Pune, Maharashtra, India",
    department: "Platform Operations",
    joinedAt: "2025-01-15",
    bio: "Responsible for overseeing users, content, subscriptions and platform health on SpeakMate AI.",
};

export function Profile() {
    const [form, setForm] = useState(ADMIN_PROFILE);

    const update = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

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
                        <ShieldCheck className="h-5 w-5" />
                    </span>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
                            Super Admin Profile
                        </h1>
                        <p className="text-xs text-[var(--text-secondary)]">
                            Manage your super administrator account details
                        </p>
                    </div>
                </div>
                <Button className="!h-11 shrink-0">
                    <Save className="mr-1.5 h-4 w-4" />
                    Save Changes
                </Button>
            </motion.div>

            <div className="grid gap-5 lg:grid-cols-[1fr_1.4fr] lg:gap-6">
                {/* Left: identity card */}
                <div className="space-y-5 sm:space-y-6">
                    <SectionCard delay={0.05} bodyClassName="text-center">
                        <div className="relative mx-auto w-fit">
                            <div className="grid h-24 w-24 place-items-center rounded-full bg-[var(--color-primary)]/10 text-4xl ring-4 ring-[var(--bg-surface)]">
                                🛡️
                            </div>
                        </div>
                        <h2 className="mt-4 text-lg font-bold text-[var(--text-primary)]">
                            {form.name}
                        </h2>
                        <p className="text-xs text-[var(--text-secondary)]">{form.email}</p>
                        <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-[var(--color-primary)]/10 px-3 py-1 text-xs font-semibold text-[var(--color-primary)]">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            {form.role}
                        </span>

                        <div className="mt-5 grid grid-cols-2 gap-3 border-t border-[var(--border-subtle)] pt-4 text-left">
                            <div>
                                <p className="text-[11px] uppercase tracking-wide text-[var(--text-muted)]">
                                    Department
                                </p>
                                <p className="text-sm font-semibold text-[var(--text-primary)]">
                                    {form.department}
                                </p>
                            </div>
                            <div>
                                <p className="text-[11px] uppercase tracking-wide text-[var(--text-muted)]">
                                    Member Since
                                </p>
                                <p className="text-sm font-semibold text-[var(--text-primary)]">
                                    {form.joinedAt}
                                </p>
                            </div>
                        </div>
                    </SectionCard>
                </div>

                {/* Right: editable details */}
                <SectionCard
                    title="Account Details"
                    subtitle="Update your personal and contact information"
                    delay={0.15}
                >
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <label className="mb-1.5 block text-xs font-semibold text-[var(--text-secondary)]">
                                Full Name
                            </label>
                            <Input value={form.name} onChange={update("name")} />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-xs font-semibold text-[var(--text-secondary)]">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
                                <Input
                                    type="email"
                                    value={form.email}
                                    onChange={update("email")}
                                    className="!pl-9"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-xs font-semibold text-[var(--text-secondary)]">
                                Phone
                            </label>
                            <div className="relative">
                                <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
                                <Input
                                    value={form.phone}
                                    onChange={update("phone")}
                                    className="!pl-9"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-xs font-semibold text-[var(--text-secondary)]">
                                Location
                            </label>
                            <div className="relative">
                                <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
                                <Input
                                    value={form.location}
                                    onChange={update("location")}
                                    className="!pl-9"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-xs font-semibold text-[var(--text-secondary)]">
                                Department
                            </label>
                            <div className="relative">
                                <Briefcase className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
                                <Input
                                    value={form.department}
                                    onChange={update("department")}
                                    className="!pl-9"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-xs font-semibold text-[var(--text-secondary)]">
                                Joined On
                            </label>
                            <div className="relative">
                                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
                                <Input
                                    value={form.joinedAt}
                                    onChange={update("joinedAt")}
                                    className="!pl-9"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-2">
                            <label className="mb-1.5 block text-xs font-semibold text-[var(--text-secondary)]">
                                Bio
                            </label>
                            <textarea
                                rows={3}
                                value={form.bio}
                                onChange={update("bio")}
                                className="w-full resize-none rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--color-primary)]"
                            />
                        </div>
                    </div>
                </SectionCard>
            </div>
        </div>
    );
}

export default Profile;
