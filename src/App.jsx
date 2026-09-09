import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [pokemon, setPokemon] = useState(null)
  const [listaPokemon, setListaPokemon] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [favoritos, setFavoritos] = useState([])
  const [mostrarFavoritos, setMostrarFavoritos] = useState(false)

  const [pagina, setPagina] = useState(1)

  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const pokemonPorPagina = 12

  // ==============================
  // CARGAR FAVORITOS
  // ==============================
  useEffect(() => {
    const guardados = localStorage.getItem('pokedex-favoritos')

    if (guardados) {
      try {
        setFavoritos(JSON.parse(guardados))
      } catch {
        setFavoritos([])
      }
    }
  }, [])

  // ==============================
  // GUARDAR FAVORITOS
  // ==============================
  useEffect(() => {
    localStorage.setItem(
      'pokedex-favoritos',
      JSON.stringify(favoritos)
    )
  }, [favoritos])

  // ==============================
  // CARGAR POKÉMON
  // ==============================
  useEffect(() => {
    const cargarPokemon = async () => {
      try {
        setCargando(true)
        setError('')

        const offset =
          (pagina - 1) * pokemonPorPagina

        const respuesta = await fetch(
          `https://pokeapi.co/api/v2/pokemon?limit=${pokemonPorPagina}&offset=${offset}`
        )

        if (!respuesta.ok) {
          throw new Error(
            'No se pudieron cargar los Pokémon'
          )
        }

        const datos = await respuesta.json()

        const detalles = await Promise.all(
          datos.results.map(async (pokemon) => {
            const respuestaPokemon =
              await fetch(pokemon.url)

            if (!respuestaPokemon.ok) {
              throw new Error(
                'No se pudo obtener un Pokémon'
              )
            }

            return respuestaPokemon.json()
          })
        )

        setListaPokemon(detalles)
      } catch (error) {
        setError(error.message)
      } finally {
        setCargando(false)
      }
    }

    cargarPokemon()
  }, [pagina])

  // ==============================
  // BUSCAR POKÉMON
  // ==============================
  const buscarPokemon = async () => {
    const nombre = busqueda.trim().toLowerCase()

    if (!nombre) {
      setError('Escribe el nombre de un Pokémon')
      return
    }

    setCargando(true)
    setError('')
    setPokemon(null)
    setMostrarFavoritos(false)

    try {
      const respuesta = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${nombre}`
      )

      if (!respuesta.ok) {
        throw new Error('Pokémon no encontrado')
      }

      const datos = await respuesta.json()

      setPokemon(datos)
    } catch {
      setError('Pokémon no encontrado')
      setPokemon(null)
    } finally {
      setCargando(false)
    }
  }

  // ==============================
  // VER DETALLES
  // ==============================
  const seleccionarPokemon = (pokemonSeleccionado) => {
    setPokemon(pokemonSeleccionado)
    setMostrarFavoritos(false)
    setError('')

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  // ==============================
  // FAVORITOS
  // ==============================
  const cambiarFavorito = (pokemon) => {
    const existe = favoritos.some(
      (fav) => fav.id === pokemon.id
    )

    if (existe) {
      setFavoritos(
        favoritos.filter(
          (fav) => fav.id !== pokemon.id
        )
      )
    } else {
      setFavoritos([
        ...favoritos,
        {
          id: pokemon.id,
          nombre: pokemon.name,
          imagen:
            pokemon.sprites.front_default
        }
      ])
    }
  }

  // ==============================
  // COMPROBAR FAVORITO
  // ==============================
  const esFavorito = (id) => {
    return favoritos.some(
      (fav) => fav.id === id
    )
  }

  // ==============================
  // CAMBIAR PÁGINA
  // ==============================
  const cambiarPagina = (nuevaPagina) => {
    setPagina(nuevaPagina)
    setPokemon(null)
    setError('')

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  // ==============================
  // LIMPIAR ERROR
  // ==============================
  const limpiarError = () => {
    setError('')
    setBusqueda('')
  }

  return (
    <div className="app">

      {/* ENCABEZADO */}
      <header>
        <h1>🔴 Pokédex React</h1>

        <button
          className="boton-favoritos"
          onClick={() =>
            setMostrarFavoritos(
              !mostrarFavoritos
            )
          }
        >
          ⭐ Mis favoritos ({favoritos.length})
        </button>
      </header>

      <main>

        {/* BUSCADOR */}
        <div className="buscador">
          <input
            type="text"
            placeholder="Escribe un Pokémon..."
            value={busqueda}
            onChange={(e) =>
              setBusqueda(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                buscarPokemon()
              }
            }}
          />

          <button onClick={buscarPokemon}>
            🔎 Buscar
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mensaje-error">

            <h2>
              ❌ Pokémon no encontrado
            </h2>

            <p>
              {busqueda
                ? `No encontramos "${busqueda}".`
                : error}
            </p>

            <p>
              Verifica el nombre e intenta nuevamente.
            </p>

            <button onClick={limpiarError}>
              🔄 Volver a buscar
            </button>

          </div>
        )}

        {/* ========================= */}
        {/* FAVORITOS */}
        {/* ========================= */}

        {mostrarFavoritos ? (

          <section className="favoritos">

            <h2>
              ⭐ Mis Pokémon favoritos
            </h2>

            {favoritos.length === 0 ? (

              <p className="mensaje">
                Todavía no tienes Pokémon favoritos.
              </p>

            ) : (

              <div className="lista-favoritos">

                {favoritos.map((fav) => (

                  <div
                    className="favorito-card"
                    key={fav.id}
                  >

                    <img
                      src={fav.imagen}
                      alt={fav.nombre}
                    />

                    <h3>
                      {fav.nombre.toUpperCase()}
                    </h3>

                    <p>
                      ID: #{fav.id}
                    </p>

                    <button
                      onClick={() =>
                        setFavoritos(
                          favoritos.filter(
                            (item) =>
                              item.id !== fav.id
                          )
                        )
                      }
                    >
                      ❌ Eliminar
                    </button>

                  </div>

                ))}

              </div>

            )}

          </section>

        ) : (

          <>

            {/* ========================= */}
            {/* DETALLES */}
            {/* ========================= */}

            {pokemon && !error && (

              <section className="pokemon-card">

                <img
                  src={
                    pokemon.sprites.other?.[
                      'official-artwork'
                    ]?.front_default ||
                    pokemon.sprites.front_default
                  }
                  alt={pokemon.name}
                />

                <h2>
                  {pokemon.name.toUpperCase()}
                </h2>

                <p>
                  <strong>ID:</strong> #{pokemon.id}
                </p>

                <p>
                  <strong>Tipo:</strong>{' '}
                  {pokemon.types
                    .map(
                      (tipo) =>
                        tipo.type.name
                    )
                    .join(', ')}
                </p>

                <p>
                  <strong>Altura:</strong>{' '}
                  {pokemon.height / 10} m
                </p>

                <p>
                  <strong>Peso:</strong>{' '}
                  {pokemon.weight / 10} kg
                </p>

                <div className="habilidades">

                  <h3>
                    ⚡ Habilidades
                  </h3>

                  <ul>

                    {pokemon.abilities.map(
                      (habilidad) => (

                        <li
                          key={
                            habilidad.ability.name
                          }
                        >
                          {habilidad.ability.name}
                        </li>

                      )
                    )}

                  </ul>

                </div>

                <button
                  className="favorito"
                  onClick={() =>
                    cambiarFavorito(pokemon)
                  }
                >
                  {esFavorito(pokemon.id)
                    ? '💔 Quitar de favoritos'
                    : '⭐ Agregar a favoritos'}
                </button>

              </section>

            )}

            {/* ========================= */}
            {/* LISTA */}
            {/* ========================= */}

            {!error && (

              <section className="lista">

                <h2>
                  📋 Pokémon disponibles
                </h2>

                {cargando ? (

                  <p className="mensaje">
                    ⏳ Cargando Pokémon...
                  </p>

                ) : (

                  <div className="grid-pokemon">

                    {listaPokemon.map((p) => (

                      <div
                        className="pokemon-mini"
                        key={p.id}
                      >

                        <img
                          src={
                            p.sprites.front_default
                          }
                          alt={p.name}
                        />

                        <h3>
                          {p.name.toUpperCase()}
                        </h3>

                        <p>
                          #{p.id}
                        </p>

                        <button
                          onClick={() =>
                            seleccionarPokemon(p)
                          }
                        >
                          🔎 Ver detalles
                        </button>

                        <button
                          className="mini-favorito"
                          onClick={() =>
                            cambiarFavorito(p)
                          }
                        >
                          {esFavorito(p.id)
                            ? '💔 Quitar'
                            : '⭐ Favorito'}
                        </button>

                      </div>

                    ))}

                  </div>

                )}

                {/* ========================= */}
                {/* PAGINACIÓN */}
                {/* ========================= */}

                {!cargando && (

                  <div className="paginacion">

                    <button
                      disabled={pagina === 1}
                      onClick={() =>
                        cambiarPagina(
                          pagina - 1
                        )
                      }
                    >
                      ⬅️ Anterior
                    </button>

                    <span>
                      Página {pagina}
                    </span>

                    <button
                      onClick={() =>
                        cambiarPagina(
                          pagina + 1
                        )
                      }
                    >
                      Siguiente ➡️
                    </button>

                  </div>

                )}

              </section>

            )}

          </>

        )}

      </main>

    </div>
  )
}

export default App
