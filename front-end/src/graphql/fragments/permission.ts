import gql from "graphql-tag";

const PermissionFragment = gql`
  fragment Permission on PermissionDto {
    id
    name
  }
`;

export default PermissionFragment;
