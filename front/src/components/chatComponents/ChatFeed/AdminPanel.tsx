import { Divider, Typography } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { EUser } from "../Models/user";
import { PasswordSettings } from "./PasswordSettings";
import "./chatFeed.css";
import Header from "../../Header";
import { toast } from "react-hot-toast";
import { kickUser } from "./ChatMessages";
import { accountService } from "../../../hooks/account_service";

type AdminPanelProps = {
  currentChannelId: number;
  userName: string;
};

const checkIfAdmin = (chanId: number) => {
  var config = {
    method: "post",
    url: "chat/isAdmin",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      userId: accountService.userLogin(),
      chanId: chanId,
    }),
  };
  axios(config)
    .then(function (response: any) {
      if (response.data === false) {
        window.location.href = "/social/chat";
      }
    })
    .catch(function (error: any) {});

  setTimeout(() => {
    checkIfAdmin(chanId);
  }, 700);
};

export const AdminPanel = (props: any) => {
  const navigate = useNavigate();
  const [redi, setRedi] = useState(false);
  const [chanUsers, setChanUsers] = useState<EUser[]>([]);
  const [notAdmin, setNotAdmin] = useState(false);
  const loc = useLocation();
  const sta = loc.state as AdminPanelProps;
  const chanId = sta.currentChannelId;
  const userName = sta.userName;

  useEffect(() => {
    const getChanUsers = async () => {
      async function getChanUsers() {
        var config = {
          method: "post",
          url: "chat/getChanUsers",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
          data: JSON.stringify({
            chanId: chanId,
          }),
        };
        axios(config)
          .then(function (response: any) {
            setChanUsers(response.data);
          })
          .catch(function (error: any) {});
      }
      getChanUsers();
      checkIfAdmin(chanId);
    };
    getChanUsers();
  }, [chanId]);

  useEffect(() => {
    const isAdmin = async () => {
      chanUsers.forEach((user: EUser) => {
        if (user.login === userName) {
          if (user.userType !== 0 && user.userType !== -1) {
            setNotAdmin(true);
          }
        }
      });
    };
    isAdmin();
  }, [chanUsers, userName]);

  useEffect(() => {
    if (notAdmin) return navigate("/social/chat");
  });

  async function updateUserStatus(userId: string, status: number) {
    try {
      var config = {
        method: "post",
        url: "chat/isAdmin",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          userId: props.userId,
          chanId: props.currentChannelId,
        }),
      };
      axios(config)
        .then(function (response: any) {
          if (response.data === false) {
            toast.success("You are not an admin anymore");
            window.location.reload();
          }
        })
        .catch(function (error: any) {});

      config = {
        method: "post",
        url: "chat/updateUserStatus",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          userId: userId,
          status: status,
          chanId: chanId,
        }),
      };
      axios(config)
        .then(function (response: any) {
          if (status === 0)
            toast.success("User is now an admin on this channel");
          else if (status === 1) toast.success("User is now a normal user");
          else if (status === 2)
            toast.success(
              "User is now muted, you can unmute him wheneven you want"
            );
          else if (status === 3)
            toast.success(
              "User is now banned, you can unban him wheneven you want"
            );
          window.location.reload();
        })
        .catch(function (error: any) {});
    } catch (error) {}
  }

  useEffect(() => {
    if (redi) return navigate("/social/chat");
  }, [redi, navigate]);

  return (
    <div>
      <Header />
      <Divider>
        <Typography> Admin Panel </Typography>
      </Divider>
      <div className="tableDiv">
        <table className="userAdminTable">
          <thead />
          <tbody>
            {chanUsers.map((user: EUser) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                {user.userType === -1 ? (
                  <td>Cannot modify channel owner</td>
                ) : null}
                {user.userType !== 1 ? (
                  <td></td>
                ) : (
                  <td>
                    <button
                      className="button"
                      onClick={() => updateUserStatus(user.login, 0)}
                    >
                      <div>Make Admin</div>
                    </button>
                  </td>
                )}
                {user.userType !== 0 ? (
                  <td></td>
                ) : (
                  <td>
                    <button
                      className="button"
                      onClick={() => updateUserStatus(user.login, 1)}
                    >
                      <div>UnMake Admin</div>
                    </button>
                  </td>
                )}
                {user.userType !== 1 ? (
                  <td></td>
                ) : (
                  <td>
                    <button
                      className="button"
                      onClick={() => updateUserStatus(user.login, 2)}
                    >
                      <div>Mute</div>
                    </button>
                  </td>
                )}
                {user.userType !== 2 ? (
                  <td></td>
                ) : (
                  <td>
                    <button
                      className="button"
                      onClick={() => updateUserStatus(user.login, 1)}
                    >
                      <div>UnMute</div>
                    </button>
                  </td>
                )}
                {user.userType !== -1 &&
                user.userType !== 0 &&
                user.userType !== 3 ? (
                  <td>
                    <button
                      className="button"
                      onClick={() => kickUser(user.login, chanId)}
                    >
                      <div>Kick</div>
                    </button>
                  </td>
                ) : (
                  <td></td>
                )}
                {user.userType !== 1 && user.userType !== 2 ? (
                  <td></td>
                ) : (
                  <td>
                    <button
                      className="button"
                      onClick={() => updateUserStatus(user.login, 3)}
                    >
                      <div>Ban</div>
                    </button>
                  </td>
                )}
                {user.userType !== 3 ? (
                  <td></td>
                ) : (
                  <td>
                    <button
                      className="button"
                      onClick={() => updateUserStatus(user.login, 1)}
                    >
                      <div>UnBan</div>
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Divider>Password Settings</Divider>
      <PasswordSettings currentChanId={chanId}></PasswordSettings>
      <Divider>
        <button
          className="button"
          onClick={() => {
            setRedi(!redi);
          }}
        >
          <div>Back</div>
        </button>
      </Divider>
    </div>
  );
};
