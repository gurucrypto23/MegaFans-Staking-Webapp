import React, {useState} from "react";
import Moralis from "moralis";
import { Card, Typography, Button, Input, Upload } from "antd";
import { abi } from "../contracts/MegaFansNFT.json";
import address from "../addresses/address";
import { useIPFS } from "../hooks/useIPFS";
import MintConfirmModal from "./MintConfirmModal";
import { useMoralis } from "react-moralis";

const { TextArea } = Input;

export default function Minter() {

  const { account } = useMoralis();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [fileUploadRefresher, setFileUploadRefresher] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const { mintNft } = useIPFS();

  const onFileChange = ({ file: newFile }) => {
    setFile(newFile);
  };

  const onPreview = async file => {
    let src = file.url;
    if (!src) {
      src = await new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

  const clearUpload = () => {
    setFile(null)
    setFileUploadRefresher(0);
    setFileUploadRefresher(1);
  }

  const mintAndGo = async () => {
    setUploading(true);
    const cid = await mintNft(name, description, file);
    console.log(typeof cid);
    await Moralis.executeFunction({
      functionName: "safeMint",
      abi,
      contractAddress: address.mumbai.MEGAFANSNFT_ADDRESS,
      params: {
        to: account,
        metadataURI: cid
      }
    })

    setUploading(false);
    setModalVisible(true);
    setName("")
    setDescription("")
    clearUpload()
  }

  return (
    <div style={{ display: "flex" }}>
      <Card
        bordered={false}
        style={{
          width: 500,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          zIndex: 1,
        }}
      >
        <Typography.Title level={3}>MegaFans NFT</Typography.Title>
        <Input showCount placeholder="Name" maxLength={20} value={name} onChange={e => setName(e.target.value)} style={{ marginBottom: "1rem" }}/>
        <TextArea showCount placeholder="Description..." value={description} maxLength={140} onChange={e => setDescription(e.target.value)} style={{ marginBottom: "1rem"}}/>
        <div style={{ marginBottom: "1rem"}}>
          {fileUploadRefresher && (
            <Upload
                accept="image/*"
                file={file}
                listType="picture-card"
                onChange={onFileChange}
                onPreview={onPreview}
                onRemove={() => {clearUpload(); return true}}
                beforeUpload={() => {return false}}
              >
                {!file && '+ Upload'}
              </Upload>)}
            
        </div>
        <Button
          type="primary"
          shape="round"
          size="large"
          style={{ width: "100%" }}
          loading={uploading}
          disabled={!account}
          onClick={() => mintAndGo()}
        >
          MINT AND GO
        </Button>
      </Card>
      <MintConfirmModal visible={modalVisible} onDismiss={() => setModalVisible(false)}/>
    </div>
  );
}
