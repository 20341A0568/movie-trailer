// import {UseEffect} from 'react';
// import axios from 'axios';
// import './App.css';
// function App(){
//   const API_URL = "https://api.themoviedb.org/3/"
//   const fetchMovies =async () =>{
//     const {data} = await axios.get(url: '${API_URL}/discover/movie', config: {
//       params: {
//         api_key : Process.env.REACT_APP_MOVIE_API_KEY
//       }
//     })
//     console.log('data', data);
//   }
//   useEffect( effect()=> 
//   {

//   }, deps:[])
//   return (
//     <div className='App'>
//       <h1>HelloWorld</h1>
//     </div>
//   )
// };

// export default App;
import {useEffect, useState} from "react"
import './App.css'
import axios from 'axios'
import Movie from "./components/Movie"
import Youtube from 'react-youtube'


// import 'bootstrap/dist/css/bootstrap.min.css';
// import Feedback from "react-bootstrap/esm/Feedback"
//import Feed from "./components/Feedback"

function App() {
    
    const MOVIE_API = "https://api.themoviedb.org/3/"
    const SEARCH_API = MOVIE_API + "search/movie"
    const DISCOVER_API = MOVIE_API + "discover/movie"
    const API_KEY = "be56a7432cafc7cc412c3e46aea80a67"
    const BACKDROP_PATH = "https://image.tmdb.org/t/p/w1280"

    const [playing, setPlaying] = useState(false)
    const[Feedback, setFeedback]=useState(true)
    const [trailer, setTrailer] = useState(null)
    const [movies, setMovies] = useState([])
    const [searchKey, setSearchKey] = useState("")
    const [movie, setMovie] = useState({title: "Loading Movies"})

    useEffect(() => {
        fetchMovies()
    }, [])

    const fetchMovies = async (event) => {
        if (event) {
            event.preventDefault()
        }

        const {data} = await axios.get(`${searchKey ? SEARCH_API : DISCOVER_API}`, {
            params: {
                api_key: API_KEY,
                query: searchKey
            }
        })

        console.log(data.results[0])
        setMovies(data.results)
        setMovie(data.results[0])

        if (data.results.length) {
            await fetchMovie(data.results[0].id)
        }
    }

    const fetchMovie = async (id) => {
        const {data} = await axios.get(`${MOVIE_API}movie/${id}`, {
            params: {
                api_key: API_KEY,
                append_to_response: "videos"
            }
        })

        if (data.videos && data.videos.results) {
            const trailer = data.videos.results.find(vid => vid.name === "Official Trailer")
            setTrailer(trailer ? trailer : data.videos.results[0])
        }

        setMovie(data)
    }


    const selectMovie = (movie) => {
        fetchMovie(movie.id)
        setPlaying(false)
        setMovie(movie)
        window.scrollTo(0, 0)
    }

    const renderMovies = () => (
        movies.map(movie => (
            <Movie
                selectMovie={selectMovie}
                key={movie.id}
                movie={movie}
            />
        ))
    )

    return (
        <div className="App">
            <header className="center-max-size header">
                <span className={"brand"}>Movie Trailer App</span>
                <form className="form" onSubmit={fetchMovies}>
                    <input className="search" type="text" id="search"
                           onInput={(event) => setSearchKey(event.target.value)}/>
                    <button className="submit-search" type="submit"><i className="fa fa-search"></i></button>
                </form>
            </header>
           
            {movies.length ?
                <main>
                    {movie ?
                        <div className="poster"
                             style={{backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${BACKDROP_PATH}${movie.backdrop_path})`}}>
                            {playing ?
                                <>
                                    <Youtube
                                        videoId={trailer.key}
                                        className={"youtube amru"}
                                        containerClassName={"youtube-container amru"}
                                        opts={
                                            {
                                                width: '100%',
                                                height: '100%',
                                                playerVars: {
                                                    autoplay: 1,
                                                    controls: 0,
                                                    cc_load_policy: 0,
                                                    fs: 0,
                                                    iv_load_policy: 0,
                                                    modestbranding: 0,
                                                    rel: 0,
                                                    showinfo: 0,
                                                },
                                            }
                                        }
                                    />
                                    <button onClick={() => setPlaying(false)} className={"button close-video"}>Close
                                    </button>
                                    
                                </> :
                                <div className="center-max-size">
                                    <div className="poster-content">
                                        {trailer ?
                                            <button className={"button play-video"} onClick={() => setPlaying(true)}
                                                    type="button">Play
                                                Trailer</button>
                                            : 'Sorry, no trailer available'}
                                            
                                            
                                              <button className={"button play-Feedback"} onClick={()=> setFeedback(true)}
                                                    type="button">Feedback</button>  
                                                    
                                                        {/* <button>Feedback</button> */}
                                                    
                                            {/* <Feed/> */}
                                        <h1>{movie.title}</h1>
                                        <p>{movie.overview}</p>
                                        
                                    </div>
                                </div>
                            }
                        </div>
                        : null}
                         

                    <div className={"center-max-size container"}>
                        {renderMovies()}
                    </div>
                </main>
                : 'Sorry, no movies found'}
               
        
        </div>
       

         
    );
}

export default App;
