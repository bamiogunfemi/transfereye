import React, { useEffect, useState } from "react";
import { Form, Input, Modal, Select, Button, message } from "antd";
import { validateMessages, apiPost, apiGet } from "../helper";

const { Option } = Select;

const Transfer = () => {

  useEffect(() => {
     // fetch all banks
 apiGet(`bank`)
 .then((response) => (setBanks(response.data?.data)))
 .catch((e) => {
    message.error(e.message)
    })
  }, []);
  //initialize form hook
  const [form] = Form.useForm();

  // initilaize states
  const [visible, setVisible] = useState<boolean>(false);
  const [accountHolder, setAccoutHolder] = useState<string>("");
  const [accountDetails, setAccountDetails] = useState({ accountNo: "", bankCode: "", amount :"", recipientCode:'', transferCode:'' });
  const [modalText, setModalText] = useState<string>('')
  const [banks, setBanks] = useState([])

  const {accountNo, bankCode, amount } = accountDetails;
 

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
    setTimeout(function () {
      setVisible(false);
      setModalText('')

    }, 2000);
  }

  // on successful form submittion
  
  const onTransferFinish = (values: any) => {
    console.log(values)
    const formValues = {
      ...values,
      "type": "nuban",
      "currency": "NGN",
      "name" : accountHolder, 
      "metadata":{
       'amount': amount
      }
    }

    apiPost(`transferrecipient`, formValues).then((response) => {
      console.log(response)})
      .catch((e) => {
        message.error(e.message)
      })
  };
 
	useEffect(()=>{
  // verify account details with account number and bank code
		if( accountNo.length === 10 && bankCode){
			apiGet(`bank/resolve?account_number=${accountNo}&bank_code=${bankCode}`)
			.then(response=> {
        // set account holder name
        setAccoutHolder(response.data?.data?.account_name)}
        )
			.catch((e) => {
        message.error(e.message)
				 });
		}else{
      setAccoutHolder('')
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
            >
            <Form.Item
              label="Amount"
              name="amount"
              rules={[{ required: true },  
                 {
                  // validation  to check that amount entered is less than or equal to ₦10,000,000 and more than or equal to ₦100
                 validator(_, value) {
                     if (value < 100) {
                      return Promise.reject(
                        "Oops! Please enter an Amount above ₦100"
                      );
                    } else if (value > 10000000) {
                      return Promise.reject("Oops! Please enter an amount less than ₦10,000,000");
                    }
                    else{
                      return Promise.resolve(); 
                    }
                  },
                }]}
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
                {
                  banks.map(({ name, code }, i) => (
                    <Option value={code} key={i}>
                      {name}
                    </Option>
                  ))
                  ?? ''}
              </Select>
            </Form.Item>
            <Form.Item
              label="Account Number"
              name="account_number"
              rules={[{ required: true }]}
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
