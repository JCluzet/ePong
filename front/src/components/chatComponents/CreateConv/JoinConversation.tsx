import axios from "axios";
import { SyntheticEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import { Chan } from "../Models/chan";
import { Divider } from "antd";
import Header from "../../Header";
import { accountService } from "../../../hooks/account_service";
import { toast } from "react-toastify";

export const JoinConversation = () => {
  const navigate = useNavigate();
  const [channels, setChannels] = useState<Array<Chan>>([]);
  const [userName, setUserName] = useState("");
  const [redi, setRedi] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    let bool = true;
    const getUser = async () => {
      if (bool) {
        const log = accountService.userLogin() as string;
        setUserName(log);
      }
    };
    getUser();
    return () => {
      bool = false;
    };
  }, []);

  useEffect(() => {
    let bool = true;
    const getAllChan = async () => {
      if (bool) {
        var config = {
          method: "get",
          url: "chat/all",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
          data: JSON.stringify({}),
        };
        axios(config)
          .then(function (response: any) {
            setChannels(response.data);
          })
          .catch(function (error: any) {});
      }
    };
    getAllChan();
    return () => {
      bool = false;
    };
  }, []);

  const tryJoin = async (e: SyntheticEvent, chanId: Number, userId: string) => {
    try {
      var config = {
        method: "post",
        url: "chat/getChanById",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        data: JSON.stringify({ chanId: chanId }),
      };
      axios(config)
        .then(function (response: any) {
          if (response.data.isPrivate) {
            var config = {
              method: "post",
              url: "chat/checkPassword",
              headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
                "Content-Type": "application/json",
              },
              data: JSON.stringify({ chanId: chanId, password: password }),
            };
            axios(config)
              .then(function (response: any) {
                if (response.data === false) {
                  toast.error("Wrong password");
                  setPassword("");
                  window.location.reload();
                } else {
                  var config = {
                    method: "post",
                    url: "chat/addUser",
                    headers: {
                      Authorization: "Bearer " + localStorage.getItem("token"),
                      "Content-Type": "application/json",
                    },
                    data: JSON.stringify({ chanId: chanId, userId: userId }),
                  };
                  axios(config)
                    .then(function (response: any) {
                      if (response.data === true) {
                        toast.success("You successfully joined a channel");
                        setRedi(true);
                      } else if (response.data === false) {
                        toast.error("You are already in this channel");
                        window.location.reload();
                      }
                    })
                    .catch(function (error: any) {});
                }
              })
              .catch(function (error: any) {});
          } else {
            config = {
              method: "post",
              url: "chat/addUser",
              headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
                "Content-Type": "application/json",
              },
              data: JSON.stringify({ chanId: chanId, userId: userId }),
            };
            axios(config)
              .then(function (response: any) {
                if (response.data === true) {
                  toast.success("You successfully joined a channel");
                  setRedi(true);
                } else if (response.data === false) {
                  toast.error("You are already in this channel");
                  window.location.reload();
                }
              })
              .catch(function (error: any) {});
          }
        })
        .catch(function (error: any) {});
    } catch (error) {}
  };

  useEffect(() => {
    if (redi) {
      return navigate("/social/chat");
    }
  }, [redi, navigate]);

  return (
    <div>
      <Header />
      <Divider>
        <Typography
          fontSize={24}
          color="textSecondary"
          align="center"
          marginTop="30px"
          fontStyle={"italic"}
        >
          {" "}
          Choose the channel that you want to add to your list{" "}
        </Typography>
      </Divider>
      <table className="customTable2">
        <tbody>
          {channels
            .filter((item: Chan) => item.isDirectConv === false)
            .map((item: Chan) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                {item.isPrivate ? (
                  <td>
                    <input
                      required
                      id="floatingInput"
                      placeholder="Password"
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                    ></input>
                  </td>
                ) : null}
                <td>
                  <button
                    className="button"
                    onClick={(e) => tryJoin(e, item.id, userName)}
                  >
                    {" "}
                    Join{" "}
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <Divider>
        <button
          className="button"
          onClick={() => {
            setRedi(true);
          }}
        >
          <div className="text-social"> Back </div>
        </button>
      </Divider>
    </div>
  );
};
