import React from "react";
import { Col, Row } from "antd";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import { accountService } from "../hooks/account_service";
import { SideBar } from "../components/chatComponents/SideBar/SideBar";
import { ChatFeed } from "../components/chatComponents/ChatFeed/ChatFeed";

export default function Chat() {
  const [currentChannelId, setCurrentChannelId] = useState(0);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    let bool = true;
    const getChans = async () => {
      try {
        if (bool) {
          let login = accountService.userLogin() as string;
          setUserName(login);
        }
      } catch (error) {}
    };
    getChans();
    return () => {
      bool = false;
    };
  }, []);

  return (
    <div>
      <Header />
      <Row>
        <Col span={20}>
          <ChatFeed
            userName={userName}
            currentChannelId={currentChannelId}
            setCurrentChannelId={setCurrentChannelId}
          />
        </Col>
        <Col span={4}>
          <SideBar
            userName={userName}
            currentChannelId={currentChannelId}
            setCurrentChannelId={setCurrentChannelId}
          />
        </Col>
      </Row>
    </div>
  );
}
