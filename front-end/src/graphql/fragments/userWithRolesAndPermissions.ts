import gql from "graphql-tag";
import RoleWithPermissionsFragment from "./roleWithPermissions";

const UserWithRolesAndPermissionsFragment = gql`
  fragment UserWithRolesAndPermissions on UserDtoWithRolesAndPermissions {
    id
    firstName
    lastName
    email
    roles {
      ...RoleWithPermissions
    }
  }
  ${RoleWithPermissionsFragment}
`;

export default UserWithRolesAndPermissionsFragment;
