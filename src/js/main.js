'use strict';

//variables

const inputText = document.querySelector('.js-searchText');
const btnSearch = document.querySelector('.js-searchBtn');

const principalList = document.querySelector('.js-principalList');
const divBox = document.querySelector('.js-serieBox');

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
          seriesList = dataAPI.filter((serie)=>serie.show.name.toLowerCase().includes(valueInput.toLowerCase())); //mapear esto bien
          renderSerieList(seriesList);
        });   
  
}

function handleClickFavourites(event) {
  event.preventDefault();
  const clickedElement = event.currentTarget.dataset.id;
  event.target.dataset.id.classList.add('selected');


  console.log(event.target);


}
 
//funciones render

function renderSerie(oneSerie) {

  const divElement = document.createElement('div');
  divElement.setAttribute('class', 'serieBox js-serieBox');
  divElement.dataset.idElement = oneSerie.show.id; //para saber cual es la id de cada serie

  const imgElement = document.createElement('img');
  imgElement.setAttribute('class','serieBox__img js-serieBox__img'); 
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
principalList.addEventListener('click', handleClickFavourites);


