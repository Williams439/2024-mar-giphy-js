const API_KEY = "uA36R7Po1mE3xuOSsrCXIlmsI9PKtIIu";
const API_PREFIX = "https://api.giphy.com/v1/gifs/search?api_key=";
const API_SETTINGS = "&offset=0&rating=g&lang=en&bundle=messaging_non_clips";

/* Application interal State */
let memesPerPage = 1;
let currentPage = 1;

function generatePaginationListItems(pageCount) {
    let startClass = '';
    let endClass = '';
    let previousClass = '';
    let nextClass = '';

    if (currentPage === 1) {
        previousClass = 'disabled';
        startClass = 'disabled';
    }

    if (pageCount === currentPage) {
        endClass = 'disabled';
        nextClass = 'disabled';
    }

    let innerPageLinks = '';
    if (currentPage === 1) { 
        innerPageLinks = `
            <li class="page-item disabled">
                <a class="page-link" href="#">1</a>
            </li>
            <li class="page-item">
                <a class="page-link" href="#">2</a>
            </li>
        `;
    } else if (pageCount === currentPage) {
        innerPageLinks = `
            <li class="page-item">
                <a class="page-link" href="#">${currentPage - 1}</a>
            </li>
            <li class="page-item disabled">
                <a class="page-link" href="#">${currentPage}</a>
            </li>
        `;
    } else {
        innerPageLinks = `
            <li class="page-item">
                <a class="page-link" href="#">${currentPage - 1}</a>
            </li>
            <li class="page-item disabled">
                <a class="page-link" href="#">${currentPage}</a>
            </li>
            <li class="page-item">
                <a class="page-link" href="#">${currentPage + 1}</a>
            </li>
        `;
    }

    return `
    <li class="page-item ${startClass}">
        <a class="page-link" href="#">Start</a>
    </li>
    <li class="page-item ${previousClass}">
        <a class="page-link" href="#">Previous</a>
    </li>
    ${innerPageLinks}
    <li class="page-item ${nextClass}">
        <a class="page-link" href="#">Next</a>
    </li>
    <li class="page-item ${endClass}">
        <a class="page-link" href="#">End</a>
    </li>
    `;
}

function renderPagination(paginationInfo) {
    let { count, offset, total_count: totalCount } = paginationInfo;
    let pageCount = Math.ceil( totalCount / count );
    let currentPage = Math.floor( offset / count ) + 1;

    let html = `
<nav 
    aria-label="Page navigation example" 
    data-bs-theme="dark"
    class="pagination-component">
  <ul class="pagination">
    ${generatePaginationListItems(pageCount)}
    <li class="page-label">Page ${currentPage} of ${pageCount}</li>
  </ul>
</nav>`;

    document.querySelector(".js-pagination-top").innerHTML = html;
    document.querySelector(".js-pagination-bottom").innerHTML = html;
}

function renderGifs(response) {
    let result = '';

    if (response.data.length === 0) {
        renderError('No results');
    } else {
        for (let meme of response.data) {
            result += `
                <img 
                    src="${meme.images.original.url}" 
                    alt="${meme.alt_text}" 
                    class="meme-img">`;
        }

        document.querySelector(".js-memes-container").innerHTML = result;

        renderPagination(response.pagination);

        let {count, offset, total_count: totalCount} = response.pagination;
    }
}

function renderError(message) {
    document.querySelector(".js-memes-container").innerHTML = 
        `<div class="alert alert-danger error-container">${message}</div>`;
}

function getMemes(searchExpression) {
    fetch(
        `${API_PREFIX}${API_KEY}&q=${searchExpression}&limit=${memesPerPage}${API_SETTINGS}`
    )
        .then(data => data.json())
        .then(renderGifs)
        .catch(() => renderError("Error retrieving data."));
}

function formSubmitted(event) {
    event.preventDefault();
    let inputFieldContent = document.querySelector("[name=meme-input]").value;


    memesPerPage = document.querySelector("[name=meme-count]").value;
    currentPage = 1;

    getMemes(inputFieldContent);
}

document.querySelector("#meme-form").addEventListener("submit", formSubmitted);
