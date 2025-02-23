import { useState, useEffect } from "react";

export default function useFavorites() {
    const [favorites, setFavorites] = useState(new Set());
    const [favoritePostDetails, setFavoritePostDetails] = useState({});

    /* This loads the favorites from localStorage at startup - TODO fully comment*/
    useEffect(() => {
        const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
        setFavorites(new Set(storedFavorites));
    }, []);

    /* Function to fetch post details based on the favorites - TODO fully comment */
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

    /* Function to toggle favorite status for a post - TODO fully comment*/
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
