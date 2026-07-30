import {
    LayoutDashboard,
    Users,
    BarChart3,
    UserPlus,
    User,
    Settings,
    LogOut,
} from "lucide-react";
import ROUTES from "@constants/routes";

export const SCHOOL_SIDEBAR_MENU = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: ROUTES.SCHOOL_ADMIN_DASHBOARD },
    { id: "students", label: "Students", icon: Users, path: ROUTES.SCHOOL_ADMIN_STUDENTS },
    { id: "results", label: "Results", icon: BarChart3, path: ROUTES.SCHOOL_ADMIN_RESULTS },
    { id: "add-teacher", label: "Add Teacher", icon: UserPlus, path: ROUTES.SCHOOL_ADMIN_ADD_TEACHER },
];

export const SCHOOL_SIDEBAR_FOOTER_MENU = [
    { id: "profile", label: "Profile", icon: User, path: ROUTES.SCHOOL_ADMIN_PROFILE },
    { id: "settings", label: "Settings", icon: Settings, path: ROUTES.SCHOOL_ADMIN_SETTINGS },
];

export const LOGOUT_ITEM = {
    id: "logout",
    label: "Logout",
    icon: LogOut,
};
