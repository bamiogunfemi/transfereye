import React, { useEffect, useState } from "react";
import { Form, Input, Modal, Select, Button } from "antd";
import { validateMessages, useFetch, BASE_URL, getHeaders,createTransferReciept } from "../helper";

const { Option } = Select;

const Transfer = () => {

  //initialize form hook
  const [form] = Form.useForm();

  // initilaize states
  const [visible, setVisible] = useState<boolean>(false);
  const [accountHolder, setAccoutHolder] = useState<string>("");
  const [accountDetails, setAccountDetails] = useState({ accountNo: "", bankCode: "", amount :"", recipientCode:'', transferCode:'' });
  const { accountNo, bankCode, amount } = accountDetails;
  const [modalText, setModalText] = useState<string>('')

  // fetch all banks
  let banks = useFetch(`${BASE_URL}/bank`,getHeaders).response;

    //confirmation modal 

 // open confirm modal
  const showModal = () => {
    setModalText(`Are you sure you want to send ₦${amount} to ${accountHolder}?`)
    setVisible(true);
  };

  //closes confirm modal
  const handleClose = () => {
    setVisible(false);
  };

  const handleOk = () => {
    form.submit()
    setModalText(`Trasfer Success!`)
    form.resetFields();
  };


  // on successful form submittion
  
  const onTransferFinish = (values: any) => {
    console.log('stuff')
    console.log('Success:', values);
    const formValues = {
      ...values,
      "type": "nuban",
      "currency": "NGN",
      "name" : accountHolder, 
      "metadata":{
       'amount': amount
      }
    }
    console.log('stuff')
    createTransferReciept(formValues)
    // setModalText(`You just transfered ${amount} to ${accountHolder}`)
  };
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

	useEffect(()=>{

  // verify account details with account number and bank code
		if( accountNo.length === 10 && bankCode){
			fetch(`${BASE_URL}/bank/resolve?account_number=${accountNo}&bank_code=${bankCode}`, getHeaders)
			.then(response => response.json())
			.then(data=> {
        // set account holder name
				setAccoutHolder(data.data?.account_name)})
			.catch((error) => {
					console.log(error)
				 });
		}
  }, [accountNo,bankCode])
  
  // onChange of Form Inputs
  const onFormChange = ({ account_number, bank_code,amount }: any) => {
		if (bank_code !== undefined) {	
			setAccountDetails({
				...accountDetails,
				bankCode: bank_code,
			})
			}
			else if(account_number !== undefined){
				setAccountDetails({
					...accountDetails,
					accountNo: account_number,
				})
      }
      else if(amount !== undefined){
				setAccountDetails({
					...accountDetails,
					amount: amount,
				})
			}
  };

  return (
    <section className='container'>
       <Form
            form={form}
            onValuesChange={onFormChange}
            validateMessages={validateMessages}
            layout="vertical"
            initialValues={{ remember: true }}
            onFinish={onTransferFinish}
            onFinishFailed={onFinishFailed}
            >
            <Form.Item
              label="Amount"
              name="amount"
              rules={[
                {
                  required: true,
                },
                ({ getFieldValue }) => ({
                  // validation  to check that amount entered is less than or equal to ₦10,000,000 and more than or equal to ₦100
                 validator(rule, value) {
                    if (value <= 100 && value >= 10000000) {
                      return Promise.resolve();
                    }
                     else if (value <= 100) {
                      return Promise.reject(
                        "Oops! Please enter an Amount above ₦100"
                      );
                    } else if (value >= 5000000) {
                      return Promise.reject("Oops! Please enter an amount less than ₦10,000,000");
                    }
                    else{
                      return Promise.resolve();
                    }
                    
                  },
                }),
              ]}
              className="form-group">
              <Input type="number" />
            </Form.Item>
            <Form.Item
              label="Bank"
              name="bank_code"
              rules={[{ required: true }]}
              className="form-group">
              <Select
                showSearch
                optionFilterProp="children"
                filterOption={(input: any, option: any) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                filterSort={(optionA: any, optionB: any) =>
                  optionA.children
                    .toLowerCase()
                    .localeCompare(optionB.children.toLowerCase())
                }>
                {banks &&
                  banks.map(({ name, code }, i) => (
                    <Option value={code} key={i}>
                      {name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Account Number"
              name="account_number"
              className="form-group">
              <Input type="number" />
            </Form.Item>
						<p className='account__name'>
						{accountHolder ? accountHolder : ""}

						</p>
            <Form.Item
              label="Add a note (Optional)"
              name="description"
              className="form-group">
              <Input />
            </Form.Item>
            <Form.Item className="form-group">
              <Button onClick={showModal} disabled={!accountHolder}> Send</Button>
            </Form.Item>
          </Form>
            <Modal
              visible={visible}
              onCancel={handleClose}
              onOk={handleOk}
              >
                {modalText}
            </Modal> 
           </section> 
          );
};
         


export default Transfer;
