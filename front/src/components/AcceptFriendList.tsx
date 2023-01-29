import axios from "axios";
import React, { useEffect, useState } from "react";
import { accountService } from "../hooks/account_service";
import StatsCardFriend from "./StatsCardFriend";

type data = {
  sender: string;
  senderLogin: string;
  receiverLogin: string;
  receiver: string;
  status: string;
};

export default function AcceptFriendList() {
  const [receiveLst, setReceiveLst] = useState([]);
  const [sendingLst, setSendingLst] = useState([]);
  const [isClicked, setIsClicked] = useState(false);
  const [isReceice, setIsReceive] = useState(false);
  const [friendUser, setFriendUser] = useState("");

  useEffect(() => {
    getInfo();
  }, []);

  const getInfo = () => {
    var config = {
      method: "get",
      url: "/friends/get_receive",
      headers: { Authorization: "Bearer " + accountService.userToken() },
    };
    axios(config).then((response) => setReceiveLst(response.data));

    var config2 = {
      method: "get",
      url: "/friends/get_invite",
      headers: { Authorization: "Bearer " + accountService.userToken() },
    };
    axios(config2).then((response) => setSendingLst(response.data));
  };

  const handleClick = (user: string, receive: boolean) => {
    setIsClicked(true);
    setIsReceive(receive);
    setFriendUser(user);
    localStorage.setItem("friendName", user);
  };

  const goBack = () => {
    setIsClicked(false);
    setFriendUser("");
  };

  const Accept = () => {
    var config = {
      method: "post",
      url: "/friends/accept?to=" + friendUser,
      headers: { Authorization: "Bearer " + accountService.userToken() },
    };
    axios(config);
    setIsClicked(false);
  };

  const deny = () => {
    var config = {
      method: "post",
      url: "/friends/deny?to=" + friendUser,
      headers: { Authorization: "Bearer " + accountService.userToken() },
    };
    axios(config);
    setIsClicked(false);
  };

  return (
    <div>
      {isClicked ? (
        <div>
          <StatsCardFriend />
          <div className="button">
            <button className="button" onClick={goBack}>
              back
            </button>
          </div>
          {isReceice ? (
            <>
              <div className="button">
                <button className="button" onClick={Accept}>
                  Accept
                </button>
              </div>
              <div className="button">
                <button className="button" onClick={deny}>
                  deny
                </button>
              </div>
            </>
          ) : (
            <p></p>
          )}
        </div>
      ) : (
        <>
          {receiveLst.length > 0 && (
            <div className="receive-friend">
              <h2>Receive</h2>
              {receiveLst.map((element: data) => (
                <button
                  key={element.sender}
                  className="button"
                  onClick={() => handleClick(element.senderLogin, true)}
                >
                  {element.sender}
                </button>
              ))}
            </div>
          )}
          {sendingLst.length > 0 && (
            <div className="sending-friend">
              <h2>Send</h2>
              {sendingLst.map((element: data) => (
                <button
                  key={element.receiver}
                  className="button"
                  onClick={() => handleClick(element.receiverLogin, false)}
                >
                  {element.receiver}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
