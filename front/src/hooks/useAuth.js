import axios from "../config/axios";
import { useNavigate } from 'react-router-dom';
import { api } from "../config/api";
export default function useAuth() {

    const navigate = useNavigate();

     const login = (data) => {
        // console.log(data);

        // axios.post(api.auth.login, data).then(...);

        axios.get(api.auth.login).then((response) => {
            if(response.status === 200) {
                // console.log(response.data);

                const user = {
                    firstname: "jo",
                    email: "toto@gmail.com"
                };

                localStorage.setItem("user", JSON.stringify(user));
                
                // navigate("/dashboard");
            }
        }).catch((e) => {
            console.log(e);
        });
     };

     const logout = () => {
        localStorage.removeItem("user");
     };

    return {
        login,
        logout
    };

}