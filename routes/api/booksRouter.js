const express = require('express');
const router = express.Router();

const Book = require('../../models/library.js');

router.get('/', async (req, res) => {
    let books;
    try {
        books = await Book.find().select('-__v');
        res.render('../views/books/index', {
            title: 'Книги',
            books: books,
    });
    } catch(e) {
        res.status(404).json(e);
    }

    if (!books) {
        res.redirect('/404');
    }
});

router.get('/create', (req, res) => {
    res.render("../views/books/create", {
        title: "Книга | Создание книги",
        books: {},
    });
});

router.post('/create', 
    async (req, res) => {
    const {
        title, 
        authors, 
        description, 
        favorite, 
        fileCover, 
        fileName,
        fileBook,
    } = req.body;

    const newBook = new Book({
        title, 
        authors, 
        description, 
        favorite, 
        fileCover, 
        fileName,
        fileBook,
});
    try {
        await newBook.save();
        res.redirect(`/api/books`);
    } catch (e) {
        res.status(404).json(e);
    }
});


router.get('/:id', async (req, res) => {
    const {id} = req.params;

    let book;
    try{
        book =  await Book.findById(id).select('-__v');    
        res.render('../views/books/view', {
            title: 'Описание книги',
            books: book,
        });
    } catch(e) {
        res.status(404).json(e);
    }

    if (!book) {
        res.redirect('/404');
    }
});

router.get('/update/:id', async (req, res) => {
    const {id} = req.params;
    let book;
    try{
        book = await Book.findById(id).select('-__v');
        res.render("../views/books/update", {
            title: "Книга | Редактирование книги",
            books: book,
        });
    } catch(e) {
        res.status(404).json(e);
    }
    if (!book) {
        res.redirect('/404');
    }
});

router.post('/update/:id', 
    async (req, res) => {
    const {id} = req.params;
    const {
        title, 
        authors, 
        description, 
        favorite, 
        fileCover, 
        fileName,
        fileBook,
    } = req.body;
   
    try {
        await Book.findByIdAndUpdate(id, {
            title, 
            authors, 
            description, 
            favorite, 
            fileCover, 
            fileName,
            fileBook,
        });
        res.redirect(`/api/books/${id}`);
    } catch (e) { 
        res.status(404).json(e);
    }
    if(!book) {
        res.redirect('/404');
    }
});

router.post('/delete/:id', async (req, res) => {
    const {id} = req.params;
    try{
        await Book.deleteOne({_id: id});
        // res.redirect(`/api/books`);
        res.json(true);
    } catch(e) {
        res.status(404).json(e);
    }
});

module.exports = router;
