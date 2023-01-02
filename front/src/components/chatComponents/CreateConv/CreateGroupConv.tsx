import axios from "axios";
import { SyntheticEvent, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { EUser } from "../Models/user";
import { Box, Typography } from "@mui/material";
import Multiselect from "multiselect-react-dropdown";
import Header from "../../Header";
import { accountService } from "../../../hooks/account_service";

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
        let bool = true;
        const getUserId = async () => {
            try {
                const login = accountService.userLogin() as string;
                setUserId(login);
                allUsers.forEach((user: EUser) => {
                if (user.login === userId && bool)
                    setChanUsers([user]);
                })
            }
            catch (error) {
                console.log("Failed to fetch userId");
            }
        }
        getUserId();
        return () => {bool = false};
    }, [allUsers, userId]);

    const submit = async(event: SyntheticEvent) => {
        event.preventDefault();
        if (success) {
            try {
                await axios.post('chat/newChan', {name: chanName, isPrivate: isPrivate, isDirectConv: false, adminId: userId, users: chanUsers, password: password}); 
                setRedirection(true);
            }
            catch (error) {
                console.log("Failed to create a direct conversation");
            }
        }
    };

    useEffect(() => {
        if (redirection && success)
            return (navigate('/social/chat'));
    })

    function selectedUser(selected: EUser[]) {
        setChanUsers(selected);
        if (selected.length >= 2)
            setSuccess(true);
        else if (selected.length < 2)
            setSuccess(false);
    }

    return (
        <div>
            <Header />
            <form onSubmit={submit}>
                <Typography fontSize={32} color="textSecondary" align="center" marginTop="30px" fontStyle={"italic"} >Choose chat parameters</Typography>
                <Box sx = {{ flexGrow: 1, p: 1 }} /> 
                <div>
                    <label htmlFor="floatingInput">Chat Name</label>
                    <input required id="floatingInput" placeholder="Chat Name" onChange={(e) => {setChanName(e.target.value)}}></input>
                </div>
                <Box sx = {{ flexGrow: 1, p: 1 }} /> 
                <div>
                    <label htmlFor="floatingInput">Private chat</label>
                    <input value="" type="checkbox" onClick={() => setIsPrivate(!isPrivate)}></input>
                </div>
                <Box sx = {{ flexGrow: 1, p: 1 }} /> 
                {isPrivate ? 
                    <div>
                        <label htmlFor="floatingInput">Chat Password</label>
                        <input required id="floatingInput" placeholder="Password" onChange={(e) => {setPassword(e.target.value)}}></input>
                        <Box sx = {{ flexGrow: 1, p: 1 }} /> 
                    </div>
                    :
                    <div>
                        <Box sx = {{ flexGrow: 1, p: 1 }} /> 
                    </div>
                }
                <div>
                    <Multiselect placeholder="Select at least 1 user" options={allUsers} selectedValues={chanUsers} displayValue="login" onSelect={selectedUser} onRemove={selectedUser}></Multiselect>
                </div>
                <Box sx = {{ flexGrow: 1, p: 1 }} /> 
                <button>Submit</button>
            </form>
        </div>
        )
}