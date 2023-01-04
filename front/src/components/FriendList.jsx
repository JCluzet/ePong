import React from "react";
import { accountService } from "../hooks/account_service";
import {useEffect, useState} from 'react';
import "../styles/list.css";
import ChatBox from "../components/ChatBox";
import Historic from "./HistoricCard";
import StatsCard from "./StatsCard";


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
      image: "https://imgs.search.brave.com/GCunwEG5n0hqM6h_GMUWFPu0z-g9NN7qRZncZ4gPr2k/rs:fit:358:389:1/g:ce/aHR0cDovLzQuYnAu/YmxvZ3Nwb3QuY29t/L193cncxTUdjVWVT/QS9UT2x2VmhmVEdY/SS9BQUFBQUFBQUFD/Yy9rajQwOEdQcV9s/MC9zMTYwMC9NYXJp/byUyQjIwMDguanBn",
      msg: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Cum assumenda quasi corporis explicabo eos, natus nobis reiciendis consequuntur voluptatum nisi sapiente nam excepturi soluta omnis! Ipsa praesentium ad aliquid error.",
      online: true,
      playing: true
    },
    {
      name: "draak",
      image: "https://imgs.search.brave.com/I5zhIsSEA72nqh6DKwMZlrYv4nlIO3tmOSm7HO-dp0g/rs:fit:820:1175:1/g:ce/aHR0cDovL3d3dy5w/bmdtYXJ0LmNvbS9m/aWxlcy8xMi9Qb2tl/bW9uLUFzaC1LZXRj/aHVtLVBORy1JbWFn/ZS5wbmc",
      msg:  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis at labore nostrum explicabo cum. Odio, voluptatibus ab. Dicta eaque voluptatum temporibus perferendis quidem? Iste molestias ducimus sapiente blanditiis possimus minima!",
      online: false,
      playing: false
    },
    {
      name: "Jessy",
      image: "https://imgs.search.brave.com/JddQhuaY_fs67pjXMql9ORBQrEKwevfi37DVjJ_yCBQ/rs:fit:427:600:1/g:ce/aHR0cHM6Ly9nYWwu/aW1nLnBtZHN0YXRp/Yy5uZXQvZml0L2h0/dHAuM0EuMkYuMkZw/cmQyLWJvbmUtaW1h/Z2UuMkVzMy13ZWJz/aXRlLWV1LXdlc3Qt/MS4yRWFtYXpvbmF3/cy4yRWNvbS4yRkdB/TC4yRjIwMTkuMkYw/OS4yRjIwLjJGMDkw/NWQ2MTYtZmFlYy00/YTJiLTkxZDktOTE4/NDExZGI1NzM0LjJF/anBlZy80Mjd4NjAw/L3F1YWxpdHkvNjUv/amVhbi1kdWphcmRp/bi5qcGc",
      msg:  "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptas, quibusdam. Asperiores quasi, labore nostrum similique aspernatur, illo voluptatibus ipsa iste neque hic harum commodi maiores fuga, atque cum. Minus, et?",
      online: true,
      playing: false
    },
    {
      name: "Tatiana",
      image: "https://imgs.search.brave.com/TRCqhCJXns18yr7vY9TUVGQZfw6Q4tTfIareZatZmbg/rs:fit:1200:1200:1/g:ce/aHR0cDovL2dldHdh/bGxwYXBlcnMuY29t/L3dhbGxwYXBlci9m/dWxsLzYvYS9jLzEw/OTE5NDQtZnJlZS1z/b3ZpZXQtdW5pb24t/d2FsbHBhcGVyLTE5/MjB4MTIwMC5qcGc",
      msg:   "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam similique dolorum, nisi illum, fugiat at modi officiis, nemo odio animi nihil neque doloremque qui assumenda quia quisquam accusantium facilis iusto!",
      online: true,
      playing: true
    },
    {
      name: "jcluzet",
      image: "https://imgs.search.brave.com/fSvDxjcrJQhN1H2riALZhXyct6gzSDsMcBeq0hWUM90/rs:fit:594:757:1/g:ce/aHR0cHM6Ly9wbmdp/bWcuY29tL3VwbG9h/ZHMvYmF0bWFuL2Jh/dG1hbl9QTkc2MS5w/bmc",
      msg: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Id, delectus ea beatae illo at eligendi quas vitae sapiente esse est optio, dolorum, fugiat inventore. Voluptatem hic velit beatae impedit non!",
      online: false,
      playing: false
    }
]

export default function FriendList() {

    const [Name, setName] = useState('');
    const [Msg, setMsg] = useState('');
    const [Img, setImg] = useState(user.imgUrl);
    const [Online, setStatus] = useState(false);
    const [isToggled, setIsToggled] = useState(false);
    const [isToggledHis, setIsToggledHis] = useState(false);
    const [isPlaying, setPlay] = useState(false);
    const [isClicked, setClick] = useState(false);
    
    useEffect(() => {
    }, [Name, Msg, Img, Online, isPlaying]);

    const handleClick = (name, image, msg, online, playing) => {
        setName(name);
        setMsg(msg);
        setImg(image);
        setStatus(online);
        setPlay(playing);
        setClick(true)
    };

    const onToggle = () => setIsToggled(!isToggled);

    const onToggleHis = () => setIsToggledHis(!isToggledHis);

    return(
        <div className="container">
            <section className="container-shiny" style = {user.style}>
            <div className="content">
            <div className="scrollable-div" style = {{padding: 10}}>
                {items.map(({name, image, msg, online, playing}) => {
                    return (
                        <div className="container-social" onClick={() => handleClick(name, image, msg, online, playing)}>
                            <div className="row">
                                <div className="column">
                                    <img src={image}
                                    className="circle-img"
                                    alt={'photo of ' + user.name}
                                    />
                                </div>
                                <div className="column-profile">
                                    {name}
                                </div>
                                <div className="column-profile">
                                    {online
                                    ? <p className="green-circle"></p>
                                    : <p className="red-circle"></p>}
                                    {playing
                                    ? <p>in game</p>
                                    : <p></p>}
                                </div>
                        </div>
                        </div>
                    );
                })}
            </div>
            <div className="main">
                {
                    isClicked
                    ?
                    <div>
                    <div className="row">
                        <div className="column">
                        {/* eslint-disable-next-line */}
                        <img src={Img} alt={'profile picture'} className="circle-img" style= {{height: 100 ,width: 100}}/>
                        </div>
                        <div className="column">
                            <button className="social-button" onClick={onToggleHis}>Historic</button>
                        </div>
                        <div className="column">
                            {Online
                            ? isPlaying
                            ? <p></p>
                            : <button className="social-button">Challenge</button>
                            : <p></p>
                            }
                        </div>
                        <div className="column">
                            {Online
                            ? <button className="social-button" onClick={onToggle}>Chat</button>
                            : <p></p>
                        }
                        </div>
                    </div>
                    <h2> {Name} </h2>
                    <div className="row">
                    <div className="column">
                    <StatsCard/>
                    </div>
                    {isToggledHis
                    ?
                    <Historic/>
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
            <div >
                {
                    isToggled ? <ChatBox/> : <p></p>
                }
            </div>
            </section>
        </div>
    )
}
