import { NavLink } from "react-router-dom";

import ROUTES from "@constants/routes";

const navigationItems = [
    {
        label: "Dashboard",
        path: ROUTES.TEACHER_DASHBOARD,
        icon: (
            <path d="M4 13h6V4H4v9Zm0 7h6v-4H4v4Zm10 0h6v-9h-6v9Zm0-16v4h6V4h-6Z" />
        ),
    },
    {
        label: "Students",
        path: ROUTES.TEACHER_STUDENTS,
        icon: (
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m7-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm13 10v-2a4 4 0 0 0-3-3.87m-3-11.96a4 4 0 0 1 0 7.75" />
        ),
    },
    {
        label: "Analytics",
        path: ROUTES.TEACHER_ANALYTICS,
        icon: <path d="M4 19V9m6 10V5m6 14v-7m4 7H2" />,
    },
    {
        label: "Reports",
        path: ROUTES.TEACHER_REPORTS,
        icon: (
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8m-6-6 6 6m-6-6v6h6M8 13h8m-8 4h8" />
        ),
    },
    {
        label: "Profile",
        path: ROUTES.TEACHER_PROFILE,
        icon: (
            <path d="M20 21a8 8 0 0 0-16 0m8-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
        ),
    },
];

export function TeacherSidebar({
    className = "",
    onNavigate,
    labelId = "teacher-sidebar-title",
}) {
    return (
        <aside
            className={`flex h-full w-72 shrink-0 flex-col border-r border-slate-200 bg-white ${className}`}
            aria-labelledby={labelId}
        >
            <div className="flex h-16 shrink-0 items-center gap-3 border-b border-slate-200 px-5">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-500 text-xs font-black text-white shadow-md shadow-indigo-600/20">
                    SM
                </span>
                <div className="min-w-0">
                    <p className="truncate text-base font-black text-slate-950">
                        SpeakMate AI
                    </p>
                    <p
                        id={labelId}
                        className="text-xs font-semibold text-indigo-600"
                    >
                        Teacher Workspace
                    </p>
                </div>
            </div>

            <nav aria-label="Teacher workspace" className="flex-1 px-4 py-6">
                <p className="px-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                    Workspace
                </p>
                <ul className="mt-3 space-y-1.5">
                    {navigationItems.map((item) => {
                        const content = (
                            <>
                                <svg
                                    aria-hidden="true"
                                    className="h-5 w-5 shrink-0"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    {item.icon}
                                </svg>
                                <span>{item.label}</span>
                            </>
                        );

                        return (
                            <li key={item.label}>
                                {item.path ? (
                                    <NavLink
                                        to={item.path}
                                        onClick={onNavigate}
                                        className={({ isActive }) =>
                                            `flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${isActive
                                                ? "bg-indigo-50 text-indigo-700"
                                                : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                                            }`
                                        }
                                    >
                                        {content}
                                    </NavLink>
                                ) : (
                                    <div className="flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-slate-600 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-950">
                                        {content}
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="border-t border-slate-200 px-5 py-4">
                <p className="text-xs font-medium text-slate-400">SpeakMate AI</p>
            </div>
        </aside>
    );
}

export default TeacherSidebar;
