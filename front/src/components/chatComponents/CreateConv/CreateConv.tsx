import { Box, Typography } from "@mui/material";
import { Divider } from "antd";
import { SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../Header";

export const CreateConv = () => {
  const navigate = useNavigate();

  const createGroupConv = (event: SyntheticEvent) => {
    event.preventDefault();
    return navigate("/social/chat/createGroupConv");
  };

  const createDirectConv = (event: SyntheticEvent) => {
    event.preventDefault();
    return navigate("/social/chat/createDirectConv");
  };

  const joinConv = (event: SyntheticEvent) => {
    event.preventDefault();
    return navigate("/social/chat/joinConversation");
  };
  return (
    <div>
      <Header />
      <div className="center">
        <div className="container-home">
          <Typography
            fontSize={32}
            color="textSecondary"
            align="center"
            marginTop="30px"
            fontStyle={"italic"}
          >
            Choose the conversation mode that you want to create{" "}
          </Typography>
          <Box sx={{ flexGrow: 1, p: 3 }} />
          <div className="comvButton">
            <Divider>
              <button className="button" onClick={createGroupConv}>
                <div className="text-social">Group Conversation</div>
              </button>
            </Divider>

            <Box sx={{ flexGrow: 1, p: 3 }} />
            <Divider>
              <button className="button" onClick={createDirectConv}>
                <div className="text-social">Private Conversation</div>
              </button>
            </Divider>
          </div>
          <Typography
            fontSize={32}
            color="textSecondary"
            align="center"
            marginTop="30px"
            fontStyle={"italic"}
          >
            {" "}
            Or{" "}
          </Typography>
          <Box sx={{ flexGrow: 1, p: 3 }} />
          <Divider>
            <button className="button" onClick={joinConv}>
              <div className="text-social">Join a Conversation</div>
            </button>
          </Divider>
        </div>
      </div>
    </div>
  );
};
