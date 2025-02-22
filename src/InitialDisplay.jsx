import { useState, useEffect } from "react";

export default function InitialDisplay(){
    const [subreddit, setSubreddit] = useState("");
    const [error, setError] = useState("");
    const [postIds, setPostIds] = useState([]);
    const [postDetails, setPostDetails] = useState({});
    const [expandedPosts, setExpandedPosts] = useState({});
    const [loading, setLoading] = useState(false);
    

    /* function to validate the user input is a valid subreddit name (format only) - TODO: fully comment */
    const validateSubredditName = (name) => {
        const subredditRegex = /^[A-Za-z0-9_]{3,21}$/;
        return subredditRegex.test(name);
    };

    /* function to fetch subreddit posts - TODO: fully comment */
    const fetchSubredditPosts = async () => {
        if (!validateSubredditName(subreddit)) {
            setError("Please enter a valid subreddit name.");
            return;
        }

        setLoading(true);
        setError("");
        try {
            const response = await fetch(`https://www.reddit.com/r/${subreddit}/hot.json?limit=10`);
            const data = await response.json();

            if (data.error) {
                setError("Subreddit not found.");
                setPostIds([]);
                setPostDetails({});
            } else {
                const ids = data.data.children.map(post => post.data.id);
                setPostIds(ids);
                setPostDetails({});
            }
        } catch (err) {
            setError("Error fetching subreddit.");
            console.error(err);
        }
        setLoading(false);
    };

    /* function to get the post details after the IDs are fetched - TODO: fully comment */
    useEffect(() => {
        const fetchPostDetails = async () => {
            const details = {};
            for (const id of postIds) {
                try {
                    const response = await fetch(`https://www.reddit.com/comments/${id}.json`);
                    const data = await response.json();
                    if (data[0]?.data?.children[0]?.data) {
                        details[id] = data[0].data.children[0].data;
                    }
                } catch (err) {
                    console.error(`Error fetching post ${id}`, err);
                }
            }
            setPostDetails(details);
        };

        if (postIds.length > 0) {
            fetchPostDetails();
        }
    }, [postIds]);

    /* function to toggle the expanded posts - TODO: fully comment */
    const toggleExpand = (id) => {
        setExpandedPosts(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    return (
        <div 
            style={{
                display: "flex",
                height: "100vh",
                width: "100vw",
            }}
        >
            {/* Left Side Starts - This side is for the user input */}
            <div 
                style={{
                    width: "30%",
                    padding: "20px",
                    borderRight: "1px solid #ccc",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                <p style={{ fontSize: "20px", fontWeight: "bold" }}>
                    Enter a Subreddit Name:
                </p>
                <input  
                    type="text"
                    value={subreddit}
                    onChange={(e) => setSubreddit(e.target.value)}
                    placeholder="Enter subreddit..."
                    style={{
                        padding: "8px",
                        width: "250px",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                        textAlign: "center",
                        marginTop: "10px"
                    }}
                />
                {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
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
                    onClick={fetchSubredditPosts}
                >
                    {loading ? "Loading..." : "Submit"}
                </button>
            </div>

            {/* Right Side Starts - This side is for the subreddit posts */}
            <div style={{ width: "70%", padding: "20px", overflowY: "auto" }}>
                <h2>Posts from r/{subreddit}</h2>
                {loading && <p>Loading posts...</p>}
                {!loading && postIds.length === 0 && <p>No posts found.</p>}
                <ul>
                    {postIds.map((id) => (
                        <li key={id} style={{ marginBottom: "15px", padding: "10px", borderBottom: "1px solid #ddd" }}>
                            <a 
                                href={`https://www.reddit.com/comments/${id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ fontWeight: "bold" }}
                            >
                                View Post ({id})
                            </a>
                            {postDetails[id] && (
                                <div>
                                    <p><strong>Title:</strong> {postDetails[id].title}</p>
                                    <p><strong>Author:</strong> {postDetails[id].author}</p>
                                    <p><strong>Upvotes:</strong> {postDetails[id].ups}</p>

                                    {/* Post Content Preview */}
                                    {postDetails[id].selftext && (
                                        <div>
                                            <p><strong>Content:</strong></p>
                                            <p style={{
                                                whiteSpace: "pre-wrap",
                                                overflow: "hidden",
                                                display: "-webkit-box",
                                                WebkitLineClamp: expandedPosts[id] ? "unset" : "5",
                                                WebkitBoxOrient: "vertical"
                                            }}>
                                                {postDetails[id].selftext}
                                            </p>
                                            {postDetails[id].selftext.length > 300 && (
                                                <button 
                                                    onClick={() => toggleExpand(id)} 
                                                    style={{
                                                        marginTop: "5px",
                                                        padding: "5px 10px",
                                                        backgroundColor: "gray",
                                                        color: "white",
                                                        border: "none",
                                                        borderRadius: "3px",
                                                        cursor: "pointer"
                                                    }}
                                                >
                                                    {expandedPosts[id] ? "Show Less" : "Show More"}
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}