/*
FILE:           useSubredditPost.jsx
PROJECT:        Front End Programming Assignment - SENG3080 - Advanced Web Frameworks
PROGRAMMER:     Richard Colbourne
FIRST VERSION:  February 22, 2025
DESCRIPTION:    Manages the fetching and storing of subreddit posts
*/

import { useState, useEffect } from "react";

export default function useSubredditPosts() {
    const [subreddit, setSubreddit] = useState("");
    const [error, setError] = useState("");
    const [postIds, setPostIds] = useState([]);
    const [postDetails, setPostDetails] = useState({});
    const [loading, setLoading] = useState(false);

    //
    //  Name    : validateSubredditName
    //  Purpose : Validates the formatting is valid for a subreddit name
    //  Inputs  : name - the name of the subreddit name to validate
    //  Outputs : none
    //  Returns : true if valid, false otherwise
    //
    const validateSubredditName = (name) => {
        const subredditRegex = /^[A-Za-z0-9_]{3,21}$/;
        return subredditRegex.test(name);
    };

    //
    //  Name    : fetchSubredditPosts
    //  Purpose : Fetches the subreddit post list
    //  Inputs  : none
    //  Outputs : Updates postIds and reset postDetails
    //  Returns : nothing
    //
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

    //
    //  Name    : fetchPostDetails
    //  Purpose : Fetches the details for each post
    //  Inputs  : none
    //  Outputs : Updates postDetails with fetched information
    //  Returns : nothing
    //
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

    //
    //  Name    : useEffect (fetchPostDetails)
    //  Purpose : Triggers the fetching of details for each post
    //  Inputs  : postIds - the list of post IDs to fetch details for
    //  Outputs : Calls fetchPostDetails when postIds is updated
    //  Returns : nothing
    //
    useEffect(() => {
        if (postIds.length > 0) {
            fetchPostDetails();
        }
    }, [postIds]);

    return { subreddit, setSubreddit, error, postIds, postDetails, loading, fetchSubredditPosts };
}
