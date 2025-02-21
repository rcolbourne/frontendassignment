import { useState } from "react";

export default function InitialDisplay(){
    const [inputText, setInputText] = useState("");
    return (
        <div 
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                width: "100vw", 
                textAlign: "center"
            }}
        >
            <p 
                style={{ 
                    fontSize: "20px", 
                    fontWeight: "bold" 
                }}
            >
                Enter a URL:
            </p>
            <input  
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter a URL..."
                style={{
                    padding: "8px",
                    width: "250px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    textAlign: "center",
                    merginTop: "10px"
                }}
            />
            <button 
                style={{
                    marginTop: "10px",
                    padding: "10px 20px",
                    backgroundColor: "blue",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer"
                }}
                onClick={() => alert(`Entered URL: ${inputText}`)}
            >
                Submit
            </button>
        </div>
    );
}