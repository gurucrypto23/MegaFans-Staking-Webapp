import React, { useState, useEffect } from "react";
import { useMoralis, useNFTBalances } from "react-moralis";
import { Skeleton, Divider } from "antd";
// import { abi as MegaFansNFTABI }  from "../contracts/MegaFansNFT.json";
import { abi as StakingSystemABI } from "../contracts/StakingSystem.json";
import address from "../addresses/address";
import Moralis from "moralis";
import NFTComponent from "./NFTComponent";

const styles = {
  NFTs: {
    display: "flex",
    flexWrap: "wrap",
    WebkitBoxPack: "start",
    justifyContent: "flex-start",
    margin: "0 auto",
    maxWidth: "1000px",
    width: "100%",
    gap: "10px",
  },
};

function NFTBalance() {
  const [ stakedTokens, setStakedTokens ] = useState([]);
  const { data: NFTBalances } = useNFTBalances();
  const { account } = useMoralis();

  useEffect(() => {
    getStakedTokens();
  }, [account])

  // Get Staked Token
  const getStakedTokens = async () => {
    const _stakedTokens = await Moralis.executeFunction({
      functionName: "getStakedTokens",
      abi: StakingSystemABI,
      contractAddress: address.mumbai.STAKING_SYSTEM_ADDRESS,
      params: {
        _user:account
      }
    });

    // console.log(_stakedTokens);
    let tokens = [];
    tokens = _stakedTokens.map((each) => {
      return parseInt(Number(each._hex)); 
    })
    setStakedTokens(tokens);
  };


  return (
    <div style={{ padding: "15px", maxWidth: "1030px", width: "100%" }}>
      <h1>MEGAFANS ITEMS</h1>
      <div style={styles.NFTs}>
        <Skeleton loading={!NFTBalances?.result}>
          {stakedTokens &&
            stakedTokens.map((token_id, index) => {
              return <NFTComponent
                tokenId={token_id}
                stakedTokens={stakedTokens}
                updateStakedNFT={getStakedTokens}
                key={index}
              ></NFTComponent>
            })
          }
          {
            stakedTokens ?? 
            <Divider />
          }
          {NFTBalances?.result &&
            NFTBalances.result.map((nft, index) => {
              if (nft.token_address.toLowerCase() === address.mumbai.MEGAFANSNFT_ADDRESS.toLowerCase()) {
                return <NFTComponent
                  tokenId={nft.token_id}
                  stakedTokens={stakedTokens}
                  updateStakedNFT={getStakedTokens}
                  key={index}
                ></NFTComponent>
              }
              return null;
            })
          }
        </Skeleton>
      </div>
    </div>
  );
}

export default NFTBalance;
