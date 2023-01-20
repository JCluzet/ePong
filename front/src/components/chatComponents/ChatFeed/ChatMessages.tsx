import { Card} from "antd";
import axios from "axios";
import { SyntheticEvent, useEffect, useState } from "react";
import { DatabaseMessageType, WebSocketMessageType } from "../Models/chan"
import User from "../Models/user";
import CloseIcon from '@mui/icons-material/Close';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import BlockIcon from '@mui/icons-material/Block';
import SendIcon from '@mui/icons-material/Send';
import { io } from "socket.io-client";
import "./chatFeed.css"
import { Comment } from '@ant-design/compatible';
import { accountService } from "../../../hooks/account_service";

type UserBubleProps = {
    userName: string;
    senderId: string;
    avatar: string;
    chanId: number;
}

type Ifriend = {
  login: string;
  name: string;
  nbWins: number;
  nbLoses: number;
  totalGame: number;
  kda: number;
  status: string;
  avatarUrl: string;
}

const {Meta} = Card;
export const UserBuble = (props: UserBubleProps) => {
    const [name, setName] = useState('')
    const [login, setLogin] = useState('')
    const [IsGetProfil, setIsGetProfil] = useState(false);
    const [friendProfil, setFriendProfil] = useState<Ifriend>();

    useEffect(() => {
        let bool = true;
        const getUser = async() => {
            try {
                if (bool) {
                    var config = {
                        method: "get",
                        url: "users/public/" + props.senderId,
                        headers: { Authorization: "Bearer " + localStorage.getItem("token"), "Content-Type": "application/json", },
                        data: JSON.stringify({}),
                    };
                    axios(config)
                        .then(function (response: any) {
                            setName(response.data.name);
                            setLogin(response.data.login);
                        })
                        .catch(function (error: any) {
                        });
                    };                    
            }
            catch (error) {
                console.log("Couldn't fetch user data");
            }
        }
        getUser();
        return () => {bool = false}
    }, [props.senderId]);

    async function addFriend() {
        var config = {
            method: "post",
            url: "/friends/send?to=" + login,
            headers: { Authorization: "Bearer " + accountService.userToken() }
        }
        await axios(config);  
    }

    async function blockUser() {
        console.log(login);
        
        var config = {
            method: "post",
            url: "/block/block?to=" + login,
            headers: { Authorization: "Bearer " + accountService.userToken() }
        }
        await axios(config);  
    }

    async function unblockUser() {
        var config = {
            method: "post",
            url: "/block/unblock?to=" + login,
            headers: { Authorization: "Bearer " + accountService.userToken() }
        }
        await axios(config);  
    }

    async function getFriendProfil() {
        setIsGetProfil(!IsGetProfil);
        if (IsGetProfil){
          var config = {
            method: "get",
            url: "/users/public/" + accountService.userLogin(),
            headers: { Authorization: "Bearer " + accountService.userToken() }
          }
          await axios(config).then(function (response) {
            setFriendProfil(response.data);
          });
        }
    }

    let actions: JSX.Element[];
    if (props.userName === props.senderId) {
        actions = [
            <button className="buttonSmall"><CloseIcon/></button>
        ]
    }
    else {
        actions = [
            // THIS LINK IS NOT LINKED TO THE PROFILES PAGES BUT MAYBE WE DONT NEED IT

            <button className="buttonSmall"onClick={getFriendProfil}><AccountCircleIcon/></button>,
            // <button className="buttonSmall" onClick={(e) => {sendInvite(e, props.senderId)}}><VideogameAssetIcon/></button>,
            <button className="buttonSmall" onClick={addFriend}><PersonAddIcon/></button>,
            <button className="buttonSmall" onClick={blockUser}><BlockIcon/></button>,
            <button className="buttonSmall"><CloseIcon/></button>
        ]
    }

    return (
        <Card hoverable style={{ width: 260}} cover={<img alt='avatar' src={props.avatar}/>} actions={actions}>
            <Meta title={name} />
        </Card>
    )
}

type ChatMessageProps = {
    msg: WebSocketMessageType;
    oneShownPopup: string;
    setOneShownPopup: Function;
    userName: string;
}   

export const ChatMessage = (props: ChatMessageProps) => {
    const content = props.msg.content;
    const timestamp = props.msg.timestamp;
    const [userName, setUserName] = useState('');
    const [avatar, setAvatar] = useState('');
    const [isMute, setIsMute] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isBlocked, setIsBlocked] = useState(false);

    const toggleUserBuble = () => {
        setIsOpen(!isOpen);
        props.setOneShownPopup(props.msg.timestamp);
    };

    useEffect(() => {
        let bool = true;
        const getUser = async() => {
            try {
                if (bool) {
                    var config = {
                        method: "get",
                        url: "users/public/" + props.msg.senderId,
                        headers: { Authorization: "Bearer " + localStorage.getItem("token"), "Content-Type": "application/json", },
                        data: JSON.stringify({}),
                    };
                    axios(config)
                        .then(function (response: any) {
                            setUserName(response.data.name);
                            setAvatar(response.data.avatarUrl);
                        })
                        .catch(function (error: any) {
                        });
                };
            }
            catch (error) {
                console.log("Couldn't fetch user data");
            }
        }
        getUser();
        return () => {bool = false}
    }, [props.msg.senderId]);

    useEffect(() => {
        let bool = true;
        const getIsBlocked = async () => {
            if (bool) {
                var config = {
                    method: "get",
                    url: "block/" + props.userName,
                    headers: { Authorization: "Bearer " + localStorage.getItem("token"), "Content-Type": "application/json", },
                    data: JSON.stringify({}),
                };
                axios(config)
                    .then(function (response: any) {
                        response.data.forEach((user: User) => {
                            if (user.login === props.msg.senderId)
                                setIsBlocked(true);                
                        });
                    })
                    .catch(function (error: any) {
                    });
            };
        }
        getIsBlocked();
        return () => {bool = false};
    }, [props.msg.senderId, props.userName]);


    useEffect(() => {
        let bool = true;
        const getUserType = async() => {
            if (props.msg.chanId !== 0) {
                var config = {
                    method: "post",
                    url: "chat/getUserType",
                    headers: { Authorization: "Bearer " + localStorage.getItem("token"), "Content-Type": "application/json", },
                    data: JSON.stringify({
                        userId: props.msg.senderId, chanId: props.msg.chanId
                    }),
                };
                axios(config)
                .then(function (response: any) {
                    if (bool && response.data === 3) {
                        setIsMute(true);
                    }
                })
                .catch(function (error: any) {
                });
            }
        }
        getUserType();
        return () => {bool = false}
    }, [props.msg.senderId, props.msg.chanId]);

    if (isMute || isBlocked) {
        return (
            <div></div>
        )
    }
    else {
        return (
            <div onClick={toggleUserBuble}>
                <Comment content={content} author={userName} avatar={avatar} datetime={timestamp} />
                {
                    (isOpen ? <UserBuble userName={props.userName} senderId={props.msg.senderId} avatar={avatar} chanId={props.msg.chanId} /> : null)
                }
            </div>
        );
    }
}

type ChannelMessagesProps = {
    currentChannelId: number;
    userName: string;
    setCurrentChannelId: Function;
}

export const ChannelMessages = (props: ChannelMessagesProps) => {
    const [oldMessages, setOldMessages] = useState([]);
    const [newMessages, setNewMessages] = useState<WebSocketMessageType[]>([]);
    const [oneShownPopup, setOneShownPopup] = useState("");
    const [content, setContent] = useState('');
    const [timestamp, setTimestamp] = useState(new Date().toLocaleString());

    useEffect(() => {
        let bool = true;
        const getOldMessages = async () => {
            var config = {
                method: "post",
                url: "messages/getOldMessages",
                headers: { Authorization: "Bearer " + localStorage.getItem("token"), "Content-Type": "application/json", },
                data: JSON.stringify({
                    chanId: props.currentChannelId
                }),
            };
            axios(config)
            .then(function (response: any) {
                if (bool)
                    setOldMessages(response.data);
            })
            .catch(function (error: any) {
            });
        }
        getOldMessages();
        return () => {bool = false};
    }, [props.currentChannelId]);

    useEffect(() => {
        let websock = io(`http://localhost:5001`);
        websock.on('message', async (args) => {
            const data = JSON.parse(JSON.stringify(args));
            if (data.chanId === props.currentChannelId) {
                const new_msg: WebSocketMessageType = {
                    chanId: data.chanId,
                    senderId: data.senderId,
                    content: data.content,
                    timestamp: data.timestamp,
                };
                setNewMessages((prevState: WebSocketMessageType[]) => [...prevState, new_msg]);
            }
        });
        return () => { websock.close(); };
    }, [props.currentChannelId]);

    let checkIfBanned = async(chanId: number) => {
        var config = {
            method: "post",
            url: "chat/isBanned",
            headers: { Authorization: "Bearer " + localStorage.getItem("token"), "Content-Type": "application/json", },
            data: JSON.stringify({
                userId: props.userName, chanId: chanId
            }),
        };
        axios(config)
        .then(function (response: any) {
            if (response.data) {
                alert("You have been banned from this channel")
                props.setCurrentChannelId(0);
            }
        })
        .catch(function (error: any) {
        });
    }

    async function submit(e: SyntheticEvent) {
        e.preventDefault();
        checkIfBanned(props.currentChannelId)
        if (content !== "") {
            var config = {
                method: "post",
                url: "chat/isMuted",
                headers: { Authorization: "Bearer " + localStorage.getItem("token"), "Content-Type": "application/json", },
                data: JSON.stringify({
                    userId: props.userName, chanId: props.currentChannelId
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
                            headers: { Authorization: "Bearer " + localStorage.getItem("token"), "Content-Type": "application/json", },
                            data: JSON.stringify({
                                chanId: props.currentChannelId, senderId: props.userName, content: content, timestamp: timestamp
                            }),
                        };
                        axios(config)
                        .then(function (response: any) {
                        })
                        .catch(function (error: any) {
                        });
                    }
                    catch (error) {
                        console.log("Counldn't send a message");
                    }
                    let websock2 = io(`http://localhost:5001`);
                    websock2.emit("message", {chanId: props.currentChannelId, senderId: props.userName, content: content, timestamp: timestamp});
                }
                else
                    alert("You are currently muted on this channel")
                setContent('');
            })
            .catch(function (error: any) {
            });
        }
    }

    return (
        <div className="chatFeed">
            <div className="chatMessages">
                {oldMessages.filter((msg: WebSocketMessageType) => {
                    return (msg.chanId === props.currentChannelId)}).map((msg: DatabaseMessageType) => (
                    <ChatMessage key={msg.id} msg={msg} oneShownPopup={oneShownPopup} setOneShownPopup={setOneShownPopup} userName={props.userName}></ChatMessage>
                ))}
                {newMessages.filter((msg: WebSocketMessageType) => {
                    return (msg.chanId === props.currentChannelId)}).map((msg: WebSocketMessageType) => (
                    <ChatMessage key={msg.timestamp} msg={msg} oneShownPopup={oneShownPopup} setOneShownPopup={setOneShownPopup} userName={props.userName}></ChatMessage>
                ))}
            </div>
            <div className="inputBar">
                <input id="inputBar" className="input" required value={content} type="text" placeholder="Write your message here" onChange={(e) => setContent(e.target.value)}/>
                <button className="button" onClick={submit}><SendIcon/></button>
            </div>
        </div>
    )
}  
