import React from "react";
import SettingsImg from "../assets/images/settings_white.png";
import { ReactComponent as Logo } from "../assets/images/logo.svg";
import { accountService } from "../hooks/account_service";
import ProfilSettings from "./ProfilSettings";
import "../styles/list.css";

const user = {
    name: accountService.userLogin(),
    imgUrl: accountService.userAvatarUrl(),
    size: 100,
    style : {
        marginTop: 20,
        // backgroundColor: 'black',
        // color: 'white',
        // width: "100%",
        // height: "100%",
        // borderRadius : 10,
    }
};


export default function FriendList() {
    return(
        <div class="container">
            <section className="container-social" style = {user.style}>
            <div className="content">
            <div className="scrollable-div">
            <div >sidebar</div>
            <h2> Info </h2>
                <ul>
                    <li>template</li>
                    <li>template</li>
                    <li>template</li>
                </ul>
                <h2> Info </h2>
                <ul>
                    <li>template</li>
                    <li>template</li>
                    <li>template</li>
                </ul>
                <h2> Info </h2>
                <ul>
                    <li>template</li>
                    <li>template</li>
                    <li>template</li>
                </ul>
                </div>
             <div class="main">
                <div >main</div>
                <h2> Info </h2>
                <ul>
                    <li>template</li>
                    <li>template</li>
                    <li>template</li>
                </ul>
                </div>
            </div>
            </section>
        </div>
    )
}