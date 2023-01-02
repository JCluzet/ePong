import { Col, Divider, Row } from "antd";
import "./chatFeed.css"
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ExitToApp } from '@mui/icons-material';
import { ChannelMessages } from "./ChatMessages";

type LeaveChanProps = {
    userName: string;
    currentChannelId: number;
    setCurrentChannelId: Function;
}

const LeaveChan = (props: LeaveChanProps) => {
    function LeaveChan() {
        const removeUser = async() => {
            try {
                await axios.post('chat/deleteUser', {userId: props.userName, chanId: props.currentChannelId});
                props.setCurrentChannelId(0);
                window.location.reload();
            }
            catch (error) {
                console.log("Couldn't remove user from the channel");
            }
        }
        removeUser();
    }

    return (
        <div>
            <button className="button" onClick={LeaveChan}>
                <ExitToApp fontSize="small"></ExitToApp>
            </button>
        </div>
    )
}

type ChanHeaderProps = {
    userName: string;
    isDirectConv: boolean;
    currentChannelId: number;
    setCurrentChannelId: Function;
}

const ChanHeader = (props: ChanHeaderProps) => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [rediToAdm, setRediToAdm] = useState(false);

    useEffect(() => {
        let bool = true;
        const getName = async () => {
            if (props.currentChannelId) {
                try {
                    const {data} = await axios.post('chat/getChanById', {chanId: props.currentChannelId})
                    if (bool)
                        setName(data.name);
                }
                catch (error) {
                    console.log("Couldn't fetch channel name");
                }
            }
            else {
                setName("Please select a channel in the right menu");
            }
        }
        getName();
        return () => {bool = false};
    }, [props.currentChannelId]);

    useEffect(() => {
        let bool = true;
        const isAdmin = async () => {
            if (props.currentChannelId !== 0) {
                try {
                    const {data} = await axios.post('chat/isAdmin', {userId: props.userName, chanId: props.currentChannelId})
                    if (bool)
                        setIsAdmin(data);
                }
                catch (error) {
                    console.log("Couldn't fetch admin info");
                }
            }
        }
        isAdmin();
        return () => {bool = false};
    }, [props.currentChannelId, props.userName]);

    useEffect(() => {
        if (rediToAdm)
            return (navigate('/social/chat/adminpanel', {state: {currentChannelId: props.currentChannelId, userId: props.userName}}))
    })

    return (
        <div>
            <Divider orientation="center"> {name} </Divider>
            
            <Row>
                <Col style={{padding: "15px"}}>
                    <div>
                        { props.currentChannelId ? ( <LeaveChan userName={props.userName} currentChannelId={props.currentChannelId} setCurrentChannelId={props.setCurrentChannelId} /> ) : null }
                    </div>
                </Col>
                <Col  style={{padding: "15px"}}>
                    <div>
                        { isAdmin && !props.isDirectConv ? (<button className="button" onClick={() => setRediToAdm(true)}>Admin Panel</button>) : null }
                    </div>
                </Col>
            </Row>
        </div>
    )
}

type PrivateGuardProps = {
    currentChannelId:number;
    passwordSuccess: boolean;
    setPasswordSuccess: Function;
}

const PrivateGuard = (props: PrivateGuardProps) => {
    const [input, setInput] = useState('');
    const [invalid, setInvalid] = useState(false);

    async function checkInput() {
        try {
            const {data} = await axios.post('chat/checkPassword', {chanId: props.currentChannelId, password: input});
            if (data === false) {
                setInvalid(true);
                props.setPasswordSuccess(false);
            }
            else {
                setInvalid(false);
                props.setPasswordSuccess(true);
            }
        }
        catch (error) {
            console.log("Counld't fetch channel data (password)");
        }
    }

    return (
        <div className=".container-home">
            <label htmlFor="exampleInputPassword1">Password</label>
            <input type="password" id="exampleInputPassword1" placeholder="Password" onChange={e => setInput(e.target.value)}/>
            <button className ="button" type="submit" onClick={checkInput}>Submit</button>
            { invalid? <p className="registerSubTitle">Invalid password, please try again</p> : <p/>  }
        </div>
    )
}

type ChatFeedProps = {
    userName: string;
    currentChannelId: number;
    setCurrentChannelId: Function;
}

export const ChatFeed = (props: ChatFeedProps) => {
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const [isPrivate, setIsPrivate] = useState(false);
    const [isDirectConv, setIsDirectConv] = useState(false);

    useEffect(() => {
        let bool = true;
        const getChanInfo = async() => {
            try {
                const {data} = await axios.post('chat/getChanById', {chanId: props.currentChannelId});
                if (bool) {
                    setIsDirectConv(data.isDirectConv);
                    setIsPrivate(data.isPrivate);
                }
            }
            catch (error) {
                console.log("Failed to catch channel info");
            }
        }
        getChanInfo();
        return () => {bool = false}
    }, [props.currentChannelId])

    return (
        <div style={{width: "90%", height: "100%"}}>
            {isPrivate && !passwordSuccess ? (
                <PrivateGuard currentChannelId={props.currentChannelId} passwordSuccess={passwordSuccess} setPasswordSuccess={setPasswordSuccess} />
            ) : (
            <>
                <ChanHeader userName={props.userName} isDirectConv={isDirectConv} currentChannelId={props.currentChannelId} setCurrentChannelId={props.setCurrentChannelId} />
                { props.currentChannelId ? 
                        <ChannelMessages currentChannelId={props.currentChannelId} userName={props.userName} setCurrentChannelId={props.setCurrentChannelId}/>
                    : null
                    }
            </>
        )}
        </div>
    )
}