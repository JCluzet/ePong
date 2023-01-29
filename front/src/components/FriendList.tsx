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

export default function FriendList() {
  const [Name, setName] = useState("");
  const [Img, setImg] = useState("");
  const [Online, setStatus] = useState("");
  const [loginUser, setLoginUser] = useState("");
  const [isgoHistoric, setIsgoHistoric] = useState(false);
  const [isClicked, setClick] = useState(false);
  const [allUsers, setAllUsers] = useState<Array<EUser>>([]);
  const [acceptList, setAcceptList] = useState(false);
  const [isGoAdd, setIsGoAdd] = useState(false);

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
    } catch (error) {}

    setTimeout(getUserInfo, 1000000);
  };

  useEffect(() => {}, [Name, Img, Online]);

  const handleClick = (
    login: string,
    name: string,
    image: string,
    status: string
  ) => {
    localStorage.setItem("friendName", login);
    setName(name);
    setLoginUser(name);
    setImg(image);
    setStatus(status);
    setClick(true);
  };

  const goBack = () => setClick(false);

  const goAcceptList = () => setAcceptList(true);

  const goFriendList = () => {
    setAcceptList(false);
    setIsGoAdd(false);
  };

  const goAdd = () => setIsGoAdd(true);

  return (
    <div className="container-friendlist">
      <div className="container-stats-friendlist">
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
                <div key={user.login}
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
                        alt={user.name}
                      />
                    </div>
                    <div className="column-profile">{user.name}</div>
                    <div className="column-profile">
                      {(() => {
                        if (user.status === "online") {
                          return <p className="green-circle"></p>;
                        } else if (user.status === "ingame") {
                          return <p className="orange-circle"> </p>;
                        } else {
                          return <p className="red-circle"></p>;
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
                    <button
                      className="button"
                      onClick={() => {
                        setIsgoHistoric(!isgoHistoric);
                      }}
                    >
                      Historic
                    </button>
                  </div>
                  <div className="column">
                    <button
                      className="button"
                      onClick={() => {
                        window.location.href = "/social/chat";
                      }}
                    >
                      Chat
                    </button>
                  </div>
                  <div className="column">
                    {Online === "online" ? (
                      <button
                        className="button"
                        onClick={() =>
                          (window.location.href =
                            "/play?vs=" + loginUser + "&gameMode=classic")
                        }
                      >
                        Challenge
                      </button>
                    ) : (
                      <p></p>
                    )}
                  </div>
                  <div className="column">
                    {Online === "ingame" ? (
                      <button
                        className="button"
                        onClick={() => {
                          window.location.href = "/spectate?login=" + loginUser;
                        }}
                      >
                        Spectate
                      </button>
                    ) : (
                      <p></p>
                    )}
                  </div>
                </div>
                <div className="column">
                  <h2> {Name} </h2>
                  {(() => {
                    if (Online === "online") {
                      return <p className="green-circle"></p>;
                    } else if (Online === "ingame") {
                      return <p className="orange-circle"> </p>;
                    } else {
                      return <p className="red-circle"></p>;
                    }
                  })()}
                  <StatsCardFriend />
                </div>
                <div className="row">
                  {isgoHistoric ? <HistoricFriend /> : <p></p>}
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
