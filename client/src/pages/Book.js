import './css/Book.css'

import Tag from '../components/Tag'

import {
    useParams, useNavigate
} from "react-router-dom";

import React, {useEffect, useState} from 'react'
import axios, * as others from 'axios';
import ContentEditable from 'react-contenteditable'
import HeaderWithoutSearch from '../components/headers/HeaderWithoutSearch';
function Book(props) {
    let {id, type} = useParams();

    const [showResults, setShowResults] = useState(undefined);
    const [newBook, setNewBook] = useState(undefined);
    const [book, setBook] = useState({});
    const [user, setUser] = useState(undefined);
    
    const [bookMod, setBookMod] = useState({
        id:id,
        title:"",
        subtitle:"",
        body:"",
        published:"",
        author:"",
        category:""
    })

    useEffect(() => {
        if(type === "add"){
            setShowResults(true);
            setNewBook(true);
        }
    }, [type])

    let navigate = useNavigate();
    const routeToIndex = () =>{
        navigate('/');
    }

    function removeBook(){
        axios.defaults.headers.common['x-access-token'] = localStorage.getItem('token');
        axios.delete("http://localhost:8080/api/books/" + id)
        .then(res =>{
            console.log(res)
            if(!res.data.data){
                console.log("ingen resdata");
            }
        })
        .catch(err => {
            console.log(err);
        })
    }
    function borrowBook(){
        // TODO: Add authentication, waiting for logged in user implementation
        let borrow = {
            borrower:user,
            borrowed:true
        }
        axios.defaults.headers.common['x-access-token'] = localStorage.getItem('token');
        axios.patch("http://localhost:8080/api/books/" + id, borrow)        
        .then(res =>{
            console.log(res)
            if(!res.data.data){
                console.log("fel?");
            }
        })
        .catch(err => {
            console.log(err);
        })
       console.log(user)    
    }

    function returnBook(){
        // TODO: Add authentication, waiting for logged in user implementation
        let returner = {
            borrower:'',
            borrowed:false
        }
        axios.defaults.headers.common['x-access-token'] = localStorage.getItem('token');
        axios.patch("http://localhost:8080/api/books/" + id, returner)        
        .then(res =>{
            console.log(res)
            if(!res.data.data){
                console.log("fel?");
            }
        })
        .catch(err => {
            console.log(err);
        })
       console.log(user)
    }

    function removeFunc(){
        removeBook();
        routeToIndex();
    }

    useEffect(() => {
        axios.get("http://localhost:8080/api/books/" + id)
        .then(res => {
            setBook(res.data.data)
            setBookMod(res.data.data) // copy for modification
        })
        .catch(err => console.log(err))
    }, [])
        
    const editBook = () => {
        setShowResults(true)
    }

    const saveBook = () => {
        console.log(bookMod)
        axios.defaults.headers.common['x-access-token'] = localStorage.getItem('token');
        axios.patch("http://localhost:8080/api/books/" + id, bookMod)
        .then(res=> {
            console.log(res)
        })
        .catch(err=>console.log(err))   
        setBook(bookMod)
        setShowResults(false);

        if (newBook) {
            setNewBook(false);
            routeToIndex();
        }
    }

    const cancelBook = () => {
        // reset input fields
        setBookMod(book)

        setShowResults(false)

        if (newBook) {
            setNewBook(false);
            removeFunc()
        }
    }

    const handleChange = e => {
        const {title,textContent} = e.currentTarget
        setBookMod({
            ...bookMod,
            [title]:textContent
        })
    }
    
    return (
    <>
        <HeaderWithoutSearch/>
        {
            <main className='Book-Wrapper'>
                <div className='Book-Header'>
                    <div className='Book-Thumbnail'>
                        <img src={book.imgstr} height='256px' alt="thumbnail"></img>
                    </div>
                    <div className='Book-Text'>
                        <h1 className='Book-Title'>{showResults ?  <ContentEditable title="title" onChange={handleChange} onBlur={handleChange} html={bookMod.title} /> : book.title} [{book.borrower}]</h1>
                        <h2 className='Book-Sub-Title'>{showResults ? <ContentEditable title="subtitle" onChange={handleChange} onBlur={handleChange} html={bookMod.subtitle} /> : book.subtitle}</h2>
                        <span className='Book-Desc'>{showResults ?  <ContentEditable title="body" onChange={handleChange} onBlur={handleChange} html={bookMod.body} /> : book.body}</span>
                    </div>
                </div>
                <br/>
                { 
                    <div className='Book-Meta'>
                        <span className='Book-Date'><b>Published: </b>{showResults ?  <ContentEditable title="published" onChange={handleChange} onBlur={handleChange} html={bookMod.published} /> : book.published}</span>{!showResults ? <br></br> : <></>}
                        <span className='Book-Author'><b>Author: </b>{showResults ?  <ContentEditable title="author" onChange={handleChange} onBlur={handleChange} html={bookMod.author} /> : book.author}</span>{!showResults ? <br></br> : <></>}
                        <span className='Book-Category'><b>Category: </b>{showResults ? <ContentEditable title="category" onChange={handleChange} onBlur={handleChange} html={bookMod.category} /> : book.category}</span>{!showResults ? <br></br> : <></>}
                        <span className='Book-Id'><b>ISBN: </b>{book._id}</span>{!showResults ? <br></br> : <></>}
                        <div className='Tags-Wrapper'>
                            {book.tags && book.tags.map((tag) => <Tag key={tag} content={tag} isbn={book._id} show_rm={true}/>)}
                        </div>
                    </div>
                }  

                <div className ='Book-buttons'>
                    {/* TODO: Only show if book isn't borrowed?*/}

                    { !newBook && (
                        <div className ='Borrow-Book'>
                            <button type='button' id="borrow-submit" onClick={borrowBook}>Låna bok</button>
                        </div>
                    )}

                     {/* TODO: Only let user who borrowed book se this*/}
                    {/*
                    <div className='Return-Book'>
                        <button type='button' id='return-submit' onClick={returnBook}>Lämna bok</button>
                </div>*/}
                    { !newBook && (
                        <div className ='Remove-Book'>
                            <button type='button' id="isbn-remove" onClick={removeFunc}>Ta bort bok</button>
                        </div>
                    )}

                    
                   { !showResults && (
                        <button type='button' id="edit-book" onClick={editBook}>Ändra metadata</button>
                    )}
                    { showResults ? (
                        <div className='Align-h'>
                            <button type='button' id="edit-book" onClick={saveBook}>Spara</button>
                            <button type='button' id="edit-book" onClick={cancelBook}>{!newBook ? <p>Avbryt</p> : <p>Avbryt & ta bort</p>}</button>
                        </div>
                    ) : null }
                    
                 
                </div>
            </main>
        }
    </>
        ); 
}

export default Book;