import './css/styles.css';
import { Notify }  from 'notiflix';
import debounce from 'lodash.debounce';
import fetchCountries from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const list = document.querySelector('.country-list')
const info = document.querySelector('.country-info')
const inputSearch = document.querySelector('#search-box')


inputSearch.addEventListener('input', debounce(searchCountry, DEBOUNCE_DELAY));



function searchCountry() {
	
	const name = inputSearch.value.trim()
	 if (name) {
		fetchCountries(name)
			.then(countries => {
			if (countries.length > 10) {
					Notify.info('Too many matches found. Please enter a more specific name.')
				} else if (countries.length >= 2 && countries.length <= 10) {

					list.innerHTML = "";
					info.innerHTML = "";
					const markup = countries.map((country) => {
					  const markupText = `<li class="country-list__item"><img src=${country.flags.svg} class="country-list__flag"><p>${country.name}</p></li>`
					  return markupText
					}).join(" ");
					const markupReplaced = markup.replaceAll("undefined", "")
					list.innerHTML = markupReplaced;
				
				  } else if (countries.length === 1) {
				
					list.innerHTML = null;
					const markup = countries.map((country) => {
					  const parsedLanguages = country.languages.length === 1 ? country.languages[0].name : country.languages.map(lang => lang.name).join(', ');
					  return `<ul class="country-info__list">
					  <li class="country-info__item"><img src="${country.flags.svg}" class="country-info__flag" alt="Flag of ${country.name}"><p><b>${country.name}</b></p></li>
					  <li class="country-info__item"><b>Capital:</b> ${country.capital}</li>
					  <li class="country-info__item"><b>Population:</b> ${country.population}</li>
					  <li class="country-info__item"><b>Languages:</b> ${parsedLanguages}</li></ul>`
					}).join(" ");
					const markupReplaced = markup.replaceAll("undefined", "-")
					info.innerHTML = markupReplaced;
				  }
                
			})
			.catch((error) => {
                console.log(error);
                Notify.failure("Oops, there is no country with that name")    
              });
            }
	
}