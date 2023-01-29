import axios from "axios";
import React, { useEffect, useState } from "react";
import { accountService } from "../hooks/account_service";
import StatsCardFriend from "./StatsCardFriend";

type data = {
  sender: string;
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
          <div className="receive-friend">
            <h2>Receive</h2>
            {receiveLst.map((element: data) => (
              <div
                className="container-social"
                onClick={() => handleClick(element.sender, true)}
              >
                <p>{element.sender}</p>
                <p>{element.status}</p>
              </div>
            ))}
          </div>
          <div className="sending-friend">
            <h2>Send</h2>
            {sendingLst.map((element: data) => (
              <div
                className="container-social"
                onClick={() => handleClick(element.receiver, false)}
              >
                <p>{element.receiver}</p>
                <p>{element.status}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
