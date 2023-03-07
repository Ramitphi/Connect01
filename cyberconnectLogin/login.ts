import axios from "axios";

import { ExternalProvider, Web3Provider } from "@ethersproject/providers";

const loginwithcyberconnect = async () => {
  try {
    const provider = new Web3Provider(
      <ExternalProvider>(<unknown>window.ethereum)
    );

    const addresses = await provider.send("eth_requestAccounts", []);

    const address = addresses[0];

    await provider.send("wallet_switchEthereumChain", [
      {
        chainId: "0x38",
      },
    ]);

    const walletSigner = provider?.getSigner(address);

    const { data: cyberconnect } = await axios.request({
      method: "GET",
      url: `https://api.simplehash.com/api/v0/nfts/owners?chains=bsc&wallet_addresses=${address}&contract_addresses=0x2723522702093601e6360CAe665518C4f63e9dA6`,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": env.SIMPLEHASH_API_KEY,
      },
    });

    const cyberconnectprofiles =
      cyberconnect?.nfts?.map(({ name }) => name) || [];

    if (!cyberconnectprofiles[0])
      throw new Error("User do not own cyberconect profile");

    const { data } = await axios.request({
      method: "POST",
      url: "https://api.cyberconnect.dev/",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": env.CYBERCONNECT_API,
      },
      data: {
        query: `mutation loginGetMessage($domain:String!,$address:AddressEVM!) {
            loginGetMessage(input:{
              domain: $domain,
              address: $address
            }) {
              message
            }
          }`,
        variables: {
          domain: "Huddle01.com",
          address,
        },
      },
    });

    const text = data.data.loginGetMessage.message;

    const signature = await walletSigner.signMessage(text);

    const { data: accessTokenData } = await axios.request({
      method: "POST",
      url: "https://api.cyberconnect.dev/",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": env.CYBERCONNECT_API,
      },
      data: {
        query: `mutation loginVerify ($domain:String!,$address:AddressEVM!,$signature:String!) 
        {
          loginVerify(input:{
            domain:$domain,
            address:$address,
            signature:$signature
          }){
            accessToken, 
            refreshToken
          }
        }`,
        variables: {
          domain: "Huddle01.com",
          address,
          signature,
        },
      },
    });

    const { accessToken: ccAccessToken, refreshToken: ccRefreshToken } =
      accessTokenData.data.loginVerify;

    localStorage.setItem("ccAccessToken", ccAccessToken);
    localStorage.setItem("ccRefreshToken", ccRefreshToken);

    const { data: loginData } = await axios.post(`/api/auth/login-did`, {
      didAccessToken: ccAccessToken,
      walletType: "cyberconnect",
      address,
    });

    if (!loginData) throw new Error("Not having valid login token");

    return {
      address,
      domain: cyberconnectprofiles[0]?.slice(1),
      loginData,
    };
  } catch (e) {
    console.error(e);
    return {
      address: "",
      domain: "",
      loginData: {
        accessToken: "",
        refreshToken: "",
      },
    };
  }
};
