import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { accountService } from '../hooks/account_service';
import EUser from './chatComponents/Models/user';

export default function AddFriendList() {
  const [AllUsers, setAllUsers] = useState([]);
  const [isClicked, setIsClicked] = useState(false);
  

  useEffect(() => {
    var config = {
      method: 'get',
      url: '/users',
      header: {},
    }
    axios(config).then((response) => setAllUsers(response.data));
  }, []);

  console.log(AllUsers);

  const handleClick = () => setIsClicked(!isClicked);

  const goAdd = (user: string) => {
    var config = {
      method: "post",
      url: "/friends/send?to=" + user,
      headers: { Authorization: "Bearer " + accountService.userToken() },
    }
    axios(config).then(function(response) {
      if (response.data === false)
        toast.error('Error add user');
    });
      
    
  }

  return (
    <div>
      {
        AllUsers.map((user: EUser) =>
        user.login !== accountService.userLogin() ?
        <div className="container-social" onClick={handleClick}>
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
            <div>
              {
                isClicked ? 
                <div className="column">
                  <button className="social-button" onClick={() => goAdd(user.login)}>add</button>
                </div>
                :
                <p></p>
              }
            </div>
        </div>
        </div>
        :
        <p></p>
        )
      }
    </div>
  )
}