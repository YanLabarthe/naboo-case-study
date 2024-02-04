import UserWithRolesAndPermissionsFragment from "@/graphql/fragments/userWithRolesAndPermissions";
import gql from "graphql-tag";

const GetUser = gql`
  query GetUser {
    getMe {
      ...UserWithRolesAndPermissions
    }
  }
  ${UserWithRolesAndPermissionsFragment}
`;

export default GetUser;
