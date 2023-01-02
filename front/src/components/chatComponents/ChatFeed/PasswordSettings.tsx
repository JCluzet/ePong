import axios from "axios";
import { SyntheticEvent, useEffect, useState } from "react";
import { accountService } from "../../../hooks/account_service";
import "./chatFeed.css"

type PasswordSettingsProps = {
    currentChanId: number;
}

export const PasswordSettings = (props: PasswordSettingsProps) => {
    const [isPrivate, setIsPrivate] = useState(false);
    const [input, setInput] = useState('');
    const [fail, setFail] = useState(false);
    const [success, setSuccess] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [render, setRender] = useState(false);
    const [userName, setUserName] = useState("");
    const [avatar, setAvatar] = useState("");

    useEffect(() => {
        let bool = true;
        const getUser = async () => {
            if (bool) {
                const log = accountService.userLogin() as string;
                const av = accountService.userAvatarUrl() as string;
                setAvatar(av);
                setUserName(log);
            }
        }
        getUser();
        return () => {bool = false};
    }, []);


    useEffect(() => {
        let bool = true;
        const isPrivate = async () => {
            try {
                const {data} = await axios.post('chat/getChanById', {chanId: props.currentChanId});
                if (bool)
                    setIsPrivate(data.isPrivate);
            }
            catch (error) {
                console.log("Counldn't fetch channel info")
            }
        }
        isPrivate();
        return () => {bool = false};
    }, [props.currentChanId]);

    let checkInput = async(event: SyntheticEvent) => {
        event.preventDefault();
        try {
            const check = await axios.post('chat/isAdmin', {userId: userName, chanId: props.currentChanId})
            if (check.data === false) {
                alert("You are not an admin anymore");
                window.location.reload();
            }
            else {
                const {data} = await axios.post('chat/checkPassword', {password: input, chanId: props.currentChanId});
                console.log(data)
                if (data === true) {
                    setSuccess(true);
                    setFail(false);
                }
                else {
                    setFail(true);
                }
            }
        }
        catch (error) {
            console.log("Couldn't check channel password");
        }
    }

    async function removePassword() {
        try {
            const check = await axios.post('chat/isAdmin', {userId: userName, chanId: props.currentChanId})
            if (check.data === false) {
                alert("You are not an admin anymore");
                window.location.reload();
            }
            else {
                await axios.post('chat/changePassword', {newPassword: "", chanId: props.currentChanId});
                alert("Password has successfully been removed")
                window.location.reload();
            }
        }
        catch (error) {
            console.log("Couldn't remove channel password");
        }
    }

    let submit = async (event: SyntheticEvent) => {
        event.preventDefault();
        try {
            const check = await axios.post('chat/isAdmin', {userId: userName, chanId: props.currentChanId})
            if (check.data === false) {
                alert("You are not an admin anymore");
                window.location.reload();
            }
            else {
                await axios.post('chat/changePassword', {newPassword: newPassword, chanId: props.currentChanId});
                alert("Password has successfully been updated")
                window.location.reload();
            }
        }
        catch (error) {
            console.log("Couldn't change channel password");
        }
    }

    function renderSettings() {
        if (render) {
            return (
                <form onSubmit={submit}>
                    <div style={{padding: "10px"}}>
                        <label htmlFor="floatingInput"> New Password </label>
                        <input required type="password" id="floatingInput" onChange={(e) => setNewPassword(e.target.value)}></input>
                        <button className="button" type="submit">Submit</button>
                    </div>
                </form>
            )
        }
        else {
            return;
        }
    }

    if (isPrivate) {
        return (
            <div className="passWordDiv">
                <form onSubmit={checkInput}>
                    <div style={{padding: "10px"}}>
                        { fail === false ? <label htmlFor="floatingInput"> Enter current password </label> : <label htmlFor="floatingInput"> Wrong input, please try again </label> }
                        <input required type="password" id="floatingInput" onChange={(e) => setInput(e.target.value)}></input>
                        <button className="button">Submit</button>
                    </div>
                </form>
                {
                    success ?
                    <div>
                        <div>
                            <button className="button" type="submit" onClick={() => setRender(!render)}>Change password</button>
                            <button className="button" type="submit" onClick={removePassword}>Remove password</button>
                            {renderSettings()}
                        </div>
                    </div>
                    :
                    null
                }
            </div>
        )
    }
    else {
        return (
            <div className="passWordDiv">
                <label color="#0000" htmlFor="defaultCheck1">Add password </label>
                <input className="form-check-input" type="checkbox" value="" id="defaultCheck1" onChange={() => setRender(!render)}/>
                {renderSettings()}
            </div>
        )
    }
}