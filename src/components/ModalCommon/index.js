import React from "react";
import { Modal } from 'antd';

const ModalCommon = ({ 
  visible, 
  onDismiss,
  title = "title",
  msg = "Something went wrong"
}) => {

    return (
      <>
        <Modal
          title={title}
          centered
          visible={visible}
          onOk={() => onDismiss()}
          onCancel={() => onDismiss()}
          cancelButtonProps={{ style: { display: 'none' } }}
        >
          <p>{msg}</p>
        </Modal>
      </>
    );
} 

export default ModalCommon;