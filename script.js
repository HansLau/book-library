let myLibrary=[];

function Book(
    author="Unknown",
    title="Unknown",
    pages="Unknown",
    read='false') {
    if (!new.target) {
        throw 'Please call Book with new operator';
    }
    this.author = author;
    this.title = title;
    this.pages = pages;
    this.read = read;      
}

const cardContainer = document.querySelector('.card-container');

function addBookToLibrary(book){
    myLibrary.push(book);
    const card = createCardElement(book);
    cardContainer.appendChild(card);
}

function findBookFromLibrary(author, title){
    const index = myLibrary.findIndex( (libraryBook) => {
        if (libraryBook.author === author && libraryBook.title === title) return true;
    })
    return index;
}

function editBookFromLibrary(book){
    const index = findBookFromLibrary(book.author, book.title);
    if (index == -1) return false;
    myLibrary[index] = book;
    //card edit handled on edit form button
}

function removeBookFromLibrary(book){
    const index = findBookFromLibrary(book);
    if (index !== -1){
        myLibrary.splice(index, 1);
        console.log('${book.title} removed.');
    }
    else{
        console.log("${book.title} not found.");
    }
}


const addBookModal = document.querySelector('.add-book.modal');
const editBookModal = document.querySelector('.edit-book.modal');
const submitBookBtn = document.querySelector('.add-book button[type="submit"]');
const editBookBtn = document.querySelector('.edit-book button[type="submit"]');
const cancelButtons = document.querySelectorAll('.modal button:last-of-type');
const backdrop = document.querySelector('.backdrop');
let currentlyEditedBook;
let currentlyEditedCard;

function createCardElement(book){
    const card = document.createElement('div');
    card.className = "card";
    const table = document.createElement('table');
    card.appendChild(table);

    const tableHeaders = ['Title', 'Author', 'Pages', 'Read'];
    for (let index = 0; index < tableHeaders.length; index++) {
        const header = tableHeaders[index];
        const newRow = table.insertRow(-1);

        const newTh =  document.createElement('th');
        newTh.append( document.createTextNode(header) );
        newRow.appendChild(newTh);

        const newCell = newRow.insertCell(1);
        newCell.innerHTML = book[header.toLowerCase()];
    }
    card.firstChild.lastChild.lastChild.lastChild.innerHTML = "";
    const checkbox = document.createElement('input');
    checkbox.setAttribute('type', 'checkbox');
    checkbox.setAttribute('disabled', "");
    checkbox.checked = book['read'];
    card.firstChild.lastChild.lastChild.lastChild.appendChild(checkbox);


    const buttonNames = ['Read', 'Edit', 'Remove'];
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = "buttons";
    card.appendChild(buttonsContainer);

    buttons = [];
    for (const btnName of buttonNames) {
        const button = document.createElement('button');
        button.innerHTML = btnName;
        buttonsContainer.appendChild(button);
        buttons.push(button);
    }
    const [readButton, editButton, removeButton] = buttons;

    readButton.addEventListener('click', () => {
        const read = card.firstChild.lastChild.lastChild.lastChild.lastChild.checked;
        card.firstChild.lastElementChild.lastChild.lastChild.lastChild.checked = !read;
        currentlyEditedCard = card;
        //edit actual book in library
    })

    editButton.addEventListener('click', () => {
        editBookModal.classList.toggle("hide");
        backdrop.classList.toggle("hide");

        updateEditFormValues(book);
        currentlyEditedCard = card;
    })

    removeButton.addEventListener('click', () => {
        card.setAttribute("data-hiding", "");

        card.addEventListener('transitionend', () => {
            card.removeAttribute("data-hiding");
            card.remove();
        }, {once: true});
    })

    return card;
}

const addBook = document.querySelector("#addBook");

addBook.addEventListener('click', () => {
    // addBookModal.style.display = 'none';
    addBookModal.classList.toggle("hide");
    backdrop.classList.toggle("hide");
})

cancelButtons.forEach( button => {
    button.addEventListener('click', (e) => {
        closeModal(e);
    });
}
);

function closeModal(e){
    const modal = e.target.closest(".modal");
    modal.setAttribute("data-hiding", "");
    backdrop.setAttribute("data-hiding", "");

    modal.addEventListener('transitionend', () => {
        modal.removeAttribute("data-hiding");
        backdrop.removeAttribute("data-hiding");
        modal.classList.toggle("hide");
        backdrop.classList.toggle("hide");
    }, {once: true});
}

submitBookBtn.addEventListener('click', (e) => {
    const form = e.target.closest('form');
    
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        submitBook(e);
        // form.reset();
        closeModal(e);
    }, {once:true});

})

function submitBook(e){
    
    const title = e.target[0].value;
    const author = e.target[1].value;
    const pages = e.target[2].value;
    const read = e.target[3].checked;

    const newBook = new Book(title, author, pages, read);
    addBookToLibrary(newBook);
}

editBookBtn.addEventListener('click', (e) => {
    const form = e.target.closest('form');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        editBook(e);
        closeModal(e);
    }, {once:true})
})

function updateEditFormValues(book){
    document.querySelector('#editTitle').value = book.title;
    document.querySelector('#editAuthor').value = book.author;
    document.querySelector('#editPages').value = book.pages;
    document.querySelector('#editRead').value = book.read;
    
}

function editBook(e){
    const title = e.target[0].value;
    const author = e.target[1].value;
    const pages = e.target[2].value;
    const read = e.target[3].checked;

    const editedBook = new Book(title, author, pages, read);
    editBookFromLibrary(editedBook);
    currentlyEditedBook = editedBook;
    currentlyEditedCard.parentNode.replaceChild(createCardElement(currentlyEditedBook), currentlyEditedCard);
    // currentlyEditedCard.outerHTML = createCardElement(currentlyEditedBook);
    //haccky way, create new card to replace old
}

//Issue seems to be edit form submitting more than once. no idea how to solvce.