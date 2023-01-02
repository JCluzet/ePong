import { Col, Divider, Row } from "antd";
import axios from "axios";
import { SyntheticEvent, useEffect, useState } from "react";
import { Chan } from "../Models/chan";
import LockIcon from '@mui/icons-material/Lock';
import { Link } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import { Button } from "@mui/material";

type SideBarChannelsProps = {
    setCurrentChannelId: Function;
    userName: string;
};

const SideBarChannels = (props: SideBarChannelsProps) => {
    const [chans, setChans] = useState<Array<Chan>>([])
    useEffect(() => {
        let bool = true;
        const getChans = async () => {
            try {
                const {data} = await axios.post('chat/getChansByUserId', {userId: props.userName})
                if (data) {
                    let res: Chan[];
                    res = data.filter((channel: any) => !channel.isDirectConv);
                    if (bool)
                        setChans(res);
                }
            }
            catch (error) {
                console.log("Couldn't fetch channels where user belongs");
            }
        }
        getChans();
        return () => {bool = false}
    }, [props.userName]);

    let checkIfBanned = async(e: SyntheticEvent, chanId: number) => {
        e.preventDefault();
        if (chanId !== 0) {
            try {
                const {data} = await axios.post("chat/isBanned", {userId: props.userName, chanId: chanId});
                if (data === true)
                    alert("You have been banned from this channel")
                else
                    props.setCurrentChannelId(chanId)
            }
            catch (error) {
                console.log("Couldn't check if user was banned")
            }
        }
    }

    return (
        <div>
            <Divider orientation={"center"}>
                Group Messages
            </Divider>
            <Col>
                {chans.map((chan: Chan) => (
                    <Row justify="center" key={chan.id} style={{marginLeft: "25px", padding: "5px"}}>
                        <button onClick={(e) => checkIfBanned(e, chan.id)} className="button">
                            <div> {chan.name} </div>
                        </button>
                    </Row>
                ))}
            </Col>
        </div>
    )
}

type RenderDirectConvsProps = {
    setCurrentChannelId: Function;
    userName:string;
    directConv: Chan;
    chanId: number;
}
const RenderDirectConvs = (props: RenderDirectConvsProps) => {
    const [name, setName] = useState('');
    
    let checkIfBanned = async(e: SyntheticEvent, chanId: number) => {
        e.preventDefault();
        if (chanId !== 0) {
            try {
                const {data} = await axios.post("chat/isBanned", {userId: props.userName, chanId: chanId});
                if (data === true)
                    alert("You have been banned from this channel")
                else
                    props.setCurrentChannelId(chanId)
            }
            catch (error) {
                console.log("Couldn't check if user was banned")
            }
        }
    }

    useEffect(() => {
        let bool = true;
        const getUsers = async () => {
            let chanId = props.directConv.id;
            try {
                if (bool) {
                    const {data} = await axios.post('chat/getChanUsers', {chanId: chanId});
                    let i: number = 0;
                    data.forEach((u: any) => {
                        i++;
                        if (u.login !== props.userName)
                            setName(u.name);
                    });               
                    if (i != 2)
                        setName("");
                }
            }
            catch (error) {
                console.log("Couldn't fetch users for this direct conversation");
            }
        }
        getUsers();
        return () => {bool = false};
    }, [props.directConv.id, props.userName])

    return (
        <button onClick={(e) => checkIfBanned(e, props.chanId)} className="button">
            <div> {name.length !== 0 ? name : props.userName} </div>
        </button>
    )
}

type SideBarDirectConvsProps = {
    userName: string;
    currentChannelId: number;
    setCurrentChannelId: Function;
}

const SideBarDirectConvs = (props: SideBarDirectConvsProps) => {
    const [directConvs, setDirectConvs] = useState<Array<Chan>>([]);

    useEffect(() => {
        const getChans = async () => {
            try {
                const {data} = await axios.post('chat/getChansByUserId', {userId: props.userName})
                if (data) {
                    let res: Chan[];
                    res = data.filter((channel: any) => channel.isDirectConv);
                    setDirectConvs(res);
                }
            }
            catch (error) {
                console.log("Couldn't fetch channels where user belongs");
            }
        }
        getChans();
    }, [props.userName]);

    return (
        <div>
            <Divider orientation="center">
                Direct Messages
            </Divider>
            <Col>
                {directConvs.map((conv: Chan) => (
                    <Row justify="center" key={conv.id} style={{marginLeft: "25px", padding: "5px"}}>
                        <RenderDirectConvs key={conv.id} setCurrentChannelId={props.setCurrentChannelId} userName={props.userName} directConv={conv} chanId={conv.id} />
                    </Row>
                ))}
            </Col>
        </div>
    )
}

type SideBarProps = {
    userName: string;
    currentChannelId: number;
    setCurrentChannelId: Function;
};

export const SideBar = (props: SideBarProps) => {
    return (
        <div className="sideBar">
            <SideBarChannels setCurrentChannelId={props.setCurrentChannelId} userName={props.userName} />
            <SideBarDirectConvs userName={props.userName} currentChannelId={props.currentChannelId} setCurrentChannelId={props.setCurrentChannelId} />
            <Divider orientation="center">
                <Link to="createConv">
                    <Divider>
                        <button className="button">
                            <div> + </div>
                        </button>
                    </Divider>
                </Link>
            </Divider>
        </div>
    )

}