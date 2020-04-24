// Variables
const btnSearch = document.querySelector('.search__btn'),
    search = document.querySelector('.search'),
    loadMore = document.querySelector('.loadMore'),
    moviesContainer = document.querySelector('.movies'),
    input = document.querySelector('.search__input'),
    resultsError = document.querySelector('.noResults'),
    formError = document.querySelector('.search__error'),
    closeSearch = document.querySelector('.search__close'),
    header = document.querySelector('.header'),
    wrapper = document.querySelector(".wrapper"),
    toggle = document.querySelector(".header__toggle"),
    options = document.querySelector('.options'),
    searchWords = document.querySelector('.searchWords'),
    tagFilter = document.querySelectorAll(".filters__item"),
    tagFilterAll = document.querySelector(".filters__item.all"),
    backTop = document.querySelector(".backTop");

let load = 1,
    type = "",
    loadMoreClicked = false;


var getTheme = localStorage.getItem('themeDark');

if (getTheme != "false") {
    wrapper.dataset.theme = "dark";
    toggle.classList.add('on');
    localStorage.setItem('themeDark', true);
};

// Events
btnSearch.addEventListener('click', searchMovies);
loadMore.addEventListener('click', loadMovies);
closeSearch.addEventListener('click', cleanSearch);
toggle.addEventListener('click', changeTheme);
tagFilter.forEach(function (el) {
    el.addEventListener("click", filters);
})
tagFilterAll.addEventListener('click', showAll);
input.addEventListener("keypress", function (event) {

    if (event.keyCode === 13) {
        event.preventDefault();
        searchMovies();
    }
});

// Get Wrapper with 100vh on mobile
if (window.innerWidth <= 800) {
    wrapper.style.minHeight = (window.innerHeight - 120) + "px";
    document.getElementById("app").style.minHeight = (window.innerHeight - 120) + "px";

};

function movies() {
    let text = input.value;

    loadMore.style.display = "none";

    if (!loadMoreClicked) {
        if (input.dataset.lastVal == text) {
            input.dataset.lastVal = text;
            load = 1;
        }

        if (!input.dataset.lastVal) {
            input.dataset.lastVal = text;
        };

        if (input.dataset.lastVal != text) {
            input.dataset.lastVal = text;
            load = 1;
        };
    } else {
        if (input.dataset.lastVal == text) {
            input.dataset.lastVal = text;
            load++;
        }
    };

    var request = new Request(`https://www.omdbapi.com/?apikey=e62e1d19&s=${text}&type=${type}&page=${load}`, {
        method: 'GET',
    });

    fetch(request)

        .then(function (response) {
            return response.json();
        })

        .then(function (result) {
            const item = result.Search;
            let movies = document.querySelector('.movies');

            if (item) {
                item.forEach(el => {
                    let title = el.Title,
                        poster = el.Poster != "N/A" ? el.Poster : "../assets/defaultimg.svg",
                        year = el.Year,
                        link = el.imdbID,
                        type = el.Type;

                    const template = `
                <a class="item" data-type="${type}" href="https://imdb.com/title/${link}" target="_blank">
                
                <article class="item__content">
                <div class="item__text">
                <small class="item__year">${year}</small>
                <p  class="item__title">${title}</p>
                </div>

                <button class="item__view">view info</button>
                </article>
                <div class="item__image"><img src="${poster}"></div>
                </a>`;

                    movies.insertAdjacentHTML("beforeend", template);

                    options.style.display = "flex";

                    // Hide Load More Button if results are inferior to 10

                    if (result.totalResults <= 10) {
                        loadMore.style.display = "none";

                    } else {
                        loadMore.style.display = "block";
                    };
                });


            } else {
                noResults();
            };


            // Show the Number of Results and the word that was Searched
            const totalResults = `We found ${result.totalResults} results for <strong>${input.value}</strong>`;
            searchWords.innerHTML = totalResults;

        })
}
// When you click on the Search Button, things happen!
function searchMovies() {
    loadMoreClicked = false;
    resultsError.style.display = "none";

    if (input.value != "") {
        movies();
        moviesContainer.innerHTML = "";
        search.classList.add('clicked');
        wrapper.classList.add('enter');
        closeSearch.style.display = "block";

    } else {
        input.addEventListener("click", cleanError);
        input.classList.add("inputError");
        formError.classList.add("showError");
        searchWords.innerHTML = searchResult;


        // Input Empty Error Message
        function cleanError() {
            input.classList.remove("inputError");
            formError.classList.remove("showError");
        }
    }
}

// Clean Input Search
function cleanSearch() {
    if (input.value != "") {
        input.value = "";
        closeSearch.style.display = "none";
    }
}

// Load More
function loadMovies() {
    loadMoreClicked = true;
    movies();

}

// No Results Message
function noResults() {

    if (moviesContainer.innerHTML == "") {
        resultsError.style.display = "flex";
        options.style.display = "none";
        loadMore.style.display = "none";

    } else {
        resultsError.style.display = "none";
        options.style.display = "flex";
        loadMore.style.display = "flex";
    }
}

// Filter Categories
function filters(e) {
    const item = document.querySelectorAll('.item');
    type = e.currentTarget.dataset.filter;


    item.forEach(function (el) {
        el.style.display = "none";
    })

    tagFilter.forEach(function (el) {
        el.classList.remove("selected");
    });

    e.currentTarget.classList.add("selected");

    const showedElements = [...item].filter(element => element.dataset.type == e.currentTarget.dataset.filter);

    showedElements.forEach(item => {
        item.style.display = "flex";
        resultsError.style.display = "none";
        loadMore.style.display = "flex";
    });

    if (!showedElements.length) {
        resultsError.style.display = "flex";
        loadMore.style.display = "none";
    }

}

// Remove all filters - Show All
function showAll() {
    const item = document.querySelectorAll('.item');
    item.forEach(function (el) {
        el.style.display = "flex";
    })
    resultsError.style.display = "none";
    loadMore.style.display = "flex";
    tagFilterAll.classList.add("selected");

    type = "";
}

// Change to Dark Mode
function changeTheme() {
    getTheme = localStorage.getItem('themeDark');
    if (getTheme == "false") {
        wrapper.dataset.theme = "dark";
        toggle.classList.add('on');
        getTheme = localStorage.setItem('themeDark', true);
    } else {
        wrapper.dataset.theme = "";
        toggle.classList.remove('on');
        getTheme = localStorage.setItem('themeDark', false);
    }
};


// Sticky Nav Bar
window.onscroll = function () {
    if (window.pageYOffset >= 4) {
        header.classList.add("sticky");
        search.classList.add("fixed");
    } else {
        header.classList.remove("sticky");
        search.classList.remove("fixed");
    };
}

// Sticky Back to Top
window.onscroll = function () {
    if (window.pageYOffset >= 400) {
        backTop.classList.add("show");

    } else {
        backTop.classList.remove("show");
    };
}

// Back to top

backTop.addEventListener("click", function () {
    scrollToTop(400);
});

function scrollToTop(scrollDuration) {
    var scrollStep = -window.scrollY / (scrollDuration / 15),
        scrollInterval = setInterval(function () {
            if (window.scrollY != 0) {
                window.scrollBy(0, scrollStep);
            } else clearInterval(scrollInterval);
        }, 15);
}

observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        console.log(entry)
        if (entry.intersectionRatio > 0) {
            backTop.style.bottom = entry.intersectionRect.bottom - entry.boundingClientRect.top + 24 +
                'px';
            observer.unobserve(entry.target);
        } else {
            backTop.style.bottom = '24px';

        }

    });
});

window.addEventListener('scroll', function () {
    observer.observe(document.querySelector('footer'));
})


/* end Back to top */