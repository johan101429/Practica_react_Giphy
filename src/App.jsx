import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { Card } from './components/card';

const GIPHY_API_KEY = '79H1jwwWMRJUUSaoO1ckHO6wRA9radI7';
const GIPHY_URL_SEARCH = 'https://api.giphy.com/v1/gifs/search';
const GIPHY_URL_TRENDING = 'https://api.giphy.com/v1/gifs/trending';

function App() {
  const [characters, setCharacters] = useState([]);
  const [gifs, setGifs] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const fetchTrendingGifs = async () => {
      try {
        const response = await axios.get(GIPHY_URL_TRENDING, {
          params: {
            api_key: GIPHY_API_KEY,
            limit: 20,
          },
        });
        setGifs(response.data.data);
      } catch (error) {
        console.error('Error fetching trending GIFs:', error);
      }
    };

    fetchTrendingGifs();
  }, []);

  // eslint-disable-next-line no-unused-vars
  const fetchAllCharacters = async () => {
    try {
      let allCharacters = [];
      let nextPage = URL;

      while (nextPage) {
        const response = await fetch(nextPage);
        const data = await response.json();
        allCharacters = [...allCharacters, ...data.results];
        nextPage = data.info.next;
      }

      const formattedCharacters = allCharacters.map(character => ({
        name: character.name,
        image: character.image,
        status: character.status,
        species: character.species,
        gender: character.gender,
        origin: character.origin.name,
      }));

      setCharacters(formattedCharacters);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const searchGifs = async (query) => {
    try {
      const response = await axios.get(GIPHY_URL_SEARCH, {
        params: {
          api_key: GIPHY_API_KEY,
          q: query,
          limit: 20,
        },
      });
      setGifs(response.data.data);
    } catch (error) {
      console.error('Error fetching GIFs:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchGifs(query);
  };

  return (
    <>
      <div className="card-container">
        {characters.map((character, index) => (
          <Card
            key={index}
            nameCharacter={character.name}
            imgCharacter={character.image}
            statusCharacter={character.status}
            speciesCharacter={character.species}
            genderCharacter={character.gender}
            originCharacter={character.origin}
          />
        ))}
      </div>
      

      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar GIFs"
        />
        <button type="submit">Buscar</button>
      </form>

      <div className="gif-container">
        {gifs.map((gif) => (
          <div key={gif.id}>
            <h4>{gif.title}</h4>
            <img src={gif.images.fixed_height.url} alt={gif.title} />
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
