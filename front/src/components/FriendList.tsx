import React from "react";
import { accountService } from "../hooks/account_service";
import {useEffect, useState} from 'react';
import "../styles/list.css";
import axios from "axios";
import EUser from "./chatComponents/Models/user";
import StatsCardFriend from "./StatsCardFriend";
import HistoricFriend from "./historicCardFriend";

const user = {
    name: accountService.userLogin(),
    imgUrl: accountService.userAvatarUrl(),
    size: 50,
    style : {
        marginTop: 20,
        backgroundColor: 'black',
        color: 'white',
        width: "100%",
        height: "100%",
        borderRadius : 10,
    }
};

export default function FriendList() {

    const [Name, setName] = useState('');
    const [Msg, setMsg] = useState('');
    const [Img, setImg] = useState('');
    const [Online, setStatus] = useState('');
    const [isToggled, setIsToggled] = useState(false);
    const [isToggledHis, setIsToggledHis] = useState(false);
    const [isPlaying, setPlay] = useState(false);
    const [isClicked, setClick] = useState(false);
    const [allUsers, setAllUsers] = useState<Array<EUser>>([]);

    useEffect(() => {
        let bool = true;
        const getAllUsers = async () => {
            try {
                const {data} = await axios.get('users');
                if (bool)
                    setAllUsers(data);
            }
            catch (error) {
                console.log("Failed to fetch all users");
            }
        }
        getAllUsers();
        return() => {bool = false};
    }, []);

    useEffect(() => {
    }, [Name, Msg, Img, Online, isPlaying]);

    const handleClick = (name: string, image: string, status: string) => {
        if (isClicked === true){
            setClick(false);
            handleClick(name, image, status);
        }
        console.log(`name ${name}`);
        localStorage.setItem("friendName", name);
        setName(name);
        setImg(image);
        setStatus(status);
        setClick(true);

    };

    const onToggle = () => setIsToggled(!isToggled);

    const onToggleHis = () => setIsToggledHis(!isToggledHis);

    return(
        <div className="container">
            <section className="container-shiny" style = {user.style}>
            <div className="content">
            <div className="scrollable-div" style = {{padding: 10}}>
                {
                allUsers.map((user: EUser) =>
                        <div className="container-social" onClick={() => handleClick(user.name, user.avatarUrl, user.status)}>
                            <div className="row">
                                <div className="column">
                                    <img src={user.avatarUrl} className="circle-img" alt={user.name} />
                                </div>
                                <div className="column-profile">
                                    {user.name}
                                </div>
                                <div className="column-profile">
                                    {user.status === "online"
                                    ? <p className="green-circle"></p>
                                    : <p className="red-circle"></p>}
                                    {user.status === "ingame"
                                    ? <p>in game</p>
                                    : <p></p>}
                                </div>
                        </div>
                        </div>
                    )
                }
            </div>
            <div className="main">
                {
                    isClicked
                    ?
                    <div>
                    <div className="row">
                        <div className="column">
                        <img src={Img} alt={'profile picture'} className="circle-img" style= {{height: 100 ,width: 100}}/>
                        </div>
                        <div className="column">
                            <button className="social-button" onClick={onToggleHis}>Historic</button>
                        </div>
                        <div className="column">
                            {Online === "Online"
                            ? isPlaying
                            ? <p></p>
                            : <button className="social-button">Challenge</button>
                            : <p></p>
                            }
                        </div>
                    </div>
                    <h2> {Name} </h2>
                    <div className="row">
                    <div className="column">
                        <StatsCardFriend/>
                    </div>
                    {isToggledHis
                    ?
                        <HistoricFriend/>
                    :
                    <p></p>
                    }
                    </div>
                    </div>
                    :
                    <p></p> 
                }
            </div>
            </div>
            </section>
        </div>
    )
}

