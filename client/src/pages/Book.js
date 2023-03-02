import './css/Book.css'

import Tag from '../components/Tag'

import {
    useParams
} from "react-router-dom";

import React, {useEffect, useState} from 'react'
import axios, * as others from 'axios';
import ContentEditable from 'react-contenteditable'

function Book(props) {
    let { id } = useParams();

    const [book, setBook] = useState(undefined);
    const [title, setTitle] = useState(undefined);
    const [subtitle, setSubtitle] = useState(undefined);
    const [desc, setDesc] = useState(undefined);
    const [date, setDate] = useState(undefined);
    const [author, setAuthor] = useState(undefined);
    const [category, setCategory] = useState(undefined);
    const [img, setImg] = useState(undefined);

    const [showResults, setShowResults] = useState(undefined);
    const [titleContent, setTitleContent] = useState(undefined);

    // TODO: fetch tags from our database
    const [tags, setTags] = useState([]);
   
    useEffect(() => {

        // TODO: Fetch image from database
        var isbn = require('node-isbn');
        isbn.resolve(id, function (err, book) {
            if (err) {
                console.log('Book not found', err);
            } else {
                setImg(book.imageLinks.thumbnail);
            }
        });

       axios.get("http://localhost:8080/api/books/" + id) 
        .then(res => {
            setBook(res)
            setTitle(res.data.data.title) 
            setTitleContent(title)
            setSubtitle(res.data.data.subtitle)
            setDesc(res.data.data.body)

        })
       .then(console.log(book))
    }, [title])
        
    const editBook = () => {
        setShowResults(true)
    }

    const saveBook = () => {
        let patchedBook = {
            id:id,
            title:titleContent,
            body:desc,
            author:author
        }
        axios.patch("http://localhost:8080/api/books/" + id, patchedBook)
        .then(res=> {
            console.log(res)
        })
        .catch(err=>console.log(err))   
        
        setShowResults(false);
    }

    const cancelBook = () => {
        setShowResults(false)
    }

    const onTitleChange = React.useCallback(e => {
       setTitleContent(e.currentTarget.innerText)
       console.log(e.target.value);
       }, [])

    return (
    <main className='Book-Wrapper'>
        <div className='Book-Header'>
            <div className='Book-Thumbnail'>
                <img src={img} height='256px' alt="thumbnail"></img>
            </div>
            <div className='Book-Text'>
                <h1 className='Book-Title'>{showResults ?  <ContentEditable onChange={onTitleChange} onBlur={onTitleChange} html={titleContent} /> : titleContent} </h1>
                <h2 className='Book-Sub-Title'>{showResults ? <p className='test' contentEditable='true'> {subtitle} </p> : subtitle}</h2>
                <p className='Book-Desc'>{showResults ?  <p className='test' contentEditable='true'> {desc} </p> : desc}</p>
            </div>
        </div>
        <br/>
        { 
            <div className='Book-Meta'>
                <p className='Book-Date'><b>Published: </b>{showResults ?  <p className='test' contentEditable = "true"> {date}</p> : date}</p> 
                <p className='Book-Author'><b>Author: </b>{showResults ?  <p className='test' contentEditable = "true"> {author}</p> : author}</p>
                <p className='Book-Category'><b>Category: </b>{showResults ? <p className='test' contentEditable = "true"> {category}</p> : category}</p>
                <p className='Book-Id'><b>ISBN: </b>{showResults ? <p className='test' contentEditable = "true"> {id}</p> : id}</p>
                <div className='Tags-Wrapper'>
                    {tags.map((tag) => <Tag key={tag} content={tag} />)}
                </div>
            </div>
        }   
        {
        }
        { !showResults && (
            <button type='button' id="edit-book" onClick={editBook}>Edit</button>
        )}
        { showResults ? (
            <div>
                <button type='button' id="edit-book" onClick={cancelBook}>Avbryt</button>
                <button type='button' id="edit-book" onClick={saveBook}>Spara</button>
            </div>
        ) : null }
    </main>); 
}

export default Book;