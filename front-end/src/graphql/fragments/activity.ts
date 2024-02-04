import gql from "graphql-tag";
import OwnerFragment from "./owner";

const ActivityFragment = gql`
  fragment Activity on ActivityDto {
    id
    city
    description
    name
    price
    owner {
      ...Owner
    }
    createdAt
    updatedAt
  }
  ${OwnerFragment}
`;

export default ActivityFragment;
