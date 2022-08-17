const UNCOMPLETED_LIST_BUKU_ID = "buku";
const COMPLETED_LIST_BUKU_ID = "completed-buku";
const BUKU_ITEMID = "itemId";

function makeBuku(title, author, year, isComplete) {

    const textTitle = document.createElement("h2");
    textTitle.innerText = title;

    const textAuthor = document.createElement("p");
    textAuthor.innerText = author;

    const textYear = document.createElement("small");
    textYear.innerText = year;

    const textContainer = document.createElement("div");
    textContainer.classList.add("inner");
    textContainer.append(textTitle, textAuthor, textYear);

    const container = document.createElement("div");
    container.classList.add("item", "shadow");
    container.append(textContainer);

    if (isComplete) {
        container.append(
            createKembaliButton(),
            createHapusButton()
        );
    } else {
        container.append(
            createCheckButton(),
            createHapusButton()
        );
    }

    return container;
}

function createKembaliButton() {
    return createButton("undo-button", function (event) {
        undoBukuFromRakSelesaiBaca(event.target.parentElement);
    });
}

function createHapusButton() {
    return createButton("trash-button", function (event) {
        removeBukuSelesai(event.target.parentElement);
    });
}

function createCheckButton() {
    return createButton("check-button", function (event) {
        addBukuToCompleted(event.target.parentElement);
    });
}

function createButton(buttonTypeClass, eventListener) {
    const button = document.createElement("button");
    button.classList.add(buttonTypeClass);
    button.addEventListener("click", function (event) {
        eventListener(event);
    });
    return button;
}

// menambahkan data buku
function addBuku() {
    const uncompletedBukuList = document.getElementById(UNCOMPLETED_LIST_BUKU_ID);
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const year = document.getElementById("year").value;
    const book = makeBuku(title, author, year, false);
    const bukuObject = composeBukuObject(title, author, year, false);

    book[BUKU_ITEMID] = bukuObject.id;
    buku.push(bukuObject);

    uncompletedBukuList.append(book);
    updateDataToStorage();
}

// menambahkan buku ke rak sudah selesai baca
function addBukuToCompleted(bukuElement /* HTMLELement */ ) {
    const listBukuCompleted = document.getElementById(COMPLETED_LIST_BUKU_ID);
    const title = bukuElement.querySelector(".inner > h2").innerText;
    const author = bukuElement.querySelector(".inner > p").innerText;
    const year = bukuElement.querySelector(".inner > small").innerText;

    const bukuBaru = makeBuku(title, author, year, true);

    const book = findBuku(bukuElement[BUKU_ITEMID]);
    book.isComplete = true;
    bukuBaru[BUKU_ITEMID] = book.id;

    listBukuCompleted.append(bukuBaru);
    bukuElement.remove();

    updateDataToStorage();
}

// menghapus buku dari rak belum selesai dibaca maupun rak selesai dibaca
function removeBukuSelesai(bukuElement) {
    const bukuPosition = findBukuIndex(bukuElement[BUKU_ITEMID]);
    buku.splice(bukuPosition, 1);

    var conf_delete = confirm("Apakah anda ingin menghapus buku ini?");
    if (conf_delete) {
        bukuElement.remove();
    } else {
        window.location("index.html");
    }
    updateDataToStorage();
}

// mengembalikan buku dari rak selesai dibaca ke rak belum selesai dibaca
function undoBukuFromRakSelesaiBaca(bukuElement) {
    const listBukuUncompleted = document.getElementById(UNCOMPLETED_LIST_BUKU_ID);
    const title = bukuElement.querySelector(".inner > h2").innerText;
    const author = bukuElement.querySelector(".inner > p").innerText;
    const year = bukuElement.querySelector(".inner > small").innerText;

    const bukuBaru = makeBuku(title, author, year, false);
    const book = findBuku(bukuElement[BUKU_ITEMID]);
    book.isComplete = false;
    bukuBaru[BUKU_ITEMID] = book.id;

    listBukuUncompleted.append(bukuBaru);
    bukuElement.remove();

    updateDataToStorage();
}