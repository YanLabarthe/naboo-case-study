import gql from "graphql-tag";

const OwnerFragment = gql`
  fragment Owner on UserDto {
    firstName
    lastName
  }
`;

export default OwnerFragment;
