import { Divider, Typography } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { EUser } from "../Models/user";
import { PasswordSettings } from "./PasswordSettings";
import "./chatFeed.css"
import Header from "../../Header";

type AdminPanelProps = {
    currentChannelId: number;
    userName: string;
}

export const AdminPanel = (props: any) => {
    const navigate = useNavigate();
    const [redi, setRedi] = useState(false);
    const [chanUsers, setChanUsers] = useState<EUser[]>([]);
    const [notAdmin, setNotAdmin] = useState(false)
    const loc = useLocation();
    const sta = loc.state as AdminPanelProps;
    const chanId = sta.currentChannelId;
    const userName = sta.userName;

    useEffect(() => {
        let bool = true;
        const getChanUsers = async() => {
            try {
                const {data} = await axios.post('chat/getChanUsers', {chanId: chanId});
                if (bool)
                    setChanUsers(data)
            }
            catch (error) {
                console.log("Couldn't fetch channel users");
            }
        }
        getChanUsers();
        return () => {bool = false};
    }, [chanId]);

    useEffect(() => {
        const isAdmin = async() => {
                chanUsers.forEach((user: EUser) => {
                    if (user.login === userName) {
                        if (user.userType !== 0 && user.userType !== -1) {
                            setNotAdmin(true);
                        }
                    } 
                })
        }
        isAdmin();
    }, [chanUsers, userName]);

    useEffect(() => {
        if (notAdmin)
            return (navigate('/social/chat'))
    })

    async function updateUserStatus(userId: string, status: number) {
        try {
            const {data} = await axios.post('chat/isAdmin', {userId: props.userId, chanId: props.currentChannelId})
            if (data.data === false) {
                alert("You are not an admin anymore");
                window.location.reload();
            }
            await axios.post('chat/updateUserStatus', {userId: userId, status: status, chanId: chanId});
            if (status === 0)
                alert("User is now an admin on this channel")
            else if (status === 1)
                alert("User is now a normal user")
            else if (status === 2)
                alert("User is now muted, you can unmute him wheneven you want");
            else if (status === 3)
                alert("User is now banned, you can unban him wheneven you want")
            window.location.reload();
        }
        catch (error) {
            console.log("Couldn't update user status");
        }
    }

    useEffect(() => {
        if (redi)
            return navigate('/social/chat');
    }, [redi, navigate])

    return (
        <div>
            <Header />
            <Divider>
                <Typography> Admin Panel </Typography>
            </Divider>
            <div className="tableDiv">
                <table className="userAdminTable">
                    <thead/>
                    <tbody>
                        {chanUsers.map((user: EUser) => (
                            <tr key={user.id}>
                                <td>{user.login}</td>
                                {user.userType === -1 ? <td>Cannot modify channel owner</td> : null}
                                {user.userType !== 1 ? <td></td> : <td><button className="button" onClick={() => updateUserStatus(user.login, 0)}><div>Make Admin</div></button></td>}
                                {user.userType !== 0 ? <td></td> : <td><button className="button" onClick={() => updateUserStatus(user.login, 1)}><div>UnMake Admin</div></button></td>}
                                {user.userType !== 1 ? <td></td> : <td><button className="button" onClick={() => updateUserStatus(user.login, 2)}><div>Mute</div></button></td>}
                                {user.userType !== 2 ? <td></td> : <td><button className="button" onClick={() => updateUserStatus(user.login, 1)}><div>UnMute</div></button></td>}
                                {user.userType !== 1 && user.userType !== 2 ? <td></td> : <td><button className="button" onClick={() => updateUserStatus(user.login, 3)}><div>Ban</div></button></td>}
                                {user.userType !== 3 ? <td></td> : <td><button className="button" onClick={() => updateUserStatus(user.login, 1)}><div>UnBan</div></button></td>}
                            </tr>     
                        ))}
                    </tbody>
                </table>
            </div>
            <Divider>
                Password Settings
            </Divider>
                <PasswordSettings currentChanId={chanId}></PasswordSettings>
            <Divider>
                <button className="button" onClick={() => {setRedi(!redi)}}>
                        <div>Back</div>
                </button>
            </Divider>
        </div>
    )
}