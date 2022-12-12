import React from "react";
import SettingsImg from "../assets/images/settings_white.png";
import { ReactComponent as Logo } from "../assets/images/logo.svg";
import { accountService } from "../hooks/account_service";
import ProfilSettings from "./ProfilSettings";



// faire un composent "carte profile" avec login, si en ligne, image de login
const user = {
    name: accountService.userLogin(),
    imgUrl: accountService.userAvatarUrl(),
    size: 100,
    style : {
        backgroundColor: 'black',
        color: 'white',
        width: "100%",
        borderRadius : 10,
    }
};


export default function ProfileCard() {
    return (
        <div className="container" >
            <section className="button-shiny" style = {user.style}>
                <h1>{user.name}</h1>
                <img
                    src={user.imgUrl}
                    alt={'photo of ' + user.name}
                    style = {{
                        height: user.size,
                        width: user.size
                    }}
                />
                <h2> Info </h2>
                <ul>
                    <li>template</li>
                    <li>template</li>
                    <li>template</li>
                </ul>
            </section>
        </div>
    )
}