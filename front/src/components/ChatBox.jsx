import React from "react";
import "../styles/list.css";
import {useState} from 'react';
import "../styles/chatbox.css"


class SendMessageForm extends React.Component {
    constructor() {
        super()
        this.state = {
            sender: true,
            message: ''
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    
    handleChange(e) {
        this.setState({
            message: e.target.value
        })
    }
    
    handleSubmit(e) {
        e.preventDefault()
        this.props.sendMessage(this.state.message, this.state.sender)
        this.setState({
            message: '',
            sender: true
        })
    }
    
    render() {
        return (
            <form
                onSubmit={this.handleSubmit}
                className="send-message-form">
                <input
                    onChange={this.handleChange}
                    value={this.state.message}
                    placeholder="Type your message and hit ENTER"
                    type="text" />
            </form>
        )
    }
}

class ChatContainer extends React.Component
{
    render() {
        return (
            <div className="scrollable-div">
            <ul className="message-list">
                {this.props.messages.map(({senderId, text}) => {
                    return (
                        <li key="Template" className="message">
                        <div>
                            {this.props.messages.sender ? 
                                <div className="sender">
                                    <p className="container-shiny">{text}</p>
                                </div>
                                :
                                <div>
                                    <p>{senderId}</p>
                                </div>
                            }
                            <div className="container-shiny">
                                {text}
                            </div>
                        </div>
                    </li>
                )}
                )}
            </ul>
            </div>
        )
    }
}

function Title() {
    return <p class="title">template</p>
}

export default function ChatBox() {
    
    const [messages, setmessage] = useState([{
        senderId: "malick",
        text: "who'll win?"
      },
      {
        senderId: "drakk",
        text: "ill win"
      }]);
    
    const sendMessage = (text, id) => {
        const newMessage = messages.slice();
        newMessage.push({text, 'sender': true});
        setmessage(newMessage);
    }


    return (
        <div className="scrollable-div">
            <div className="container-shiny">
                <Title/>
                <ChatContainer messages = {messages} />
                <SendMessageForm sendMessage = {sendMessage}/>
            </div>
        </div>
    )
}

