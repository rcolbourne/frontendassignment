import { useState } from "react";

export default function InitialDisplay(){
    const [subreddit, setSubreddit] = useState("");
    const [error, setError] = useState("");

    const validateSubredditName = (name) => {
        const subredditRegex = /^[A-Za-z0-9_]{3,21}$/;
        return subredditRegex.test(name);
    };

    const handleSubmit = () => {
        if (validateSubredditName(subreddit)){
            alert(`Entered Subreddit: ${subreddit}`);
            setError(""); // clear any errors previously encounter
        } else {
            setError("Please enter a valid Subreddit name.");
        }
    };

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
                value={subreddit}
                onChange={(e) => setSubreddit(e.target.value)}
                placeholder="Enter a subreddit name..."
                style={{
                    padding: "8px",
                    width: "250px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    textAlign: "center",
                    merginTop: "10px"
                }}
            />
            {error && <p style={{ color: "red", margenTop: "10px" }}>{error}</p>}
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
                onClick={handleSubmit}
            >
                Submit
            </button>
        </div>
    );
}