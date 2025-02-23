/*
FILE:           useFavorites.jsx
PROJECT:        Front End Programming Assignment - SENG3080 - Advanced Web Frameworks
PROGRAMMER:     Richard Colbourne
FIRST VERSION:  February 22, 2025
DESCRIPTION:    Manages the favorite posts of the user, storing them in localStorage
                and fetching details from Reddit.
*/

import { useState, useEffect } from "react";

export default function useFavorites() {
    const [favorites, setFavorites] = useState(new Set());
    const [favoritePostDetails, setFavoritePostDetails] = useState({});

    //
    //  Name    : useEffect (loadFavorites)
    //  Purpose : Loads the favorites from localStorage
    //  Inputs  : none
    //  Outputs : Updates storedFavorites with stored favorite post IDs
    //  Returns : nothing
    //
    useEffect(() => {
        const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
        setFavorites(new Set(storedFavorites));
    }, []);

    //
    //  Name    : useEffect (fetchFavoriteDetails)
    //  Purpose : Fetches the details for each post
    //  Inputs  : favorites - the array of favorite IDs to fetch details for
    //  Outputs : Updates favoritePostDetails with fetched information
    //  Returns : nothing
    //
    useEffect(() => {
        const fetchFavoriteDetails = async () => {
            const details = {};
            for (const id of favorites) {
                try {
                    const response = await fetch(`https://www.reddit.com/comments/${id}.json`);
                    const data = await response.json();
                    if (data[0]?.data?.children[0]?.data) {
                        details[id] = data[0].data.children[0].data;
                    }
                } catch (err) {
                    console.error(`Error fetching favorite post ${id}`, err);
                }
            }
            setFavoritePostDetails(details);
        };

        if (favorites.size > 0) {
            fetchFavoriteDetails();
        } else {
            setFavoritePostDetails({});
        }
    }, [favorites]); // Runs whenever favorites change

    //
    //  Name    : toggleFavorite
    //  Purpose : Add/Remove a post from the favorites list
    //  Inputs  : id - the unique identifier of the post
    //  Outputs : Updates and stores the favorites list to localStorage
    //  Returns : nothing
    //
    const toggleFavorite = (id) => {
        setFavorites((prevFavorites) => {
            const updatedFavorites = new Set(prevFavorites);
            if (updatedFavorites.has(id)) {
                updatedFavorites.delete(id); // Remove from favorites
            } else {
                updatedFavorites.add(id);  // Add to favorites
            }

            // Store in localStorage
            localStorage.setItem("favorites", JSON.stringify([...updatedFavorites]));
            return updatedFavorites;
        });
    };

    return { favorites, toggleFavorite, favoritePostDetails };
}
