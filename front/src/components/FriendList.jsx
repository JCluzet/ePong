import React from "react";
import { accountService } from "../hooks/account_service";
import {useEffect, useState} from 'react';
import "../styles/list.css";

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


const items = [
    {
      name: "malick",
      image: "https://res.cloudinary.com/teepublic/image/private/s--VBW3grcc--/t_Resized%20Artwork/c_fit,g_north_west,h_954,w_954/co_c8e0ec,e_outline:48/co_c8e0ec,e_outline:inner_fill:48/co_ffffff,e_outline:48/co_ffffff,e_outline:inner_fill:48/co_bbbbbb,e_outline:3:1000/c_mpad,g_center,h_1260,w_1260/b_rgb:eeeeee/c_limit,f_auto,h_630,q_90,w_630/v1526353766/production/designs/2687348_0.jpg"
    },
    {
      name: "draak",
      image: "https://res.cloudinary.com/teepublic/image/private/s--VBW3grcc--/t_Resized%20Artwork/c_fit,g_north_west,h_954,w_954/co_c8e0ec,e_outline:48/co_c8e0ec,e_outline:inner_fill:48/co_ffffff,e_outline:48/co_ffffff,e_outline:inner_fill:48/co_bbbbbb,e_outline:3:1000/c_mpad,g_center,h_1260,w_1260/b_rgb:eeeeee/c_limit,f_auto,h_630,q_90,w_630/v1526353766/production/designs/2687348_0.jpg"
    },
    {
      name: "Jessy",
      image: "https://res.cloudinary.com/teepublic/image/private/s--VBW3grcc--/t_Resized%20Artwork/c_fit,g_north_west,h_954,w_954/co_c8e0ec,e_outline:48/co_c8e0ec,e_outline:inner_fill:48/co_ffffff,e_outline:48/co_ffffff,e_outline:inner_fill:48/co_bbbbbb,e_outline:3:1000/c_mpad,g_center,h_1260,w_1260/b_rgb:eeeeee/c_limit,f_auto,h_630,q_90,w_630/v1526353766/production/designs/2687348_0.jpg"
    },
    {
      name: "Tatiana",
      image: "https://res.cloudinary.com/teepublic/image/private/s--VBW3grcc--/t_Resized%20Artwork/c_fit,g_north_west,h_954,w_954/co_c8e0ec,e_outline:48/co_c8e0ec,e_outline:inner_fill:48/co_ffffff,e_outline:48/co_ffffff,e_outline:inner_fill:48/co_bbbbbb,e_outline:3:1000/c_mpad,g_center,h_1260,w_1260/b_rgb:eeeeee/c_limit,f_auto,h_630,q_90,w_630/v1526353766/production/designs/2687348_0.jpg"
    },
    {
      name: "jcluzet",
      image: "https://res.cloudinary.com/teepublic/image/private/s--VBW3grcc--/t_Resized%20Artwork/c_fit,g_north_west,h_954,w_954/co_c8e0ec,e_outline:48/co_c8e0ec,e_outline:inner_fill:48/co_ffffff,e_outline:48/co_ffffff,e_outline:inner_fill:48/co_bbbbbb,e_outline:3:1000/c_mpad,g_center,h_1260,w_1260/b_rgb:eeeeee/c_limit,f_auto,h_630,q_90,w_630/v1526353766/production/designs/2687348_0.jpg"
    }
]


export default function FriendList() {
    const [Msg, setMsg] = useState('');

    useEffect(() => {
    }, [Msg]);

    const handleClick = (name) => {
       setMsg(name);
    }; 
    return(
        <div className="container">
            <section className="button-shiny" style = {user.style}>
            <div className="content">
            <div className="scrollable-div" style = {{padding: 10}}>
                {items.map(({name, image}) => {
                    return (
                        <div className="button-shiny" onClick={() => handleClick(name)}>
                            <img src={image}
                             alt={'photo of ' + user.name}
                             style = {{
                                 height: user.size,
                                 width: user.size,
                                 marginRight: 10,
                                 marginLeft: -20
                             }}/>
                            {name}
                        </div>
                    );
                })}
            </div>
            <div className="main">
                <div >main</div>
                <h2> Info </h2>
                <div > {Msg} </div>
            </div>
            </div>
            </section>
        </div>
    )
}