// src/App.js
import React, { useState } from "react";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    const newMessages = [...messages, { sender: "You", text: input }];
    setMessages(newMessages);
    setInput("");

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "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",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a friendly mental health and partner robot." },
          ...newMessages.map(msg => ({
            role: msg.sender === "You" ? "user" : "assistant",
            content: msg.text,
          }))
        ]
      }),
    });

    const data = await res.json();
    const botReply = data.choices[0].message.content;

    setMessages([...newMessages, { sender: "Bot", text: botReply }]);

    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(botReply);
    synth.speak(utter);
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial", maxWidth: "700px", margin: "auto" }}>
      <h1>🤖 AI Therapy Partner</h1>
      <div style={{ minHeight: "300px", border: "1px solid #ccc", padding: "10px", borderRadius: "10px" }}>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div style={{ marginTop: "20px" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Say something..."
          style={{ padding: "10px", width: "70%" }}
        />
        <button onClick={handleSend} style={{ padding: "10px 20px", marginLeft: "10px" }}>
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
