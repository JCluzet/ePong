import { Card } from "antd";
import axios from "axios";
import { SyntheticEvent, useEffect, useState } from "react";
import { DatabaseMessageType, WebSocketMessageType } from "../Models/chan";
import User from "../Models/user";
import CloseIcon from "@mui/icons-material/Close";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import BlockIcon from "@mui/icons-material/Block";
import SendIcon from "@mui/icons-material/Send";
import { io } from "socket.io-client";
import "./chatFeed.css";
import Button from "@mui/material/Button";
import { Comment } from "@ant-design/compatible";
import { accountService } from "../../../hooks/account_service";
import { toast } from "react-toastify";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
let websock2 = io(`http://localhost:5001`);

type UserBubleProps = {
  userName: string;
  senderId: string;
  avatar: string;
  chanId: number;
};

const checkifKick = async (chanId: number) => {
  var config = {
    method: "post",
    url: "chat/getChanUsers",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      chanId: chanId,
    }),
  };
  axios(config)
    .then(function (response: any) {
      var here = false;
      response.data.forEach((user: any) => {
        if (user.login === accountService.userLogin()) {
          here = true;
        }
      });
      if (!here) {
        window.location.reload();
      }
    })
    .catch(function (error: any) {});

  var config3 = {
    method: "post",
    url: "chat/isBanned",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      userId: accountService.userLogin(),
      chanId: chanId,
    }),
  };
  let response = await axios(config3);
  if (response.data) {
    toast.error("You have been banned from this channel");
    window.location.reload();
  }

  setTimeout(() => {
    checkifKick(chanId);
  }, 7000);
};

const checkIfBannedChan = async (username: string): Promise<boolean> => {
  try {
    const config = {
      method: "get",
      url: "block/" + accountService.userLogin(),
      headers: {
        Authorization: "Bearer " + accountService.userToken(),
        "Content-Type": "application/json",
      },
    };
    const response = await axios(config);
    if (response.data.includes(username)) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

export async function kickUser(userlogin: string, chanId: number) {
  var config = {
    method: "post",
    url: "chat/deleteUser",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      userId: userlogin,
      chanId: chanId,
    }),
  };
  axios(config)
    .then(function (response: any) {
      window.location.reload();
    })
    .catch(function (error: any) {});
}

const { Meta } = Card;
export const UserBuble = (props: UserBubleProps) => {
  const [name, setName] = useState("");
  const [login, setLogin] = useState("");

  useEffect(() => {
    let bool = true;
    const getUser = async () => {
      try {
        if (bool) {
          var config = {
            method: "get",
            url: "users/public/" + props.senderId,
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
              "Content-Type": "application/json",
            },
            data: JSON.stringify({}),
          };
          axios(config)
            .then(function (response: any) {
              setName(response.data.name);
              setLogin(response.data.login);
            })
            .catch(function (error: any) {});
        }
      } catch (error) {}
    };
    getUser();
    return () => {
      bool = false;
    };
  }, [props.senderId]);

  async function addFriend() {
    var config = {
      method: "post",
      url: "/friends/send?to=" + login,
      headers: { Authorization: "Bearer " + accountService.userToken() },
    };
    await axios(config)
      .then(function (response) {
        if (response.data === false)
          toast.error("Your already friend/send request to this user");
        else toast.success(login + " request send");
      })
      .catch(function (error) {
        toast.error("Friend request failed.");
      });
  }

  async function blockUser() {
    var isBlockedvar = false;
    var config = {
      method: "post",
      url: "/block/block?to=" + login,
      headers: { Authorization: "Bearer " + accountService.userToken() },
    };
    await axios(config)
      .then(function (response) {
        isBlockedvar = true;
        toast.success("Successfuly blocked");
      })
      .catch(function (error) {});
    return isBlockedvar;
  }

  let actions: JSX.Element[];
  if (props.userName === props.senderId) {
    actions = [
      <button className="buttonSmall">
        <CloseIcon />
      </button>,
    ];
  } else {
    actions = [
      <button
        className="buttonSmall"
        onClick={() =>
          (window.location.href = "/play?vs=" + name + "&gameMode=classic")
        }
      >
        <SportsEsportsIcon />
      </button>,
      <button className="buttonSmall" onClick={addFriend}>
        <PersonAddIcon />
      </button>,
      <button className="buttonSmallRed" onClick={blockUser}>
        <BlockIcon />
      </button>,
      <button className="buttonSmall">
        <CloseIcon />
      </button>,
    ];
  }

  return (
    <Card
      hoverable
      style={{ width: 260 }}
      cover={<img alt="avatar" src={props.avatar} />}
      actions={actions}
    >
      <Meta title={name} />
    </Card>
  );
};

type ChatMessageProps = {
  msg: WebSocketMessageType;
  oneShownPopup: string;
  setOneShownPopup: Function;
  userName: string;
};

export const ChatMessage = (props: ChatMessageProps) => {
  const content = props.msg.content;
  const timestamp = props.msg.timestamp;
  const [isShown, setIsShown] = useState(true);
  const [userName, setUserName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [login, setLogin] = useState("");
  const [isMute, setIsMute] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  const toggleUserBuble = () => {
    setIsOpen(!isOpen);
    props.setOneShownPopup(props.msg.timestamp);
  };

  useEffect(() => {
    let bool = true;
    const getUser = async () => {
      try {
        if (bool) {
          var config = {
            method: "get",
            url: "users/public/" + props.msg.senderId,
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
              "Content-Type": "application/json",
            },
            data: JSON.stringify({}),
          };
          axios(config)
            .then(function (response: any) {
              setUserName(response.data.name);
              setLogin(response.data.login);
              setAvatar(response.data.avatarUrl);
            })
            .catch(function (error: any) {});
        }
      } catch (error) {}
    };
    getUser();
    return () => {
      bool = false;
    };
  }, [props.msg.senderId]);

  useEffect(() => {
    let bool = true;
    const getIsBlocked = async () => {
      if (bool) {
        var config = {
          method: "get",
          url: "block/" + props.userName,
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
          data: JSON.stringify({}),
        };
        axios(config)
          .then(function (response: any) {
            response.data.forEach((user: User) => {
              if (user.login === props.msg.senderId) setIsBlocked(true);
            });
          })
          .catch(function (error: any) {});
      }
    };
    getIsBlocked();
    return () => {
      bool = false;
    };
  }, [props.msg.senderId, props.userName]);

  async function unblockUser() {
    var isBlockedvar = true;
    var config = {
      method: "post",
      url: "/block/unblock?to=" + login,
      headers: { Authorization: "Bearer " + accountService.userToken() },
    };
    await axios(config)
      .then(function (response) {
        window.location.reload();
      })
      .catch(function (error) {});
    return isBlockedvar;
  }

  useEffect(() => {
    let bool = true;
    const getUserType = async () => {
      if (props.msg.chanId !== 0) {
        var config = {
          method: "post",
          url: "chat/getUserType",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
          data: JSON.stringify({
            userId: props.msg.senderId,
            chanId: props.msg.chanId,
          }),
        };
        axios(config)
          .then(function (response: any) {
            if (bool && response.data === 3) {
              setIsMute(true);
            }
          })
          .catch(function (error: any) {});
      }
    };
    getUserType();
    return () => {
      bool = false;
    };
  }, [props.msg.senderId, props.msg.chanId]);

  if (isMute || isBlocked) {
    return <div></div>;
  } else {
    checkIfBannedChan(login).then((isBanned) => {
      if (isBanned) {
        setIsShown(false);
        return <div>Banned</div>;
      } else {
        setIsShown(true);
      }
    });
    return (
      <div onClick={toggleUserBuble}>
        {isShown ? (
          <Comment
            content={content}
            author={userName}
            avatar={avatar}
            datetime={timestamp}
          />
        ) : (
          <div className="message-from-ban">
            This message is from a banned user
            <br />
            Click to unblock
          </div>
        )}
        {isOpen && isShown ? (
          <UserBuble
            userName={props.userName}
            senderId={props.msg.senderId}
            avatar={avatar}
            chanId={props.msg.chanId}
          />
        ) : null}

        {isOpen && !isShown ? (
          <div>
            <Button onClick={unblockUser} variant="outlined" color="error">
              Unblock {userName}
            </Button>
          </div>
        ) : null}
      </div>
    );
  }
};

type ChannelMessagesProps = {
  currentChannelId: number;
  userName: string;
  setCurrentChannelId: Function;
};

export const ChannelMessages = (props: ChannelMessagesProps) => {
  const [oldMessages, setOldMessages] = useState([]);
  const [newMessages, setNewMessages] = useState<WebSocketMessageType[]>([]);
  const [oneShownPopup, setOneShownPopup] = useState("");
  const [content, setContent] = useState("");
  const [timestamp, setTimestamp] = useState(new Date().toLocaleString());
  checkifKick(props.currentChannelId);

  useEffect(() => {
    let bool = true;
    const getOldMessages = async () => {
      var config = {
        method: "post",
        url: "messages/getOldMessages",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          chanId: props.currentChannelId,
        }),
      };
      axios(config)
        .then(function (response: any) {
          if (bool) setOldMessages(response.data);
        })
        .catch(function (error: any) {});
    };
    getOldMessages();
    return () => {
      bool = false;
    };
  }, [props.currentChannelId]);

  useEffect(() => {
    let websock = io(`http://localhost:5001`);
    websock.on("message", async (args) => {
      const data = JSON.parse(JSON.stringify(args));
      if (data.chanId === props.currentChannelId) {
        const new_msg: WebSocketMessageType = {
          chanId: data.chanId,
          senderId: data.senderId,
          content: data.content,
          timestamp: data.timestamp,
        };
        setNewMessages((prevState: WebSocketMessageType[]) => [
          ...prevState,
          new_msg,
        ]);
      }
    });
    return () => {
      websock.close();
    };
  }, [props.currentChannelId]);

  let checkIfBanned = async (chanId: number) => {
    let isBanned = false;
    let response1;
    var config = {
      method: "post",
      url: "chat/getChanUsers",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        chanId: chanId,
      }),
    };
    response1 = await axios(config);
    if (response1.data) {
      if (response1.data.length !== 2) {
        return false;
      }
      let otherUser;
      for (let i = 0; i < response1.data.length; i++) {
        if (response1.data[i].login !== props.userName) {
          otherUser = response1.data[i];
        }
      }
      var config2 = {
        method: "get",
        url: "block/" + otherUser.login,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      };
      let response = await axios(config2);
      if (response.data) {
        if (response.data.includes(props.userName)) {
          toast.error("You have been banned from this person");
          isBanned = true;
        }
      }
    }

    var config3 = {
      method: "post",
      url: "chat/isBanned",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        userId: props.userName,
        chanId: chanId,
      }),
    };
    let response = await axios(config3);
    if (response.data) {
      toast.error("You have been banned from this channel");
      props.setCurrentChannelId(0);
    }
    return isBanned;
  };

  async function submit(e: SyntheticEvent) {
    e.preventDefault();
    let isBanned = await checkIfBanned(props.currentChannelId);
    if (isBanned) return;
    if (content !== "") {
      var config = {
        method: "post",
        url: "chat/isMuted",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          userId: props.userName,
          chanId: props.currentChannelId,
        }),
      };
      axios(config)
        .then(function (response: any) {
          if (response.data === false) {
            try {
              setTimestamp(new Date().toLocaleString());
              var config = {
                method: "post",
                url: "messages/newMessage",
                headers: {
                  Authorization: "Bearer " + localStorage.getItem("token"),
                  "Content-Type": "application/json",
                },
                data: JSON.stringify({
                  chanId: props.currentChannelId,
                  senderId: props.userName,
                  content: content,
                  timestamp: timestamp,
                }),
              };
              axios(config)
                .then(function (response: any) {})
                .catch(function (error: any) {});
            } catch (error) {}
            websock2.emit("message", {
              chanId: props.currentChannelId,
              senderId: props.userName,
              content: content,
              timestamp: timestamp,
            });
          } else toast.error("You are currently muted on this channel");
          setContent("");
        })
        .catch(function (error: any) {});
    }
  }

  return (
    <div className="chatFeed">
      <div className="chatMessages">
        {oldMessages
          .filter((msg: WebSocketMessageType) => {
            return msg.chanId === props.currentChannelId;
          })
          .map((msg: DatabaseMessageType) => (
            <ChatMessage
              key={msg.id}
              msg={msg}
              oneShownPopup={oneShownPopup}
              setOneShownPopup={setOneShownPopup}
              userName={props.userName}
            ></ChatMessage>
          ))}

        {newMessages
          .filter((msg: WebSocketMessageType) => {
            return msg.chanId === props.currentChannelId;
          })
          .map((msg: WebSocketMessageType) => (
            <ChatMessage
              key={msg.timestamp}
              msg={msg}
              oneShownPopup={oneShownPopup}
              setOneShownPopup={setOneShownPopup}
              userName={props.userName}
            ></ChatMessage>
          ))}
      </div>
      <div className="inputBar">
        <input
          id="inputBar"
          className="input"
          required
          value={content}
          type="text"
          placeholder="Write your message here"
          onChange={(e) => setContent(e.target.value)}
        />
        <button className="button" onClick={submit}>
          <SendIcon />
        </button>
      </div>
    </div>
  );
};
