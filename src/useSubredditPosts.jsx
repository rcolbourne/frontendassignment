import { useState, useEffect } from "react";

export default function useSubredditPosts() {
    const [subreddit, setSubreddit] = useState("");
    const [error, setError] = useState("");
    const [postIds, setPostIds] = useState([]);
    const [postDetails, setPostDetails] = useState({});
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

    return { subreddit, setSubreddit, error, postIds, postDetails, loading, fetchSubredditPosts };
}
