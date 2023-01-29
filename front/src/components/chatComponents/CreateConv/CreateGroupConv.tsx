import axios from "axios";
import { SyntheticEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EUser } from "../Models/user";
import { Box, Typography } from "@mui/material";
import Multiselect from "multiselect-react-dropdown";
import Header from "../../Header";
import { accountService } from "../../../hooks/account_service";
import { toast } from "react-toastify";

export const CreateGroupConv = () => {
  const navigate = useNavigate();

  const [chanName, setChanName] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState("");
  const [userId, setUserId] = useState("");
  const [allUsers, setAllUsers] = useState<Array<EUser>>([]);
  const [chanUsers, setChanUsers] = useState<Array<EUser>>([]);
  const [success, setSuccess] = useState(true);
  const [redirection, setRedirection] = useState(false);

  useEffect(() => {
    let bool = true;
    const getAllUsers = async () => {
      try {
        const { data } = await axios.get("users");
        if (bool) setAllUsers(data);
      } catch (error) {}
    };
    getAllUsers();
    return () => {
      bool = false;
    };
  }, []);

  useEffect(() => {
    let bool = true;
    const getUserId = async () => {
      try {
        const login = accountService.userLogin() as string;
        setUserId(login);
        allUsers.forEach((user: EUser) => {
          if (user.login === userId && bool) setChanUsers([user]);
        });
      } catch (error) {}
    };
    getUserId();
    return () => {
      bool = false;
    };
  }, [allUsers, userId]);

  const submit = async (event: SyntheticEvent) => {
    event.preventDefault();

    if (success) {
      try {
        var config = {
          method: "post",
          url: "chat/newChan",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
          data: JSON.stringify({
            name: chanName,
            isPrivate: isPrivate,
            isDirectConv: false,
            adminId: userId,
            users: chanUsers,
            password: password,
          }),
        };
        axios(config)
          .then(function (response: any) {
            setRedirection(true);
          })
          .catch(function (error: any) {});
      } catch (error) {}
    }
  };

  const trynamesubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    var goreturn = false;
    if (success) {
      try {
        var config2 = {
          method: "get",
          url: "chat/getChan",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        };
        await axios(config2)
          .then(function (response: any) {
            response.data.forEach((chan: any) => {
              if (chan.name === chanName) {
                toast.error("Channel name already exists");
                goreturn = true;
              }
            });
          })
          .catch(function (error: any) {});
      } catch (error) {}
    }
    if (!goreturn) submit(event);
  };

  useEffect(() => {
    if (redirection && success) return navigate("/social/chat");
  });

  function selectedUser(selected: EUser[]) {
    setChanUsers(selected);
    if (selected.length >= 2) setSuccess(true);
    else if (selected.length < 2) setSuccess(false);
  }

  return (
    <div>
      <Header />
      <form onSubmit={trynamesubmit}>
        <Typography
          fontSize={32}
          color="textSecondary"
          align="center"
          marginTop="30px"
          fontStyle={"italic"}
        >
          Choose chat parameters
        </Typography>
        <Box sx={{ flexGrow: 1, p: 1 }} />
        <div>
          <label htmlFor="floatingInput">Chat Name</label>
          <input
            required
            id="floatingInput"
            placeholder="Chat Name"
            onChange={(e) => {
              setChanName(e.target.value);
            }}
          ></input>
        </div>
        <Box sx={{ flexGrow: 1, p: 1 }} />
        <div>
          <label htmlFor="floatingInput">Private chat</label>
          <input
            value=""
            type="checkbox"
            onClick={() => setIsPrivate(!isPrivate)}
          ></input>
        </div>
        <Box sx={{ flexGrow: 1, p: 1 }} />
        {isPrivate ? (
          <div>
            <label htmlFor="floatingInput">Chat Password</label>
            <input
              required
              id="floatingInput"
              placeholder="Password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            ></input>
            <Box sx={{ flexGrow: 1, p: 1 }} />
          </div>
        ) : (
          <div>
            <Box sx={{ flexGrow: 1, p: 1 }} />
          </div>
        )}
        <div>
          <Multiselect
            placeholder="Select at least 1 user"
            options={allUsers}
            selectedValues={chanUsers}
            displayValue="name"
            onSelect={selectedUser}
            onRemove={selectedUser}
          ></Multiselect>
        </div>
        <Box sx={{ flexGrow: 1, p: 1 }} />
        <button>Submit</button>
      </form>
    </div>
  );
};
