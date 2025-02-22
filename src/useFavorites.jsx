import {useState, useEffect} from "react";

export default function useFavorites() {
    const [favorites, setFavorites] = useState(new Set());

    // this loads the favorites from localStorage at startup - TODO: fully comment
    useEffect(() => {
        const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
        setFavorites(new Set(storedFavorites));
    }, []);

    // function to toggle if a post is a favorite or not - TODO: fully comment
    const toggleFavorite = (id) => {
        setFavorites(preFavorites => {
            const updatedFavorites = new Set(preFavorites);
            if (updatedFavorites.has(id)) {
                updatedFavorites.delete(id); // remove
            }
            else
            {
                updatedFavorites.add(id);  // add
            }
            // store in localstorage
            localStorage.setItem("favorites", JSON.stringify([...updatedFavorites]));
            return updatedFavorites;
        });
    };
    return {favorites, toggleFavorite};
}

