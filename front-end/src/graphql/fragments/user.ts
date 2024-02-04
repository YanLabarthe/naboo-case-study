import gql from "graphql-tag";

const UserFragment = gql`
  fragment User on UserDto {
    id
    firstName
    lastName
    email
  }
`;

export default UserFragment;
