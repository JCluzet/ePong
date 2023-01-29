import axios from "axios";
import { SyntheticEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { accountService } from "../../../hooks/account_service";
import "./chatFeed.css";

type PasswordSettingsProps = {
  currentChanId: number;
};

export const PasswordSettings = (props: PasswordSettingsProps) => {
  const [isPrivate, setIsPrivate] = useState(false);
  const [input, setInput] = useState("");
  const [fail, setFail] = useState(false);
  const [success, setSuccess] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [render, setRender] = useState(false);
  const [userName, setUserName] = useState("");

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
    const isPrivate = async () => {
      if (bool) {
        var config = {
          method: "post",
          url: "chat/getChanById",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
          data: JSON.stringify({
            chanId: props.currentChanId,
          }),
        };
        axios(config)
          .then(function (response: any) {
            setIsPrivate(response.data.isPrivate);
          })
          .catch(function (error: any) {});
      }
    };
    isPrivate();
    return () => {
      bool = false;
    };
  }, [props.currentChanId]);

  let checkInput = async (event: SyntheticEvent) => {
    event.preventDefault();
    try {
      var config = {
        method: "post",
        url: "chat/isAdmin",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          userId: userName,
          chanId: props.currentChanId,
        }),
      };
      axios(config)
        .then(function (response: any) {
          if (response.data === false) {
            toast.success("You are not an admin anymore");
            window.location.reload();
          } else {
            var config = {
              method: "post",
              url: "chat/checkPassword",
              headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
                "Content-Type": "application/json",
              },
              data: JSON.stringify({
                password: input,
                chanId: props.currentChanId,
              }),
            };
            axios(config)
              .then(function (response: any) {
                if (response.data === true) {
                  setSuccess(true);
                  setFail(false);
                } else {
                  setFail(true);
                }
              })
              .catch(function (error: any) {});
          }
        })
        .catch(function (error: any) {});
    } catch (error) {}
  };

  async function removePassword() {
    try {
      var config = {
        method: "post",
        url: "chat/isAdmin",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          userId: userName,
          chanId: props.currentChanId,
        }),
      };
      axios(config)
        .then(function (response: any) {
          if (response.data === false) {
            toast.success("You are not an admin anymore");
            window.location.reload();
          } else {
            var config = {
              method: "post",
              url: "chat/changePassword",
              headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
                "Content-Type": "application/json",
              },
              data: JSON.stringify({
                newPassword: "",
                chanId: props.currentChanId,
              }),
            };
            axios(config)
              .then(function (response: any) {
                toast.success("Password has successfully been removed");
                window.location.reload();
              })
              .catch(function (error: any) {});
          }
        })
        .catch(function (error: any) {});
    } catch (error) {}
  }

  let submit = async (event: SyntheticEvent) => {
    event.preventDefault();
    try {
      var config = {
        method: "post",
        url: "chat/isAdmin",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          userId: userName,
          chanId: props.currentChanId,
        }),
      };
      axios(config)
        .then(function (response: any) {
          if (response.data === false) {
            toast.success("You are not an admin anymore");
            window.location.reload();
          } else {
            var config = {
              method: "post",
              url: "chat/changePassword",
              headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
                "Content-Type": "application/json",
              },
              data: JSON.stringify({
                newPassword: newPassword,
                chanId: props.currentChanId,
              }),
            };
            axios(config)
              .then(function (response: any) {
                toast.success("Password has successfully been changed");
                window.location.reload();
              })
              .catch(function (error: any) {});
          }
        })
        .catch(function (error: any) {});
    } catch (error) {}
  };

  function renderSettings() {
    if (render) {
      return (
        <form onSubmit={submit}>
          <div style={{ padding: "10px" }}>
            <label htmlFor="floatingInput"> New Password </label>
            <input
              required
              type="password"
              id="floatingInput"
              onChange={(e) => setNewPassword(e.target.value)}
            ></input>
            <button className="button" type="submit">
              Submit
            </button>
          </div>
        </form>
      );
    } else {
      return;
    }
  }

  if (isPrivate) {
    return (
      <div className="passWordDiv">
        <form onSubmit={checkInput}>
          <div style={{ padding: "10px" }}>
            {fail === false ? (
              <label htmlFor="floatingInput"> Enter current password </label>
            ) : (
              <label htmlFor="floatingInput">
                {" "}
                Wrong input, please try again{" "}
              </label>
            )}
            <input
              required
              type="password"
              id="floatingInput"
              onChange={(e) => setInput(e.target.value)}
            ></input>
            <button className="button">Submit</button>
          </div>
        </form>
        {success ? (
          <div>
            <div>
              <button
                className="button"
                type="submit"
                onClick={() => setRender(!render)}
              >
                Change password
              </button>
              <button className="button" type="submit" onClick={removePassword}>
                Remove password
              </button>
              {renderSettings()}
            </div>
          </div>
        ) : null}
      </div>
    );
  } else {
    return (
      <div className="passWordDiv">
        <label color="#0000" htmlFor="defaultCheck1">
          Add password{" "}
        </label>
        <input
          className="form-check-input"
          type="checkbox"
          value=""
          id="defaultCheck1"
          onChange={() => setRender(!render)}
        />
        {renderSettings()}
      </div>
    );
  }
};
