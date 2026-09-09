# 🔴 Pokédex React

Aplicación web desarrollada con React y Vite que permite consultar información de Pokémon utilizando una API externa.

## 📋 Descripción

Pokédex React es una aplicación web que consume información de Pokémon mediante la API pública PokeAPI.

La aplicación permite buscar Pokémon, consultar sus características, visualizar una lista de Pokémon, agregar Pokémon a favoritos y conservar los favoritos aunque se recargue la página.

## 🚀 Tecnologías utilizadas

- React
- Vite
- JavaScript
- HTML5
- CSS3
- LocalStorage
- Fetch API
- PokeAPI

## 🔗 API utilizada

El proyecto utiliza PokeAPI para obtener la información de los Pokémon.

API:

https://github.com/icortezsutuc-lab/pokedex-react.git

## ⚙️ Funcionalidades

### 🔎 Búsqueda de Pokémon

El usuario puede escribir el nombre de un Pokémon y realizar una búsqueda.

Ejemplo:

- Pikachu
- Charmander
- Bulbasaur
- Squirtle

### 📋 Lista de Pokémon

La aplicación muestra Pokémon obtenidos directamente desde PokeAPI.

La lista utiliza paginación para permitir navegar entre diferentes grupos de Pokémon.

### 🔎 Detalles

Al seleccionar un Pokémon se muestran:

- Nombre
- ID
- Tipo
- Altura
- Peso
- Habilidades
- Imagen

### ⭐ Favoritos

El usuario puede agregar Pokémon a una lista de favoritos.

También puede eliminar Pokémon de favoritos.

### 💾 Persistencia

Los Pokémon favoritos se almacenan utilizando `localStorage`.

Esto permite que los favoritos permanezcan guardados aunque el usuario:

- Recargue la página.
- Cierre y vuelva a abrir el navegador.

### ⚠️ Manejo de errores

Cuando el usuario busca un Pokémon que no existe, la aplicación muestra un mensaje indicando que no se encontró.

## 📄 Paginación

La aplicación permite navegar entre diferentes páginas de Pokémon mediante los botones:

- Anterior
- Siguiente

Cada página muestra 12 Pokémon.

## 🗂️ Estructura del proyecto

```text
pokedex/
│
├── public/
│
├── src/
│   ├── assets/
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
└── vite.config.js
