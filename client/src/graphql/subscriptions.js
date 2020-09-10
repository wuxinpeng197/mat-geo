import gql from "graphql-tag";

export const PIN_ADDED_SUBSCRIPTION = gql`
  subscription {
    pinAdded {
      _id
      createAt
      title
      image
      content
      latitude
      longitude
      author {
        _id
        name
        email
        picture
      }
      comments {
        text
        createAt
        author {
          name
          picture
        }
      }
    }
  }
`;

export const PIN_UPDATED_SUBSCRIPTION = gql`
  subscription {
    pinUpdated {
      _id
      createAt
      title
      content
      image
      latitude
      longitude
      author {
        _id
        name
      }
      comments {
        text
        createAt
        author {
          name
          picture
        }
      }
    }
  }
`;

export const PIN_DELETED_SUBSCRIPTION = gql`
  subscription {
    pinDeleted {
      _id
    }
  }
`;