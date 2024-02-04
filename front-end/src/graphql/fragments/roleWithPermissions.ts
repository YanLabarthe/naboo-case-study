import gql from "graphql-tag";
import PermissionFragment from "./permission";

const RoleWithPermissionsFragment = gql`
  fragment RoleWithPermissions on RoleDtoWithPermissions {
    id
    name
    permissions {
      ...Permission
    }
  }
  ${PermissionFragment}
`;

export default RoleWithPermissionsFragment;
