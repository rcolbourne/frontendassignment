/*
FILE:           InitialDisplay.jsx
PROJECT:        Front End Programming Assignment - SENG3080 - Advanced Web Frameworks
PROGRAMMER:     Richard Colbourne
FIRST VERSION:  February 22, 2025
DESCRIPTION:    This file contains all of the UI presentation code for the application.
                Users can enter a subreddit name which then fetches the top 10 "hot" posts
                which can then be favorites/unfavorited.
*/

import { useState } from "react";
import useSubredditPosts from "./useSubredditPosts";
import useFavorites from "./useFavorites";
import "./InitialDisplay.css";

// Custom hook used to fetch the subreddit posts
export default function InitialDisplay() {
    const {
        subreddit,
        setSubreddit,
        error,
        postIds,
        postDetails,
        loading,
        fetchSubredditPosts
    } = useSubredditPosts();

    const [expandedPosts, setExpandedPosts] = useState({});
    const { favorites, toggleFavorite, favoritePostDetails } = useFavorites();

    //
    //  Name    : toggleExpand
    //  Purpose : Toggles the expanded state for a post
    //  Inputs  : id - the unique identifier for the post
    //  Outputs : none
    //  Returns : nothing
    //
    const toggleExpand = (id) => {
        setExpandedPosts((prev) => ({
            ...prev,
            [id]: !prev[id],  
        }));
    };

    return (
        <div className="container">
            {/* Left Side - User Input */}
            <div className="left-panel">
                <p>Enter a Subreddit Name:</p>
                <input
                    type="text"
                    value={subreddit}
                    onChange={(e) => setSubreddit(e.target.value)}
                    placeholder="Enter subreddit..."
                    className="input-box"
                />
                {error && <p className="error-text">{error}</p>}
                <button className="submit-button" onClick={fetchSubredditPosts}>
                    {loading ? "Loading..." : "Submit"}
                </button>
            </div>
    
            {/* Right Side - Subreddit Posts */}
            <div className="right-panel">
                <h2>Posts from r/{subreddit}</h2>
                {loading && <p>Loading posts...</p>}
                {!loading && postIds.length === 0 && <p>No posts found.</p>}
                <ul className="post-list">
                    {postIds.map((id) => (
                        <li key={id}>
                            <a href={`https://www.reddit.com/comments/${id}`} target="_blank" rel="noopener noreferrer" className="post-title">
                                View Post ({id})
                            </a>
                            {postDetails[id] && (
                                <div>
                                    <p><strong>Title:</strong> {postDetails[id].title}</p>
                                    <p><strong>Author:</strong> {postDetails[id].author}</p>
                                    <p><strong>Upvotes:</strong> {postDetails[id].ups}</p>
    
                                    {postDetails[id].selftext && (
                                        <div>
                                            <p><strong>Content:</strong></p>
                                            <p className="post-content" style={{ WebkitLineClamp: expandedPosts[id] ? "unset" : "5" }}>
                                                {postDetails[id].selftext}
                                            </p>
                                            {postDetails[id].selftext.length > 300 && (
                                                <div>
                                                    <button className="expand-button" onClick={() => toggleExpand(id)}>
                                                        {expandedPosts[id] ? "Show Less" : "Show More"}
                                                    </button>
                                                    <button 
                                                        className={`favorite-button ${favorites.has(id) ? "favorite-true" : "favorite-false"}`} 
                                                        onClick={() => toggleFavorite(id)}
                                                    >
                                                        {favorites.has(id) ? "Unfavorite?" : "Favorite?"}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
    
            {/* Favorites Section */}
            <div className="right-panel">
                <h2>Your Favorite Posts</h2>
                {favorites.size === 0 ? (
                    <p>No favorite posts yet.</p>
                ) : (
                    <ul className="post-list">
                        {[...favorites].map((id) => (
                            <li key={id}>
                                <a href={`https://www.reddit.com/comments/${id}`} target="_blank" rel="noopener noreferrer" className="post-title">
                                    View Post ({id})
                                </a>
    
                                {favoritePostDetails[id] && (
                                    <div>
                                        <p><strong>Title:</strong> {favoritePostDetails[id].title}</p>
                                        <p><strong>Author:</strong> {favoritePostDetails[id].author}</p>
                                        <p><strong>Upvotes:</strong> {favoritePostDetails[id].ups}</p>
    
                                        {favoritePostDetails[id].selftext && (
                                            <div>
                                                <p><strong>Content:</strong></p>
                                                <p className="post-content" style={{ WebkitLineClamp: expandedPosts[id] ? "unset" : "5" }}>
                                                    {favoritePostDetails[id].selftext}
                                                </p>
                                                {favoritePostDetails[id].selftext.length > 300 && (
                                                    <div>
                                                        <button className="expand-button" onClick={() => toggleExpand(id)}>
                                                            {expandedPosts[id] ? "Show Less" : "Show More"}
                                                        </button>
                                                        <button 
                                                            className={`favorite-button ${favorites.has(id) ? "favorite-true" : "favorite-false"}`} 
                                                            onClick={() => toggleFavorite(id)}
                                                        >
                                                            {favorites.has(id) ? "Unfavorite" : "Favorite"}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );    
}
