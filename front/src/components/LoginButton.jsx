import { Button } from 'semantic-ui-react';
import {useForm} from "react-hook-form";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import useAuth from "../hooks/useAuth";

export default function LoginButton() {

    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const {login} = useAuth();

    return (
        // create a container in the middle of the page
        <div>
            <Button onClick={login()}>Login</Button>
        </div>
    );
}