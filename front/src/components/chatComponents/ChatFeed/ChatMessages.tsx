import React from "react";
import { Card} from "antd";
import axios from "axios";
import { SyntheticEvent, useEffect, useState } from "react";
import { DatabaseMessageType, WebSocketMessageType } from "../Models/chan"
import User from "../Models/user";
import CloseIcon from '@mui/icons-material/Close';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
import BlockIcon from '@mui/icons-material/Block';
import { Link } from "react-router-dom";
import SendIcon from '@mui/icons-material/Send';
import { io } from "socket.io-client";
import "./chatFeed.css"
import { Comment } from '@ant-design/compatible';

type UserBubleProps = {
    userName: string;
    senderId: string;
    avatar: string;
    chanId: number;
}

const {Meta} = Card;
export const UserBuble = (props: UserBubleProps) => {
    const [name, setName] = useState('')
    const [login, setLogin] = useState('')

    useEffect(() => {
        let bool = true;
        const getUser = async() => {
            try {
                if (bool) {
                    const {data} = await axios.get('users/public/'+ props.senderId);
                    setName(data.name);
                    setLogin(data.login);
                }
            }
            catch (error) {
                console.log("Couldn't fetch user data");
            }
        }
        getUser();
        return () => {bool = false}
    }, [props.senderId]);

    async function addFriend(event: SyntheticEvent) {
        event.preventDefault();
        // INSERT CALL TO ADD SOMEONE AS A FRIEND
    }

    const sendInvite = async (e: SyntheticEvent, id: string) => {
        e.preventDefault();
        // INSERT CALL TO INVITE SOMEONE TO A PONG GAME
    }

    const blockUser = async (e: SyntheticEvent, id: string) => {
        e.preventDefault();
        // INSERT CALL TO BLOCK SOMEONE
    }

    let actions: JSX.Element[];
    if (props.userName === props.senderId) {
        actions = [
            <button className="buttonSmall"><CloseIcon/></button>
        ]
    }
    else {
        actions = [
            <Link to={"/social/publicprofile/" + login} type="button" className="customButton">
                <button className="buttonSmall"><AccountCircleIcon/></button>,
            </Link>,
            <button className="buttonSmall" onClick={(e) => {sendInvite(e, props.senderId)}}><VideogameAssetIcon/></button>,
            <button className="buttonSmall" onClick={addFriend}><PersonAddIcon/></button>,
            <button className="buttonSmall" onClick={(e) => {blockUser(e, props.senderId)}}><BlockIcon/></button>,
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
                const {data} = await axios.get('users/public/' + props.msg.senderId);
                if (bool) {
                    setUserName(data.name);
                    setAvatar(data.avatarUrl);
                }
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
            const {data} = await axios.get('block/' + props.userName);
            data.forEach((user: User) => {
                if (bool && user.login === props.msg.senderId)
                    setIsBlocked(true);                
            });
        }
        getIsBlocked();
        return () => {bool = false};
    }, [props.msg.senderId, props.userName]);


    useEffect(() => {
        let bool = true;
        const getUserType = async() => {
            if (props.msg.chanId !== 0) {
                try {
                    const {data} = await axios.post('chat/getUserType', {userId: props.msg.senderId, chanId: props.msg.chanId});
                    if (bool && data === 3) {
                        setIsMute(true);
                    }
                }
                catch (error) {
                    console.log("Couldn't fetch user state");
                }
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
            try {
                const {data} = await axios.post('messages/getOldMessages', {chanId: props.currentChannelId});
                if (bool)
                    setOldMessages(data);
            }
            catch (error) {
                console.log("Counldn't fetch old messages for this channel");
            }
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
        try {
            const {data} = await axios.post("chat/isBanned", {userId: props.userName, chanId: chanId});
            if (data === true) {
                alert("You have been banned from this channel")
                props.setCurrentChannelId(0);
            }
        }
        catch (error) {
            console.log("Couldn't check if user was banned")
        }
    }

    async function submit(e: SyntheticEvent) {
        e.preventDefault();
        checkIfBanned(props.currentChannelId)
        if (content !== "") {
            const {data} = await axios.post("chat/isMuted", {userId: props.userName, chanId: props.currentChannelId});
            if (data === false) {
                try {
                    setTimestamp(new Date().toLocaleString());
                    await axios.post('messages/newMessage', {chanId: props.currentChannelId, senderId: props.userName, content: content, timestamp: timestamp});
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
