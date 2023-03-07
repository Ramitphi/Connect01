import {
  check_CCIsFollowing,
  check_CCProfile,
} from "./cyberconnectTokenGatingUtil";

export const cyberconnectHandler = async (req: Request, res: Response) => {
  if (req.method !== "GET") {
    return;
  }

  const parsedQuery = req.query;

  if (!parsedQuery.success) {
    return;
  }

  const { type, condition, address, userHandle, userAccessToken } =
    parsedQuery.data;

  const cyberConnectTokenGatingObj = {
    profile: check_CCProfile,
    follower: check_CCIsFollowing,
  };

  try {
    const auth = await cyberConnectTokenGatingObj[type]({
      condition,
      address,
      userHandle,
      accessToken: userAccessToken,
    });

    if (auth) return true;
  } catch (error) {
    return;
  }
};
