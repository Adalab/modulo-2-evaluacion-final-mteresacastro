'use strict';

//variables

const inputText = document.querySelector('.js-searchText');
const btnSearch = document.querySelector('.js-searchBtn');
const notFound = document.querySelector('.js-notFound');

const principalList = document.querySelector('.js-principalList');
let divBox = [];
let findSerie = [];
let seriesList = []; 
let seriesFavourites= [];

//datos

//funciones manejadoras de eventos


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
          } 
          if (seriesList.length > 0) {
            notFound.classList.add('hidden');
          }
          console.log(seriesList);
          renderSerieList(seriesList);
      });
}

/*function handleClickFavourites(event) {
  event.preventDefault();
  const clickedElement = event.currentTarget.dataset.idElement;
  for (const serie of seriesList) {
    if (JSON.stringify(serie.show.id) === clickedElement) { //para usar igualdad absoluta use JSONstringify() porque son distintos tipos de datos
      seriesFavourites.push(serie);
    }
    event.currentTarget.classList.add('selected');
  }
  if (event.currentTarget.classList.contains('selected')) {
    event.currentTarget.classList.remove('selected');
  }
}*/
function handleClickFavourites(event) {
  event.preventDefault();
  const clickedElement = event.currentTarget.dataset.idElement;

  for (const serie of seriesList) {
    if(serie.show.id === parseInt(clickedElement)){ // uso el parseInt para poder usar igualdad absoluta, así igualo todo a tipo int.
      if(!event.currentTarget.classList.contains('selected')){
        event.currentTarget.classList.add('selected');
        seriesFavourites.push(serie);
      }else{
        const indexToRemove = seriesFavourites.findIndex(item => item.show.id === serie.show.id);
        event.currentTarget.classList.remove('selected');
        if (indexToRemove !== -1) {
          seriesFavourites.splice(indexToRemove, 1);
        }
      }
      break; //para que pare el bucle si se cumplen los if
    }
  }
}
//funciones render

function renderSerie(oneSerie) {

  const divElement = document.createElement('div');
  divElement.setAttribute('class', 'serieBox js-serieBox');
  divElement.dataset.idElement = oneSerie.show.id; //para saber cual es la id de cada serie
  divBox = document.querySelector('.js-serieBox');
  //divBox.addEventListener('click', handleClickFavourites);

  const imgElement = document.createElement('img');
  imgElement.setAttribute('class','serieBox__img js-serieBox__img');
  imgElement.setAttribute('alt', oneSerie.show.name);
  if (oneSerie.show.image === null) {
    imgElement.setAttribute('src', 'https://via.placeholder.com/210x295/ffffff/666666/?text=TV');
  }
  else{
    imgElement.setAttribute('src', oneSerie.show.image.medium);
  }
  divElement.appendChild(imgElement);

  const titleElement = document.createElement('p');
  titleElement.setAttribute('class','serieBox__title js-serieBox__title');
  const textTitleElement = document.createTextNode(oneSerie.show.name);
  titleElement.appendChild(textTitleElement);
  divElement.appendChild(titleElement);
  console.log(oneSerie.show.name);

  divElement.addEventListener('click', handleClickFavourites);

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

function renderFavourite(){

}
//eventos

btnSearch.addEventListener('click', handleClickBtnSearch);