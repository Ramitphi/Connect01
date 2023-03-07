import axios from "axios";
import { CC_GET_IS_FOLLOWING, CC_GET_POFILE_BY_ADDRESS } from "./operations";

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
        query: CC_GET_POFILE_BY_ADDRESS,
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

    if (handles[0]) return true;
    return false;
  } catch (e) {
    if (axios.isAxiosError(e)) console.error(e.response?.data);

    console.error(e);
    return false;
  }
};

export const check_CCIsFollowing = async (data) => {
  try {
    const res = await axios.request({
      method: "POST",
      url: "https://api.cyberconnect.dev/",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": env.CYBERCONNECT_API,
      },
      data: {
        query: CC_GET_IS_FOLLOWING,
        variables: {
          handle: data.conditionInput,
          me: data.address,
        },
      },
    });

    const {
      data: {
        data: {
          profileByHandle: { isFollowedByMe },
        },
      },
    } = res;

    return isFollowedByMe;
  } catch (e) {
    if (axios.isAxiosError(e)) console.error(e.response?.data);

    console.error(e);
    return false;
  }
};
