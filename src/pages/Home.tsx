import React, { useState } from "react";
import { Tabs} from "antd";
import Transfer from '../components/Transfer'
import Transactions from '../components/Transactions'
const { TabPane } = Tabs;

const Home = () => {
  const [key, setKey] = useState<string>("Transfer");

  function callback(key: string) {
    setKey(key);
  }

  return (
    <section className="home__container">
      <Tabs defaultActiveKey={key} onChange={callback} centered>
        <TabPane tab="Transfer" key="Transfer">
        <Transfer/>
        </TabPane>
        <TabPane tab="Transactions" key="Transactions">
          <Transactions/>
        </TabPane>
      </Tabs>
    </section>
  );
};

export default Home;
