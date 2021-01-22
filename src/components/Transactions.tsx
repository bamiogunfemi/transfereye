import React, { useState, useEffect } from "react";
import { List, Modal, Row, Col, message } from "antd";
import { DATE_FORMAT, TIME_FORMAT, apiGet } from "../helper";
import { format, parseISO } from "date-fns";
const Transactions = () => {
  //initialize state
  const [visible, setVisible] = useState<boolean>(false);
  const [transactions, setTransactions] = useState([]);
  //fetch all transactions
  useEffect(() => {
    apiGet(`transferrecipient`)
      .then((response) => {
        setTransactions(response.data?.data);
      })
      .catch((e) => {
        message.error(e.message);
      });
  }, []);

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
    <section className="container">
      <List
        itemLayout="horizontal"
        size="large"
        dataSource={transactions}
        renderItem={(item: any) => {
          const transactionDate = format(parseISO(item.updatedAt), DATE_FORMAT);
          const transactionTime = format(parseISO(item.updatedAt), TIME_FORMAT);
          const accountName = item.name.toLowerCase();
          return (
            <List.Item onClick={showModal}>
              <List.Item.Meta
                title={accountName}
                description={item.details.bank_name}
              />
              ₦{item.metadata?.amount}
              <Modal
                title="Transaction"
                visible={visible}
                onCancel={handleClose}
                footer={null}>
                <Row justify="start">
                  <Col span={24}>
                    <h3 className="transaction_title">Paid On </h3>
                    <p className="account__date">
                      {`${transactionDate} at 
               ${transactionTime}`}
                    </p>
                  </Col>

                  <Col span={24}>
                    <h3 className="transaction_title">To </h3>
                    <Row justify="space-between">
                      <Col>
                        <p className="account__details">{accountName}</p>
                      </Col>
                      <Col>
                        <p className="account__details">
                          {item.details.bank_name}
                        </p>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={24}>
                    <h3 className="transaction_title">Amount </h3>
                    <p> ₦{item.metadata?.amount}</p>
                  </Col>
                  <Col span={24}>
                    <h3 className="transaction_title">Description </h3>
                    <p>{item.description ?? 'No Description'}</p>
                  </Col>
                </Row>
              </Modal>
            </List.Item>
          );
        }}
      />
    </section>
  );
};

export default Transactions;
