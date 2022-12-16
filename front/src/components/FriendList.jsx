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
      image: "https://imgs.search.brave.com/GCunwEG5n0hqM6h_GMUWFPu0z-g9NN7qRZncZ4gPr2k/rs:fit:358:389:1/g:ce/aHR0cDovLzQuYnAu/YmxvZ3Nwb3QuY29t/L193cncxTUdjVWVT/QS9UT2x2VmhmVEdY/SS9BQUFBQUFBQUFD/Yy9rajQwOEdQcV9s/MC9zMTYwMC9NYXJp/byUyQjIwMDguanBn",
      msg:  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque porta eu libero a fermentum. Sed feugiat lacus ac tincidunt cursus. Ut venenatis pretium consequat. Quisque finibus molestie ante, non commodo nisl porta non. Donec venenatis dapibus nisl, ac dictum ante blandit ut. Praesent id velit ut nisi aliquet cursus. Etiam at nulla porttitor, tempor lorem id, pharetra ipsum.\
      Nullam turpis felis, efficitur vitae lectus vel, pulvinar luctus dolor. Vestibulum scelerisque fermentum augue sit amet molestie.",
      online: true
    },
    {
      name: "draak",
      image: "https://imgs.search.brave.com/I5zhIsSEA72nqh6DKwMZlrYv4nlIO3tmOSm7HO-dp0g/rs:fit:820:1175:1/g:ce/aHR0cDovL3d3dy5w/bmdtYXJ0LmNvbS9m/aWxlcy8xMi9Qb2tl/bW9uLUFzaC1LZXRj/aHVtLVBORy1JbWFn/ZS5wbmc",
      msg:  "Donec non euismod diam, ac dictum risus. Morbi laoreet nec nunc ut tristique. Etiam cursus, eros sed sodales ornare, erat nulla egestas nisl, interdum commodo nibh lorem id odio. Duis nec odio lacinia, facilisis felis eget, porta nisl. In in leo semper, ullamcorper felis a, dictum massa. Vivamus ac sagittis urna. Nulla vitae dolor nec ligula ornare elementum nec id metus. Vivamus venenatis pretium rhoncus. Donec vitae risus ac elit pulvinar fermentum. Phasellus non posuere felis. Mauris nec justo nisi.\
       Aenean nec nulla vulputate, consequat ante quis, cursus augue. Vivamus et libero condimentum, sodales eros nec, lacinia enim.",
      online: false
    },
    {
      name: "Jessy",
      image: "https://imgs.search.brave.com/JddQhuaY_fs67pjXMql9ORBQrEKwevfi37DVjJ_yCBQ/rs:fit:427:600:1/g:ce/aHR0cHM6Ly9nYWwu/aW1nLnBtZHN0YXRp/Yy5uZXQvZml0L2h0/dHAuM0EuMkYuMkZw/cmQyLWJvbmUtaW1h/Z2UuMkVzMy13ZWJz/aXRlLWV1LXdlc3Qt/MS4yRWFtYXpvbmF3/cy4yRWNvbS4yRkdB/TC4yRjIwMTkuMkYw/OS4yRjIwLjJGMDkw/NWQ2MTYtZmFlYy00/YTJiLTkxZDktOTE4/NDExZGI1NzM0LjJF/anBlZy80Mjd4NjAw/L3F1YWxpdHkvNjUv/amVhbi1kdWphcmRp/bi5qcGc",
      msg:  "Sed consequat sapien bibendum arcu tempor convallis. Duis volutpat porttitor commodo. Ut dictum fringilla fringilla. Sed felis libero, placerat at tempus sed, tempus eu mi. Vestibulum a leo eu turpis tincidunt placerat. Suspendisse tellus lectus, consectetur ac iaculis at, semper eget enim. Duis sed malesuada turpis. Morbi ut turpis condimentum, euismod ipsum non, lacinia tortor. Nullam quis libero sit amet ex elementum hendrerit.\
       Curabitur varius iaculis dictum. Proin cursus sodales egestas.",
      online: true
    },
    {
      name: "Tatiana",
      image: "https://imgs.search.brave.com/TRCqhCJXns18yr7vY9TUVGQZfw6Q4tTfIareZatZmbg/rs:fit:1200:1200:1/g:ce/aHR0cDovL2dldHdh/bGxwYXBlcnMuY29t/L3dhbGxwYXBlci9m/dWxsLzYvYS9jLzEw/OTE5NDQtZnJlZS1z/b3ZpZXQtdW5pb24t/d2FsbHBhcGVyLTE5/MjB4MTIwMC5qcGc",
      msg:  "Integer blandit enim purus, eget facilisis augue sagittis et. Sed fermentum, velit et dapibus maximus, lectus eros aliquet mauris, eu aliquam arcu enim a lacus. Aenean finibus porttitor lectus eu pretium. Aenean hendrerit placerat leo, et iaculis enim varius et. Nunc posuere tellus a est consequat luctus. Vivamus mattis maximus turpis, et suscipit neque semper in.\
       Maecenas eu ipsum a odio condimentum vestibulum eu id leo. Phasellus gravida ante eget fringilla hendrerit.",
      online: true
    },
    {
      name: "jcluzet",
      image: "https://imgs.search.brave.com/fSvDxjcrJQhN1H2riALZhXyct6gzSDsMcBeq0hWUM90/rs:fit:594:757:1/g:ce/aHR0cHM6Ly9wbmdp/bWcuY29tL3VwbG9h/ZHMvYmF0bWFuL2Jh/dG1hbl9QTkc2MS5w/bmc",
      msg:  "Praesent a tortor non arcu tempor interdum. Donec in eleifend lacus. Aliquam egestas, dolor in tempor auctor, elit justo fermentum dolor, non dapibus enim diam sed est. Aenean commodo turpis in nisi gravida, congue auctor dolor eleifend. Etiam venenatis pellentesque enim non egestas. Sed suscipit volutpat semper. Quisque congue non erat at congue. Sed dignissim, purus ut ultrices pretium, nulla neque tempus ante, rutrum congue lectus nibh sit amet ante. Ut non rutrum justo. In nec sapien mollis, vehicula justo sit amet, gravida nibh. Cras iaculis felis eget sapien consectetur rutrum. Ut eu luctus justo, nec tristique sapien. Morbi ullamcorper tortor ac tellus tempus, quis rhoncus nunc aliquet.\
      s Duis elit arcu, tincidunt at risus ut, porta dictum arcu. Integer elementum lorem in dapibus semper.",
      online: false
    }
]


export default function FriendList() {
    const [Name, setName] = useState('');
    const [Msg, setMsg] = useState('');
    const [Img, setImg] = useState(user.imgUrl);
    const [Online, setStatus] = useState(false);

    useEffect(() => {
    }, [Name, Msg, Img, Online]);

    const handleClick = (name, image, msg, online) => {
        setName(name);
        setMsg(msg);
        setImg(image);
        setStatus(online);
    };
    return(
        <div className="container">
            <section className="container-shiny" style = {user.style}>
            <div className="content">
            <div className="scrollable-div" style = {{padding: 10}}>
                {items.map(({name, image, msg, online}) => {
                    return (
                        <div className="container-social" onClick={() => handleClick(name, image, msg, online)}>
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
                                </div>
                        </div>
                        </div>
                    );
                })}
            </div>
            <div className="main">
                <div class="row">
                    <div class="column">
                        <img src={Img} alt={'profile picture'} className="circle-img" style= {{height: 100 ,width: 100}}/>
                    </div>
                    <div class="column">
                    <button className="social-button">Historic</button>
                    </div>
                    <div class="column">
                        {Online
                        ? <button className="social-button">Challenge</button>
                        : <p></p>
                        }
                    </div>
                    <div class="column">
                        {Online
                        ? <button className="social-button">Chat</button>
                        : <p></p>
                        }
                    </div>
                </div>
                <h2> {Name} </h2>
                <div > {Msg} </div>
            </div>
            </div>
            </section>
        </div>
    )
}