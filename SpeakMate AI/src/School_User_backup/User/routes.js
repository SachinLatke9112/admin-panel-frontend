import SchoolUserList from './SchoolUser/pages/SchoolUserList';
import StudentOverview from './SchoolUser/pages/StudentOverview';
import UserLayout from './layouts/UserLayout';

export const userRoutes = [
  {
    path: '/user',
    component: UserLayout,
    exact: true,
  },
  {
    path: '/user/school-users',
    component: SchoolUserList,
    exact: true,
  },
  {
    path: '/user/school-users/:id',
    component: StudentOverview,
    exact: true,
  },
];

export default userRoutes;

