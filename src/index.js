import './css/styles.css';

const DEBOUNCE_DELAY = 300;
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import fetchCountries from './fetchCountries';
import debounce from 'lodash.debounce';

const refs = {
        searchBox: document.querySelector('#search-box'),
        listCountries: document.querySelector('.country-list'),
        countryInfo: document.querySelector('.country-info'),
    };


refs.searchBox.addEventListener('input', debounce(searchCountry, DEBOUNCE_DELAY));

function searchCountry(event) {
  

    let searchingCountry = event.target.value.trim();
    if (!searchingCountry) {
        resetMarkup(refs.listCountries);
        resetMarkup(refs.countryInfo);
        return;
    };

    fetchCountries(searchingCountry)
        .then(country => {
            if (country.length > 10) {
                 Notify.info("Too many matches found. Please enter a more specific name.");
            }
            else if (country.length <= 10 && country.length >= 2) {
                resetMarkup(refs.listCountries);
                createMarkupForCountries(country);
                resetMarkup(refs.countryInfo);
            }
            else {
                resetMarkup(refs.countryInfo);
                createCardForCountry(country);
                resetMarkup(refs.listCountries);
            }
        })
        .catch(error => {
            resetMarkup(refs.listCountries);
            resetMarkup(refs.countryInfo);
            Notify.failure("Oops, there is no country with that name");
        });
}

function createMarkupForCountries(countriesArray) {
        const markup = countriesArray
        .map(({ name, flags }) => {
            return`<li class="country-item">
        <img class="country-flag" src="${flags.svg}" alt="flags" width = "50" height = "30">
        <h2 class="country-name">${name.official}</h2> 
        </li>`;
        })
   .join('');
   return refs.listCountries.insertAdjacentHTML('beforeend', markup);
    }
