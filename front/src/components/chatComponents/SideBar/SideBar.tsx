import { Col, Divider, Row } from "antd";
import axios from "axios";
import { SyntheticEvent, useEffect, useState } from "react";
import { Chan } from "../Models/chan";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

type SideBarChannelsProps = {
  setCurrentChannelId: Function;
  userName: string;
};

const SideBarChannels = (props: SideBarChannelsProps) => {
  const [chans, setChans] = useState<Array<Chan>>([]);
  useEffect(() => {
    let bool = true;
    const getChans = async () => {
      var config = {
        method: "post",
        url: "chat/getChansByUserId",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          userId: props.userName,
        }),
      };
      axios(config)
        .then(function (response: any) {
          let res: Chan[];
          res = response.data.filter((channel: any) => !channel.isDirectConv);
          if (bool) setChans(res);
        })
        .catch(function (error: any) {});
    };
    getChans();
    return () => {
      bool = false;
    };
  }, [props.userName]);

  let checkIfBanned = async (e: SyntheticEvent, chanId: number) => {
    e.preventDefault();
    if (chanId !== 0) {
      var config = {
        method: "post",
        url: "chat/isBanned",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          userId: props.userName,
          chanId: chanId,
        }),
      };
      axios(config)
        .then(function (response: any) {
          if (response.data === true)
            toast.error("You have been banned from this channel");
          else props.setCurrentChannelId(chanId);
        })
        .catch(function (error: any) {});
    }
  };

  return (
    <div>
      <Divider orientation={"center"}>Group Messages</Divider>
      <Col>
        {chans.map((chan: Chan) => (
          <Row
            justify="center"
            key={chan.id}
            style={{ marginLeft: "25px", padding: "5px" }}
          >
            <button
              onClick={(e) => checkIfBanned(e, chan.id)}
              className="button"
            >
              <div> {chan.name} </div>
            </button>
          </Row>
        ))}
      </Col>
    </div>
  );
};

type RenderDirectConvsProps = {
  setCurrentChannelId: Function;
  userName: string;
  directConv: Chan;
  chanId: number;
};
const RenderDirectConvs = (props: RenderDirectConvsProps) => {
  const [name, setName] = useState("");

  let checkIfBanned = async (e: SyntheticEvent, chanId: number) => {
    e.preventDefault();
    if (chanId !== 0) {
      var config = {
        method: "post",
        url: "chat/isBanned",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          userId: props.userName,
          chanId: chanId,
        }),
      };
      axios(config)
        .then(function (response: any) {
          if (response.data === true)
            toast.error("You have been banned from this channel");
          else props.setCurrentChannelId(chanId);
        })
        .catch(function (error: any) {});
    }
  };

  useEffect(() => {
    let bool = true;
    const getUsers = async () => {
      let chanId = props.directConv.id;
      if (bool) {
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
            let i: number = 0;
            response.data.forEach((u: any) => {
              i++;
              if (u.login !== props.userName) setName(u.name);
            });
            if (i !== 2) setName("");
          })
          .catch(function (error: any) {});
      }
    };
    getUsers();
    return () => {
      bool = false;
    };
  }, [props.directConv.id, props.userName]);

  return (
    <button onClick={(e) => checkIfBanned(e, props.chanId)} className="button">
      <div> {name.length !== 0 ? name : props.userName} </div>
    </button>
  );
};

type SideBarDirectConvsProps = {
  userName: string;
  currentChannelId: number;
  setCurrentChannelId: Function;
};

const SideBarDirectConvs = (props: SideBarDirectConvsProps) => {
  const [directConvs, setDirectConvs] = useState<Array<Chan>>([]);

  useEffect(() => {
    const getChans = async () => {
      var config = {
        method: "post",
        url: "chat/getChansByUserId",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          userId: props.userName,
        }),
      };
      axios(config)
        .then(function (response: any) {
          if (response.data) {
            let res: Chan[];
            res = response.data.filter((channel: any) => channel.isDirectConv);
            setDirectConvs(res);
          }
        })
        .catch(function (error: any) {});
    };
    getChans();
  }, [props.userName]);

  return (
    <div>
      <Divider orientation="center">Direct Messages</Divider>
      <Col>
        {directConvs.map((conv: Chan) => (
          <Row
            justify="center"
            key={conv.id}
            style={{ marginLeft: "25px", padding: "5px" }}
          >
            <RenderDirectConvs
              key={conv.id}
              setCurrentChannelId={props.setCurrentChannelId}
              userName={props.userName}
              directConv={conv}
              chanId={conv.id}
            />
          </Row>
        ))}
      </Col>
    </div>
  );
};

type SideBarProps = {
  userName: string;
  currentChannelId: number;
  setCurrentChannelId: Function;
};

export const SideBar = (props: SideBarProps) => {
  return (
    <div className="sideBar">
      <SideBarChannels
        setCurrentChannelId={props.setCurrentChannelId}
        userName={props.userName}
      />
      <SideBarDirectConvs
        userName={props.userName}
        currentChannelId={props.currentChannelId}
        setCurrentChannelId={props.setCurrentChannelId}
      />
      <Divider orientation="center">
        <Link to="createConv">
          <Divider>
            <button className="button">
              <div> + </div>
            </button>
          </Divider>
        </Link>
      </Divider>
    </div>
  );
};
