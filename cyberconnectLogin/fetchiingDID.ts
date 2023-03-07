import axios from "axios";

export const check_CCProfile = async (data) => {
  try {
    const res = await axios.request({
      method: "POST",
      url: "https://api.cyberconnect.dev/",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": env.CYBERCONNECT_API,
      },
      data: {
        query: `query getHandles($address: AddressEVM!) {
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
          }`,
        variables: {
          address: data.address,
        },
      },
    });

    const {
      data: {
        data: {
          address: {
            wallet: {
              profiles: { edges },
            },
          },
        },
      },
    } = res;

    const handles = edges.map((edge) => {
      return edge.node.handle;
    });

    return handles;
  } catch (e) {
    if (axios.isAxiosError(e)) console.error(e.response?.data);

    console.error(e);
    return [];
  }
};
