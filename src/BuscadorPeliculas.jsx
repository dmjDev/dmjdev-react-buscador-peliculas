import { useState } from "react"
import noImagen from './img/notFound.jpg'

export const BuscadorPeliculas = () => {
    const [busqueda, setBusqueda] = useState('')
    const [peliculas, setPeliculas] = useState([])
    const [carga, setCarga] = useState('')
    const apiToken = import.meta.env.VITE_API_KEY;

    // Nuevo estado: Set de IDs de películas con TEXTO EXPANDIDO
    const [expandedMovies, setExpandedMovies] = useState(new Set())

    const urlBase = 'https://api.themoviedb.org/3/search/movie'
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: apiToken
        }
    };

    const handleInputChange = (e) => {
        setBusqueda(e.target.value)
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        fetchPeliculas(busqueda)
    }
    const fetchPeliculas = async () => {
        try {
            setCarga('Cargando...')
            const response = await fetch(`${urlBase}?query=${busqueda}`, options)
            const data = await response.json()
            setPeliculas(data.results)
            data.results.length > 0 ? setCarga('') : setCarga('No se encontraron resultados')
        } catch (error) {
            console.log('No se ha podido encontrar la información, ', error)
        }
    }

    // TEXTO EXPANDIDO
    // Función para alternar entre expandido/colapsado
    const toggleExpand = (movieId) => {
        setExpandedMovies(prev => {
            const newSet = new Set(prev)
            if (newSet.has(movieId)) {
                newSet.delete(movieId)
            } else {
                newSet.add(movieId)
            }
            return newSet
        })
    }
    // Función que SOLO retorna el texto truncado si su longitud es mayor al límite establecido
    const getTruncatedText = (texto) => {
        const limite = 25
        const palabras = texto.split(/\s+/)
        if (palabras.length <= limite) {
            return texto
        }
        return palabras.slice(0, limite).join(' ') + '...'
    }
    // Función que verifica si el texto necesita truncarse
    const needsTruncate = (texto) => {
        const limite = 25
        const palabras = texto.split(/\s+/)
        return palabras.length > limite
    }
    const cleanExpandedMovies = () => {
        setExpandedMovies(new Set())
    }

    const jsxml =
        <div className="container">
            <h1 className="title">Buscador de películas</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    className="form-control"
                    name="busqueda"
                    placeholder="Escribir una película"
                    value={busqueda}
                    onChange={handleInputChange}
                    onClick={(e) => e.target.value = ""}
                />
                <button type="submit" className="search-button">Buscar</button>
                <button type="button" className="btn btn-outline-danger ms-2" onClick={cleanExpandedMovies}>
                    <i className="bi bi-card-list"> Clear</i>
                </button>
            </form>
            <p style={{"fontWeight":"bold", "fontSize":"20px", "color":"green", "textAlign":"center"}}>{carga}</p>
            <div className="movie-list">
                {peliculas.map((pelis) => (
                    <div key={pelis.id} className="movie-card">
                        <img src={`https://image.tmdb.org/t/p/w500${pelis.poster_path}`.slice(-4) === 'null' ? noImagen : `https://image.tmdb.org/t/p/w500${pelis.poster_path}`} alt={pelis.title} />
                        <h2>{pelis.title}</h2>
                        
                        {/* TEXTO EXPANDIDO */}
                        <p>
                            {/* Mostrar texto completo o truncado según el estado */}
                            {expandedMovies.has(pelis.id)
                                ? pelis.overview
                                : getTruncatedText(pelis.overview)
                            }
                            {/* Mostrar botón solo si el texto necesita truncarse */}
                            {needsTruncate(pelis.overview) && (
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        toggleExpand(pelis.id)
                                    }}
                                    style={{ marginLeft: '5px', color: '#098399ff', cursor: 'pointer' }}
                                >
                                    <span style={{ whiteSpace: 'nowrap' }}>
                                        {expandedMovies.has(pelis.id) ? 'Ver menos' : 'Ver más'}
                                    </span>
                                </a>
                            )}
                        </p>

                    </div>
                ))}
            </div>
        </div >

    return jsxml
}
