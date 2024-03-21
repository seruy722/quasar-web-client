import { isEmpty } from "lodash";
export const getUser = ({ user }) => user;
export const isUserAuth = ({ user }) => !isEmpty(user);
export const getToPath = ({ toPath }) => toPath;
export const getUsersWithRolesAndPermissions = ({
  usersWithRolesAndPermissions,
}) => usersWithRolesAndPermissions;
export const getUsersList = ({ usersList }) => usersList;
