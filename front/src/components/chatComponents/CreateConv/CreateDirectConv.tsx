import axios from "axios";
import { SyntheticEvent, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { EUser } from "../Models/user";
import { Typography } from "@mui/material";
import Multiselect from "multiselect-react-dropdown";
import Header from "../../Header";
import { accountService } from "../../../hooks/account_service";

export const CreateDirectConv = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState("");
    const [allUsers, setAllUsers] = useState<Array<EUser>>([]);
    const [chanUsers, setChanUsers] = useState<Array<EUser>>([]);
    const [chanAdmin, setChanAdmin] = useState<Array<EUser>>([]);
    const [success, setSuccess] = useState(true);
    const [redirection, setRedirection] = useState(false);

    useEffect(() => {
        let bool = true;
        const getAllUsers = async () => {
            try {
                const {data} = await axios.get('users/all');
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
                if (user.login === login && bool)
                    setChanAdmin([user]);
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
                await axios.post('chat/newChan', {name: "Direct Conversation", isPrivate: false, isDirectConv: true, adminId: userId, users: chanUsers, password: ""}); 
                setRedirection(true);
            }
            catch (error) {
                console.log("Failed to create a direct conversation");
            }
        }
    };

    function selectUser(selected: EUser[]) {
        if (selected.length !== 2) {
            setSuccess(false);
            return ;
        }
        else {
            setSuccess(true);
            setChanUsers(selected);
        }
    }

    useEffect(() => {
        if (redirection && success)
            return (navigate('/social/chat'));
    })

    return (
        <main>
            <Header />
            <form onSubmit={submit}>
                <Typography fontSize={32} color="textSecondary" align="center" marginTop="30px" fontStyle={"italic"} >Choose the users for this direct chat</Typography>

                {chanAdmin && (
                    <>
                        <Multiselect options={allUsers} selectedValues={chanAdmin} displayValue="login" placeholder="Add one user here" onSelect={selectUser} onRemove={selectUser} />
                    </>
                )}
                <button>Submit</button>
            </form>
        </main>
        )
}