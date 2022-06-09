import React, { useState, useEffect } from "react";
import { useMoralis, useNFTBalances } from "react-moralis";
import { Card, Image, Button, Skeleton, Divider } from "antd";
// import {
//   SendOutlined,
// } from "@ant-design/icons";
import { abi as MegaFansNFTABI }  from "../contracts/MegaFansNFT.json";
import { abi as StakingSystemABI } from "../contracts/StakingSystem.json";
import address from "../addresses/address";
import Moralis from "moralis";
import axios from "axios";

const { Meta } = Card;

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

function NFTComponent ({tokenId, stakedTokens}) {
  const [ metaData, setMetaData ] = useState({});
  const { account } = useMoralis();
  const [ isLoading, setIsLoading ] = useState(false);
  
  useEffect(() => {
    // Get NFT Metadata with tokenID
    const getNftTokenMetaData = async (token_id) => {
      if (!account) return null;
      const tokenURI = await Moralis.executeFunction({
        functionName: "tokenURI",
        abi: MegaFansNFTABI,
        contractAddress: address.mumbai.MEGAFANSNFT_ADDRESS,
        params: {
          tokenId: token_id
        }
      });

      const metaData = await axios.get(`${tokenURI}`);
      console.log(metaData.data);
      return metaData.data;
    }
    
    getNftTokenMetaData(tokenId).then(res => {
      console.log(res);
      setMetaData({...res})
    });
  }, [tokenId])
  
  // NFT staking with tokenID
  const nftStaking = (tokenId) => {
    if (!account) return null;
    // Check whether that tokenId's NFT is staking or not
    if (stakedTokens && stakedTokens.indexOf(tokenId) !== -1) return;

    console.log(tokenId);

    // Set the button statement as loading
    setIsLoading(true);

    // Stake particular TokenID NFT
    Moralis.executeFunction({
      functionName: "stake",
      abi: StakingSystemABI,
      contractAddress: address.mumbai.STAKING_SYSTEM_ADDRESS,
      params: {
        tokenId: tokenId
      }
    }).then((res) => {
      console.log(res);
      // Make the button as alive
      setIsLoading(false);
    }).catch((err) => {
      setIsLoading(false);
      console.log(err)
    });

  };

  // NFT unstaking with tokenID
  const nftUnStaking = (tokenId) => {
    if (!account) return null;
    // Check whether that tokenID's is staked or not
    if (stakedTokens && stakedTokens.indexOf(tokenId) === -1) return;
    console.log(tokenId);

    // Set the button statement as loading
    setIsLoading(true);
    // Unstake particular tokenID NFT
    Moralis.executeFunction({
      functionName: "unstake",
      abi: StakingSystemABI,
      contractAddress: address.mumbai.STAKING_SYSTEM_ADDRESS,
      params: {
        _tokenId: tokenId
      }
    }).then(res => {
      // Make the button as alive
      setIsLoading(false);
      console.log(res);
    });
  };

  if (!metaData.name) return <></>;
  return (
    <Card
      hoverable
      actions={[
        !stakedTokens || stakedTokens.indexOf(tokenId) === -1 ?
          <Button
            type="text"
            key="staking"
            loading={isLoading}
            onClick={ () => {nftStaking(tokenId)} }
          >
            Stake NFT
          </Button> 
        : 
          <Button
            type="text"
            key="unstaking"
            loading={isLoading}
            onClick={ () => {nftUnStaking(tokenId)} }
          >
            Unstake NFT
          </Button>
      ]}
      style={{ width: 240, border: "2px solid #e7eaf3" }}
      cover={
        <Image
          preview={false}
          src={metaData?.image || "error"}
          fallback="data:image/png;base64,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"
          alt=""
          style={{ height: "300px" }}
        />
      }
    >
      <Meta
        title={metaData?.name ?? "- No Name -"}
        // description={nft?.token_address}
        style={{ marginBottom: "0.75rem" }}
      />
    </Card>
  );
}


function NFTBalance() {
  const [ stakedTokens, setStakedTokens ] = useState([]);
  const { data: NFTBalances } = useNFTBalances();
  const { account } = useMoralis();

  useEffect(() => {
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
    getStakedTokens();
  }, [account])


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
                key={index}
              ></NFTComponent>
            })
          }
          {
            stakedTokens ?? 
            <Divider orientation="right" plain>
              Staked NFT
            </Divider>
          }
          {NFTBalances?.result &&
            NFTBalances.result.map((nft, index) => {
              if (nft.token_address.toLowerCase() === address.mumbai.MEGAFANSNFT_ADDRESS.toLowerCase()) {
                return <NFTComponent
                  tokenId={nft.token_id}
                  stakedTokens={stakedTokens}
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
