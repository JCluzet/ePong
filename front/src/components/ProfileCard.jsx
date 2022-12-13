import React from "react";
import { accountService } from "../hooks/account_service";
import "../styles/social.css"


// faire un composent "carte profile" avec login, si en ligne, image de login

const user = {
    name: accountService.userLogin(),
    imgUrl: accountService.userAvatarUrl(),
    size: 100,
    // style : {
        // backgroundColor: 'black',             >> a mettre dans le css class container-social
        // color: 'white',
        // width: "100%",
        // borderRadius : 10,
    // }
};


export default function ProfileCard() {
    return (
        <div className="container" >
            {/* j'ai creer une class container-social dans le css qui contient direct tout le style */}
            <section className="container-social">
                <img
                    src={user.imgUrl}
                    alt={'photo of ' + user.name}
                    style = {{
                        height: user.size,
                        width: user.size
                    }}
                    />
                    <h1>{user.name}</h1>
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