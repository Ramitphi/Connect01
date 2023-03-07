const CC_GET_POFILE_BY_ADDRESS = `query getHandles($address: AddressEVM!) {
    address(address: $address) {
      wallet {
        profiles {
          edges {
            node {
              handle
            }
          }
        }
      }
    }
  }`;
const CC_GET_IS_FOLLOWING = `query getFollowersByHandle($handle: String!, $me: AddressEVM!) {
    profileByHandle(handle: $handle) {
      followerCount
      isFollowedByMe(me: $me)
      followers {
        totalCount
        pageInfo {
          hasPreviousPage
          startCursor
          hasNextPage
        }
      }
    }
  }
`;

export { CC_GET_POFILE_BY_ADDRESS, CC_GET_IS_FOLLOWING };
