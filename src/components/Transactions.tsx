import React, { useState } from "react";
import { List, Modal, Row,Col } from "antd";
import { useFetch, BASE_URL, getHeaders } from "../helper";
import {format,parseISO} from 'date-fns'
const Transactions = () => {

// data format
const dateFormat ='MMM, dd yyyy' 

// time format
const timeFormat = 'hh:m a'

//initialize state
const [visible, setVisible] = useState<boolean>(false);

//fetch all transactions

let transactions = useFetch(`${BASE_URL}/transferrecipient`, getHeaders).response;
  
//Details modal 

// open Details modal
 const showModal = () => {
  setVisible(true);
};

//closes Details modal
const handleClose = () => {
  setVisible(false);
};
  return (
    <section className='container'>
      <List
        itemLayout="horizontal"
        size="large"
        dataSource={transactions}
        renderItem={(item:any) => (
          <List.Item
          onClick={showModal}
          >
            <List.Item.Meta
              title={item.name.toLowerCase()}
              description={item.details.bank_name}
            />
            ₦{item.metadata?.amount}
           <Modal
              title='Transaction'
              visible={visible}
              onCancel={handleClose}
              footer={null}
              >
             <Row justify='start'>
             <Col span={24}>
             <h3 className='transaction_title'>Paid On </h3>    
             <p className='account__date'>
               {`${format(parseISO(item.updatedAt), dateFormat)} at 
               ${format(parseISO(item.updatedAt), timeFormat)}`
        }
               </p>
             </Col>
            
              <Col span={24}>
               <h3 className='transaction_title'>To </h3>
               <Row justify='space-between'>
                 <Col>
                 <p className='account__details'>
                 {item.name.toLowerCase()} 
                 </p>
                 </Col>
                 <Col>
                 <p className='account__details'>{item.details.bank_name}</p></Col>
               </Row>
              </Col>
              <Col span={24}>
               <h3 className='transaction_title'>Amount </h3>    
                <p> ₦{item.metadata?.amount}</p>
               </Col>
               <Col span={24}>
               <h3 className='transaction_title'>Description </h3>    
                <p>{item.description ?? item.description}</p>
               </Col>
             </Row>
            </Modal>
          </List.Item>
        )}
      />
        
    </section>
  );
};

export default Transactions;
