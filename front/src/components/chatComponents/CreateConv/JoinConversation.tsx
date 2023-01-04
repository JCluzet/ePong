import axios from "axios";
import { SyntheticEvent, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import { Chan } from "../Models/chan";
import { Divider } from "antd";
import Header from "../../Header";
import { accountService } from "../../../hooks/account_service";

export const JoinConversation = () => {
    const navigate = useNavigate();
    const [channels, setChannels] = useState<Array<Chan>>([]);
    const [userName, setUserName] = useState("");
    const [redi, setRedi] = useState(false);
    const [password, setPassword] = useState("");


    useEffect(() => {
        let bool = true;
        const getUser = async () => {
            if (bool) {
                const log = accountService.userLogin() as string;
                setUserName(log);
            }
        }
        getUser();
        return () => {bool = false};
    }, []);

    useEffect(() => {
        let bool = true;
        const getAllChan = async () => {
            try {
                const {data} = await axios.get('chat/all');
                if (bool)
                    setChannels(data);
            }
            catch (error) {
                console.log("Failed to fetch all channels");
            }
        }
        getAllChan();
        return() => {bool = false};
    }, []);

    const tryJoin = async(e:  SyntheticEvent, chanId: Number, userId: string) => {
        try {
            const chan = await axios.post("chat/getChanById", {chanId: chanId});
            if (chan.data.isPrivate) {
                const pwd = await axios.post("chat/checkPassword", {chanId: chanId, password: password})
                if (pwd.data === false) {
                    alert("Wrong password");
                    setPassword("");
                    window.location.reload();
                }
                else {
                    const ret = await axios.post("chat/addUser", {chanId: chanId, userId: userId});
                    if (ret.data === true) {
                        alert("You successfully joined a channel");
                        setRedi(true);
                    }
                    else if (ret.data === false) {
                        alert("You are already in this channel");
                        window.location.reload();
                    }    
                }
            }
            else {
                const ret = await axios.post("chat/addUser", {chanId: chanId, userId: userId});
                if (ret.data === true) {
                    alert("You successfully joined a channel");
                    setRedi(true);
                }
                else if (ret.data === false) {
                    alert("You are already in this channel");
                    window.location.reload();
                }
            }
        }
        catch (error) {
            console.log("Couldn't join the channel");
        }
    }

    useEffect(() => {
        if (redi) {
            return navigate("/social/chat");
        }
    }, [redi, navigate]);

    return (
        <div>
            <Header />
            <Divider>
                <Typography fontSize={24} color="textSecondary" align="center" marginTop="30px" fontStyle={"italic"} > Choose the channel that you want to add to your list </Typography>
            </Divider>
                <table className="customTable2">
                    <tbody>
                        {channels.filter((item: Chan) => item.isDirectConv === false).map((item: Chan) => 
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            { item.isPrivate ? 
                                <td>
                                    <input required id="floatingInput" placeholder="Password" onChange={(e) => {setPassword(e.target.value)}}></input>
                                </td>
                                : null
                            }
                            <td><button className="button" onClick={((e) => tryJoin(e, item.id, userName))}> Join </button></td>
                        </tr>
                        )}
                    </tbody>
                </table>
            <Divider>
                <button className="button" onClick={() => {setRedi(true)}}>
                    <div className="text-social"> Back </div>
                </button>
            </Divider>
        </div>
    )
}