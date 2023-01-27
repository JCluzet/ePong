import React from "react";
import { accountService } from "../hooks/account_service";
import { useEffect, useState } from "react";
import "../styles/list.css";
import "../styles/social.css";
import axios from "axios";
import EUser from "./chatComponents/Models/user";
import StatsCardFriend from "./StatsCardFriend";
import HistoricFriend from "./historicCardFriend";
import AcceptFriendList from "./AcceptFriendList";
import AddFriendList from "./AddFriendList";
import { UserBuble } from "./chatComponents/ChatFeed/ChatMessages";


export default function FriendList() {
  const [Name, setName] = useState("");
  const [Img, setImg] = useState("");
  const [Online, setStatus] = useState("");
  const [isgoHistoric, setIsgoHistoric] = useState(false);
  const [isGoChat, setIsGoChat] = useState(false);
  const [isClicked, setClick] = useState(false);
  const [allUsers, setAllUsers] = useState<Array<EUser>>([]);
  const [acceptList, setAcceptList] = useState(false);
  const [isGoAdd, setIsGoAdd] = useState(false);
  const [isgoSpectate, setisgoSpectate] = useState(false);

  useEffect(() => {
    getUserInfo();
  });
  
  const getUserInfo = async () => {
      try {
      var config = {
          method: "get",
          url: "/friends",
          headers: { Authorization: "Bearer " + accountService.userToken() },
        };
        await axios(config).then(function (response) {
            setAllUsers(response.data);
        });
    } catch (error) {
        console.log("Failed to fetch all users");
    }
    console.log(allUsers);
    
    setTimeout(getUserInfo, 1000000);
};

  useEffect(() => {}, [Name, Img, Online]);

  const handleClick = (
    login: string,
    name: string,
    image: string,
    status: string
  ) => {
    console.log(`name ${name}`);
    localStorage.setItem("friendName", login);
    setName(name);
    setImg(image);
    setStatus(status);
    setClick(true);
  };

//   const onToggle = () => setIsToggled(!isToggled);

  const goBack = () => setClick(false);

  const goAcceptList = () => setAcceptList(true);

  const goFriendList = () => {
    setAcceptList(false);
    setIsGoAdd(false);
  };

  const goAdd = () => setIsGoAdd(true);

  const goHistoric = () => {
    setIsgoHistoric(!isgoHistoric);
    setIsGoChat(false);
  };

  const goSpectate = () => {
    setisgoSpectate(!isgoSpectate);
    setIsGoChat(false);
    setIsgoHistoric(false);
  };

  const goChat = () => {
    setIsGoChat(!isGoChat);
    setIsgoHistoric(false);
  };

  return (
    <div className="container-friendlist">
      <div className="container-stats-friendlist">
        {/* <section> */}
        {acceptList || isGoAdd ? (
          acceptList ? (
            <h2>Pending Request</h2>
          ) : (
            <h2>Players List</h2>
          )
        ) : (
          <div className="text-title-container">Your Friends</div>
        )}
        {isClicked ? (
          <div className="">
            <button className="button" onClick={goBack}>
              back
            </button>
          </div>
        ) : acceptList || isGoAdd ? (
          <div className="">
            <button className="button" onClick={goFriendList}>
              Back
            </button>
          </div>
        ) : (
          <div className="dispatch-button">
            <div className="">
              <button className="button" onClick={goAcceptList}>
                Pending Request
              </button>
            </div>
            <div className="">
              <button className="button" onClick={goAdd}>
                Players List
              </button>
            </div>
          </div>
        )}
        <div className="content">
          <div className="scrollable-div" style={{ padding: 10 }}>
            {isClicked ? (
              <p></p>
            ) : acceptList ? (
              <AcceptFriendList />
            ) : isGoAdd ? (
              <AddFriendList />
            ) : (
              allUsers.map((user: EUser) => (
                <div
                  className="container-social"
                  onClick={() =>
                    handleClick(
                      user.login,
                      user.name,
                      user.avatarUrl,
                      user.status
                    )
                  }
                >
                  <div className="row">
                    <div className="column">
                      <img
                        src={user.avatarUrl}
                        className="circle-img"
                        alt={user.name}/>
                    </div>
                    <div className="column-profile">
                      {user.name}
                    </div>
                    <div className="column-profile">
                    {(() => {
                        if (user.status === "online") {
                          return (
                            <p className="green-circle"></p>
                          )
                        } else if (user.status === "ingame") {
                          return (
                            <p className="orange-circle"> </p>
                          )
                        } else {
                          return (
                            <p className="red-circle"></p>
                          )
                        }
                      })()}
                      {user.status === "ingame" ? <p>in game</p> : <p></p>}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="main">
            {isClicked ? (
              <div>
                <div className="row">
                  <div className="column">
                    <img
                      src={Img}
                      alt={"profile-circle"}
                      className="circle-img"
                      style={{ height: 100, width: 100 }}
                    />
                  </div>
                  <div className="column">
                    <button className="button" onClick={goHistoric}>
                      Historic
                    </button>
                  </div>
                  <div className="column">
                    <button className="button" onClick={goChat}>
                      Chat
                    </button>
                  </div>
                  <div className="column">
                    {Online === "online" ? (
                        <button className="button">Challenge</button>
                    ) : (
                      <p></p>
                    )}
                  </div>
                  <div className="column">
                    {Online === "ingame" ? (
                        <button className="button" onClick={goSpectate}>Spectate</button>
                    ) : (
                      <p></p>
                    )}
                  </div>
                </div>
                <div className="column">
                  <h2> {Name} </h2>
                  {(() => {
                        if (Online === "online") {
                          return (
                            <p className="green-circle"></p>
                          )
                        } else if (Online === "ingame") {
                          return (
                            <p className="orange-circle"> </p>
                          )
                        } else {
                          return (
                            <p className="red-circle"></p>
                          )
                        }
                      })()}
                  <StatsCardFriend />
                </div>
                <div className="row">
                  {isgoHistoric ? <HistoricFriend /> : <p></p>}
                  {isGoChat ? (window.location.href = "/social/chat") : <p></p>}
                  {isgoSpectate ? (window.location.href = "/spectate?login=" + Name) : <p></p>}
                </div>
              </div>
            ) : (
              <p></p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
