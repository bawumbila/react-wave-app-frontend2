import { useState, useEffect } from "react";
import "./App.css";
function App() {
  const [state, setState] = useState({
    user: null,
    tracks: [],
    topTracks: [],
    newTrack: {},
    searchedTrack: {},
  });
  async function loadTopTracks(e) {
    // if(!state.user) return;
    e.preventDefault();
    const BACKEND_URL = "https://wave-app-backend.herokuapp.com/api/tracks";
    // console.log(state.topTracks[state.newTrack.track].image[0].keys())
    if (state.newTrack.track !== -1 && state.newTrack.track) {
      // console.log(Object.entries(state.topTracks[state.newTrack.track].image[0])[0][1])
      const track = state.topTracks[state.newTrack.track];
      const BASE_URL =
        "https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=55b45039502bf33ba703cc81d8dc8e8d&artist=" +
        track.artist.name +
        "&track=" +
        track.name +
        "&format=json";
      const searchedTrack = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-type": "Application/json",
        },
      }).then((res) => res.json());
      console.log(searchedTrack);
      let image = "";
      if (searchedTrack.track.album) {
        // Gets the 2nd image. change first number to 0 to get first image.
        console.log(Object.entries(searchedTrack.track.album.image[1])[0][1]);
        image = Object.entries(searchedTrack.track.album.image[1])[0][1];
      }
      const tracktoSave = {
        title: searchedTrack.track.name,
        url: searchedTrack.track.url,
        artist: searchedTrack.track.artist.name,
        image: image,
        playcount: searchedTrack.track.playcount,
        artistURL: searchedTrack.track.artist.url,
      };
      const savedTrack = await fetch(BACKEND_URL, {
        method: "POST",
        headers: {
          "Content-type": "Application/json",
        },
        body: JSON.stringify(tracktoSave),
      }).then((res) => res.json());
      setState((prevState) => ({
        ...prevState,
        topTracks: [...prevState.tracks, savedTrack],
        newTrack: {
          artist: "kanye",
          title: "glory",
        },
        loadTrack: track,
      }));
      getAppData();
      getBackendData();
    } else {
      alert("please select a track from the dropdown.");
    }
  }
  async function searchTrack(e) {
    // if(!state.user) return;
    e.preventDefault();
    console.log(state.searchedTrack);
    const BASE_URL =
      "https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=55b45039502bf33ba703cc81d8dc8e8d&artist=" +
      state.searchedTrack.artistName +
      "&track=" +
      state.searchedTrack.trackName +
      "&format=json";
    console.log(BASE_URL);
    const searchedTrack = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-type": "Application/json",
      },
    }).then((res) => res.json());
    if (searchedTrack.message !== "Track not found") {
      console.log(searchedTrack.message);
      let image = "";
      if (searchedTrack.track.album) {
        // Gets the 2nd image. change first number to 0 to get first image.
        console.log(Object.entries(searchedTrack.track.album.image[1])[0][1]);
        image = Object.entries(searchedTrack.track.album.image[1])[0][1];
      }
      const tracktoSave = {
        title: searchedTrack.track.name,
        url: searchedTrack.track.url,
        artist: searchedTrack.track.artist.name,
        image: image,
        playcount: searchedTrack.track.playcount,
        artistURL: searchedTrack.track.artist.url,
      };
      const BACKEND_URL = "https://wave-app-backend.herokuapp.com/api/tracks";
      const savedTrack = await fetch(BACKEND_URL, {
        method: "POST",
        headers: {
          "Content-type": "Application/json",
        },
        body: JSON.stringify(tracktoSave),
      }).then((res) => res.json());
      setState((prevState) => ({
        ...prevState,
        topTracks: [...prevState.tracks, savedTrack],
        newTrack: {
          artist: "kanye",
          title: "glory",
        },
      }));
      getAppData();
      getBackendData();
      var inputOne = document.getElementById("resetableField1");
      var inputTwo = document.getElementById("resetableField2");
      inputOne.value = "";
      inputTwo.value = "";
    } else {
      alert("This track does not exist. Please search for a different track.");
    }
  }
  function handleChange(e) {
    console.log(e.target.name);
    console.log(e.target.value);
    setState((prevState) => ({
      ...prevState,
      newTrack: {
        ...prevState.newTrack,
        [e.target.name]: e.target.value,
      },
    }));
  }
  function handleSearchChange(e) {
    console.log(e.target.name);
    console.log(e.target.value);
    setState((prevState) => ({
      ...prevState,
      searchedTrack: {
        ...prevState.searchedTrack,
        [e.target.name]: e.target.value,
      },
    }));
  }
  async function handleDelete(trackId) {
    console.log("in handle delete");
    // if(!state.user) return;
    const URL = `https://wave-app-backend.herokuapp.com/api/tracks/${trackId}`;
    const tracks = await fetch(URL, {
      method: "DELETE",
    }).then((res) => res.json());
    getAppData();
    getBackendData();
  }
  // Get Backend Data
  async function getBackendData() {
    try {
      const BASE_URL = "https://wave-app-backend.herokuapp.com/api/tracks";
      const tracks = await fetch(BASE_URL).then((res) => res.json());
      console.log(tracks);
      setState((prevState) => ({
        ...prevState,
        tracks: tracks,
      }));
    } catch (error) {
      console.log(error);
    }
  }
  async function getAppData() {
    // if(!state.user) return;
    try {
      const BASE_URL =
        "https://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=55b45039502bf33ba703cc81d8dc8e8d&format=json"; // &limit=200
      const tracks = await fetch(BASE_URL).then((res) => res.json());
      console.log(tracks);
      setState((prevState) => ({
        ...prevState,
        topTracks: tracks.tracks.track,
      }));
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getAppData();
    getBackendData();
  }, []);
  return (
    <main className="App">
      <header className="App-header">
        <h1>WAVe Music Playlist App</h1>
      </header>
      <>
        <hr />
        <form onSubmit={loadTopTracks}>
          <label>
            <span className="topTracks">
              <span>Top Tracks</span>
            </span>
            <select name="track" onChange={handleChange}>
              <option key="default" value="-1">
                Select Top Track from dropdown.
              </option>
              {state.topTracks.map((s, idx) => (
                <option key={s.name} value={idx}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <button>Add to Playlist</button>
        </form>
        <>
          <hr />
          <form onSubmit={searchTrack}>
            <label>
              <span className="topTracks">
                <span>Track Name</span>
              </span>
              <input
                id="resetableField1"
                name="trackName"
                onChange={handleSearchChange}
              />
            </label>
            <label>
              <span className="topTracks">
                <span>Artist Name</span>
              </span>
              <input
                id="resetableField2"
                name="artistName"
                onChange={handleSearchChange}
              />
            </label>
            <button>Search Track</button>
          </form>
        </>
        {/* THIS IS WHERE YOU POPULATE THE PLAYLIST DATA */}
        <div className="container">
          {state.tracks.map((x, index) => (
            <article key={index}>
              <div className="lineItem">
                <img src={x.image}></img>
                <div className="songTitle">
                  {x.title} BY {x.artist}{" "}
                </div>
                <a href={x.url} target="_blank">
                  Play Track {"▶️"}
                </a>{" "}
                <div className="playCount1">
                  Play Count: <span>{x.playcount}</span>
                </div>
                <div className="delButton" onClick={() => handleDelete(x._id)}>
                  {"🚫"}
                </div>
              </div>
            </article>
          ))}
        </div>
        {/* END WHERE YOU POPULATE THE PLAYLIST DATA */}
      </>
      <footer className="footer">
        <p>&copy; WAVe Music 2021!</p>
      </footer>
    </main>
  );
}
export default App;
