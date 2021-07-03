import TextField from "@material-ui/core/TextField"
import React, { useEffect, useRef, useState } from "react"
import io from "socket.io-client"
import "./App.css"

function App() {
    const [state, setState] = useState({ message: "", name: "Fathor" })
    const [chat, setChat] = useState([])
    const [user1, setUser1] = useState(true);
    const [user2, setUser2] = useState(false);

    const socketRef = useRef()

    useEffect(
        () => {
            socketRef.current = io.connect("http://3.16.10.71:4000")
            socketRef.current.on("message", ({ name, message }) => {
                setChat([...chat, { name, message }])
            })
            return () => socketRef.current.disconnect()
        }, [chat]
    )

    const onTextChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value })
    }

    const onMessageSubmit = (e) => {
        const { name, message } = state
        socketRef.current.emit("message", { name, message })
        e.preventDefault()
        setState({ message: "", name })
    }

    const renderChat = () => {
        return chat.map(({ name, message }, index) => (
            <div key={index}>
                {name === "Fathor" ?
                    <div className="chat-right">
                        <name>
                            {name}
                        </name>
                        <br></br>
                        {message}
                    </div>
                    : <div className="chat-left">
                        <name>
                            {name}
                        </name>
                        <br></br>
                        {message}
                    </div>
                }
            </div>
        ))
    }

    function changeUserActive(name) {
        if (name === 'Fathor') {
            setState({ ...state, name: 'Fathor' })
            setUser1(true); setUser2(false);
        } else {
            setState({ ...state, name: 'Rosi' })
            setUser1(false); setUser2(true);
        }
    }

    return (
        <div className="card">
            <div className="chat">
                <button disabled={user1} onClick={() => changeUserActive('Fathor')}> Fathor </button> &nbsp;
                <button disabled={user2} onClick={() => changeUserActive('Rosi')}> Rosi </button>
                <h1>Chat With React</h1>
                {renderChat()}
                <div className="message">
                    <TextField
                        name="message"
                        onChange={(e) => onTextChange(e)}
                        value={state.message}
                        id="outlined-multiline-static"
                        variant="outlined"
                        label="Message"
                    />
                    <button onClick={onMessageSubmit}>Send Message</button>
                </div>
            </div>
        </div>
    )
}
export default App

