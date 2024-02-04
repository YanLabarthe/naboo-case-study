import gql from "graphql-tag";
import RoleFragment from "./role";

const UserWithRolesFragment = gql`
  fragment UserWithRoles on UserDtoWithRoles {
    id
    firstName
    lastName
    email
    roles {
      ...Role
    }
  }
  ${RoleFragment}
`;

export default UserWithRolesFragment;
