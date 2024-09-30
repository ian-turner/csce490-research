import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchAPI, postAPI } from './api.js';
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

import Note from './Note.js';


export default function Board() {
    const { uuid }  = useParams();
    const [board, setBoard] = useState({});
    const [notes, setNotes] = useState([]);

    function handleClick(event) {
        // double click
        if (event.detail === 2) {
            // creating a new note
            const newNote = {body: '', x: event.clientX, y: event.clientY, id: uuidv4()};
            setNotes([...notes, newNote]);
        }
    }

    function handleNoteUpdate(i) {
        function handler(event) {
            setNotes(notes.map((note, j) => {
                if (i != j)
                    return note;
                else
                    return {...note, body: event.target.value};
            }));
        }
        return handler;
    }

    useEffect(() => {
        // getting the board data from the server
        async function getData() {
            const {data, error} = await fetchAPI('/boards/' + uuid);
            if (data.board) {
                setBoard(data.board);
                setNotes(data.board.notes);
            }
        }
        getData();
    }, []);

    if (board) {
        return (
            <div>
                <div>
                    <h3>{board.name}</h3>
                </div>
                <div onClick={handleClick} style={{width: '100%', height: '100vh'}}>
                    {notes.map((note, i) => <Note note={note} key={note.id} handleUpdate={handleNoteUpdate(i)}/>)}
                </div>
            </div>
        );
    } else {
        return (
            <h1>Loading</h1>
        );
    }
}
