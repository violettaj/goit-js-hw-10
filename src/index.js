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
	list.innerHTML = '';
	info.innerHTML = '';
	const name = inputSearch.value.trim()
	const nameString =inputSearch.value.toString()	
	 if (name) {
		fetchCountries(name)
			.then(response => {
			if (response.length > 10) {
					Notify.info('Too many matches found. Please enter a more specific name.')
				} else if (response.length >= 2) {
					list.insertAdjacentHTML('beforeend', response.map(element => `<li class="country-list__item">
					<img class="country-list__flag flag" src="${element.flags.svg}" alt="The flag of ${element.name}">
					<p><h3>${element.name}</h3></p>
					</li>`).join(''));
				} else {
					info.insertAdjacentHTML('beforeend', `<ul class="country-info__list">
					<li class="country-info__item">
						<img class="country-info__flag flag" src="${response[0].flags.svg}" alt="${response[0].name}">
						<h2>${response[0].name}</h2></li>
					<li class="country-info__item"><p><span>Capital:</span> ${response[0].capital}</p></li>
					<li class="country-info__item"><p><span>Population:</span> ${response[0].population}</p></li>
					<li class="country-info__item"><p><span>Languages:</span> ${Object.values(response[0].languages).join(', ')}</p></li>
					</ul>`);
				}
                
			})
			.catch((error) => {
                console.log(error);
                Notify.failure("Oops, there is no country with that name")    
              });
            }
	
}