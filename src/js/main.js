'use strict';

//variables

const inputText = document.querySelector('.js-searchText');
const btnSearch = document.querySelector('.js-searchBtn');
const notFound = document.querySelector('.js-notFound');
const ulFavourites = document.querySelector('.js-favouriteList');
const principalList = document.querySelector('.js-principalList');


//datos

let seriesList = [];
let seriesFavourites = [];
let storedFavourites = [];

//funciones render

function renderSerie(oneSerie) {

  const divElement = document.createElement('div');
  divElement.setAttribute('class', 'serieBox js-serieBox');
  divElement.dataset.idElement = oneSerie.show.id; //para saber cual es la id de cada serie

  const imgElement = document.createElement('img');
  imgElement.setAttribute('class','serieBox__img js-serieBox__img');
  imgElement.setAttribute('alt', oneSerie.show.name);
  imageSrc(oneSerie, imgElement);
  divElement.appendChild(imgElement);

  const titleElement = document.createElement('p');
  titleElement.setAttribute('class','serieBox__title js-serieBox__title');
  const textTitleElement = document.createTextNode(oneSerie.show.name);
  titleElement.appendChild(textTitleElement);
  divElement.appendChild(titleElement);

  divElement.addEventListener('click', handleClickFavourites); ///mirar aqui la funcion de gpt

  return divElement;
}

function renderSerieList(seriesList) {
  principalList.innerHTML = '';
  for (const eachSerie of seriesList) {
    // Llama a renderSerie para obtener el elemento div
    const serieDiv = renderSerie(eachSerie);
    // Agrega el elemento div al DOM
    principalList.appendChild(serieDiv);
  }
}

function renderFavouriteSerie(eachSerie) {

  const liElement = document.createElement('li');
  liElement.setAttribute('class','serieFavouriteBox js-serieFavouriteBox');

  const imgFavElement = document.createElement('img');
  imgFavElement.setAttribute('class','serieFavouriteBox__img js-serieFavouriteBox__img');
  imgFavElement.setAttribute('alt', eachSerie.show.name);
  imageSrc (eachSerie, imgFavElement);
  liElement.appendChild(imgFavElement);

  const removeFavElement = document.createElement('i');
  removeFavElement.setAttribute('class','fa-solid fa-trash removeFav js-removeFav');
  removeFavElement.setAttribute('data-id', eachSerie.show.id);
  liElement.appendChild(removeFavElement);


  const titleFavElement = document.createElement('p');
  titleFavElement.setAttribute('class','serieFavouriteBox__title js-serieFavouriteBox__title');
  const textTitleFavElement = document.createTextNode(eachSerie.show.name);
  titleFavElement.appendChild(textTitleFavElement);
  liElement.appendChild(titleFavElement);

  //liElement.addEventListener('click', handleClickRemoveFavourite); ///mirar aqui la funcion de gpt

  return liElement;
}

function renderFavouritesSeriesList(seriesFavourites) {
  ulFavourites.innerHTML = '';

  storedFavourites = JSON.parse(localStorage.getItem('localStorageFavourites')) || [];

  if (storedFavourites === null) {
    seriesFavourites = [];
  } else {
    seriesFavourites = storedFavourites;
  }

  for (const eachSerie of seriesFavourites) {
    // Llama a renderSerie para obtener el elemento div
    const FavLi = renderFavouriteSerie(eachSerie);
    // Agrega el elemento div al DOM
    ulFavourites.appendChild(FavLi);
  }

  //localStorage.setItem('localStorageFavourites', JSON.stringify(seriesFavourites));
}

function imageSrc(eachImage, imgElement) { //creo esta funcion porque hacía lo mismo en dos sitios distintos.
  if (eachImage.show.image === null) {
    imgElement.setAttribute('src', 'https://via.placeholder.com/210x295/ffffff/666666/?text=TV');
  } else {
    imgElement.setAttribute('src', eachImage.show.image.medium);
  }
}

//funciones manejadoras de eventos

function handleClickFavourites(event) {
  event.preventDefault();
  const clickedElement = event.currentTarget.dataset.idElement;

  for (const serie of seriesList) {
    if(serie.show.id === parseInt(clickedElement)){ // uso el parseInt para poder usar igualdad absoluta, así igualo todo a tipo int.
      if(!event.currentTarget.classList.contains('selected')){
        event.currentTarget.classList.add('selected');
        seriesFavourites.push(serie);
        storedFavourites.push(serie);
      }else{
        event.currentTarget.classList.remove('selected');
        const indexToRemove = seriesFavourites.findIndex(item => item.show.id === serie.show.id);
        if (indexToRemove !== -1) { //si es diferente de -1 significa que está.
          seriesFavourites.splice(indexToRemove, 1);
          storedFavourites.splice(indexToRemove, 1);
        }
      }

      localStorage.setItem('localStorageFavourites', JSON.stringify(storedFavourites));

      renderFavouritesSeriesList(seriesFavourites);

      break; //para que pare el bucle si se cumplen los if
    }
  }
}

function handleClickBtnSearch(event) {
  event.preventDefault();
  const valueInput = inputText.value;
  if (valueInput === '') {
    alert('Debes ingresar un valor para buscar');
    return; //sirve para parar y no continuar la funcion.
  }
  const urlAPI = `//api.tvmaze.com/search/shows?q=:${valueInput}`;

  fetch(urlAPI)
    .then(response => response.json())
    .then(function (dataAPI){
      seriesList = dataAPI.filter((serie)=>serie.show.name.toLowerCase().includes(valueInput.toLowerCase()));
      if (seriesList.length === 0) {
        notFound.classList.remove('hidden');
        notFound.innerHTML = '<i class="fa-regular fa-circle-xmark"></i> Lo sentimos. No se ha encontrado ninguna serie con ese nombre.';
      } else {
        notFound.classList.add('hidden');
      }
      renderSerieList(seriesList);
    });
}

//eventos

btnSearch.addEventListener('click', handleClickBtnSearch);

renderFavouritesSeriesList();
