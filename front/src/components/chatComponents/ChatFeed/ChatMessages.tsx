import { Card } from "antd";
import axios from "axios";
import { SyntheticEvent, useEffect, useState } from "react";
import { DatabaseMessageType, WebSocketMessageType } from "../Models/chan";
import User from "../Models/user";
import CloseIcon from "@mui/icons-material/Close";
// import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import BlockIcon from "@mui/icons-material/Block";
import SendIcon from "@mui/icons-material/Send";
import { io } from "socket.io-client";
import "./chatFeed.css";
import { Comment } from "@ant-design/compatible";
import { accountService } from "../../../hooks/account_service";
import { toast } from "react-toastify";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
// import { isBlock } from "typescript";

type UserBubleProps = {
    userName: string;
    senderId: string;
    avatar: string;
    chanId: number;
};

// type Ifriend = {
    // 	login: string;
    // 	name: string;
    // 	nbWins: number;
    // 	nbLoses: number;
    // 	totalGame: number;
    // 	kda: number;
    // 	status: string;
    // 	avatarUrl: string;
    // }
    
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
            console.dir(response.data);
            console.log("checkIfBannedChan:" + username);
            if (response.data.includes(username))
            {
                // console.log("BAN!");
                return true;
            }
            return false;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
    
    const { Meta } = Card;
    export const UserBuble = (props: UserBubleProps) => {
        const [name, setName] = useState("");
        const [login, setLogin] = useState("");
        // const [IsGetProfil, setIsGetProfil] = useState(false);
        // const [friendProfil, setFriendProfil] = useState<Ifriend>();
        // const [isBlocked, setIsBlocked] = useState(false);
        
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
    } catch (error) {
        console.log("Couldn't fetch user data");
    }
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
    await axios(config);
}

async function blockUser() {
    var isBlockedvar = false;
    console.log(login);
    var config = {
        method: "post",
        url: "/block/block?to=" + login,
        headers: { Authorization: "Bearer " + accountService.userToken() },
    };
    await axios(config)
    .then(function (response) {
        isBlockedvar = true;
        // setIsBlocked(true);
        toast.success(login + " is now blocked");
        console.log("Blocking success.");
    })
    .catch(function (error) {
        console.log("Blocking failed.");
    });
    // setIsBlocked(isBlockedvar);
    return isBlockedvar;
}

async function unblockUser() {
    // setIsBlocked(false);
    var isBlockedvar = true;
    var config = {
        method: "post",
        url: "/block/unblock?to=" + login,
        headers: { Authorization: "Bearer " + accountService.userToken() },
    };
    await axios(config)
    .then(function (response) {
        // setIsBlocked(false);
        toast.success(login + " is now unblocked");
        console.log("Unblocking success.");
    })
    .catch(function (error) {
        console.log("Unblocking failed.");
    });
    // setIsBlocked(isBlockedvar);
    return isBlockedvar;
}

// async function getFriendProfil() {
//     setIsGetProfil(!IsGetProfil);
//     if (IsGetProfil) {
//         var config = {
//             method: "get",
//             url: "/users/public/" + accountService.userLogin(),
//             headers: { Authorization: "Bearer " + accountService.userToken() },
//         };
//         await axios(config).then(function (response) {
//             // setFriendProfil(response.data);
//         });
//         console.log("Get friend profil success.");
//     }
// }

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
        onClick={() => (window.location.href = "/play?vs=" + login)}
        >
        <SportsEsportsIcon />
      </button>,
      <button className="buttonSmall" onClick={addFriend}>
        <PersonAddIcon />
      </button>,
      <button className="buttonSmallGreen" onClick={unblockUser}>
        <BlockIcon />
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
              setAvatar(response.data.avatarUrl);
            })
            .catch(function (error: any) {});
        }
      } catch (error) {
        console.log("Couldn't fetch user data");
      }
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
    return (
      <div>
        <button
          className="buttonSmallGreen"
          onClick={() => setIsBlocked(false)}
        >
          <BlockIcon />
        </button>
      </div>
    );
  } else {
      checkIfBannedChan(userName).then(isBanned => {
        if (isBanned) {
            console.log("L'utilisateur est banni");
            setIsShown(false);
            return (
                <div>
                    Banned
                </div>
            );
        } else {
            setIsShown(true);
            console.log("L'utilisateur n'est pas banni");
        }
    });
    return (
      <div onClick={toggleUserBuble}>
        <Comment
          content={isShown ? content : "[BAN]"}
          author={userName}
          avatar={avatar}
          datetime={timestamp}
        />
        {isOpen ? (
          <UserBuble
            userName={props.userName}
            senderId={props.msg.senderId}
            avatar={avatar}
            chanId={props.msg.chanId}
          />
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
//   const [isBlocked, setIsBlocked] = useState(false);

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
    if (chanId === 1) {
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
        // find the other user, not me
        console.log("Toutes les personnes de la conv:");
        console.dir(response1.data);
        let otherUser;
        // find the user that is not me (check login because id is not unique)
        for (let i = 0; i < response1.data.length; i++) {
          if (response1.data[i].login !== props.userName) {
            otherUser = response1.data[i];
          }
        }
        console.log("La personne avec qui tu chat: " + otherUser.login);
        // check if i am in the list of banned users from the other user with request /block/LOGIN
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
          // if i am in the list of banned users, then i am banned
          if (response.data.includes(props.userName)) {
            toast.error("Sorry, You have been banned from this person");
            isBanned = true;
          }
          console.log(
            "La liste des user bloqué appartenant a " +
              otherUser.login +
              ": " +
              response.data
          );
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
      //   isBanned = true;
    }
    return isBanned;
  };

  async function submit(e: SyntheticEvent) {
    e.preventDefault();
    let isBanned = await checkIfBanned(props.currentChannelId);
    console.log("La personne est banie ? " + isBanned);
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
            } catch (error) {
              console.log("Counldn't send a message");
            }
            let websock2 = io(`http://localhost:5001`);
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
