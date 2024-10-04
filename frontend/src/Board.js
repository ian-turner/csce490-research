import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchAPI, postAPI } from './api.js';
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';


export default function Board() {
    const { uuid }  = useParams();
    const [board, setBoard] = useState({});
    const [notes, setNotes] = useState([]);
    const [drag, setDrag] = useState(null);

    async function handleClick(event) {
        // double click
        if (event.detail === 2) {
            // creating a new note
            const newNote = {id: uuidv4(), body: '', x: event.clientX, y: event.clientY};
            setNotes([...notes, newNote]);
        }
    }

    async function getBoard() {
        const {data, error} = await fetchAPI('/boards/' + uuid);
        if (error) {
            // handle error here
        } else {
            if (data.board) {
                setBoard(data.board);
                if (data.board.notes)
                    setNotes(data.board.notes);
                else
                    setNotes([]);
            }
        }
    }

    async function handleSave(event) {
        const apiData = JSON.parse(JSON.stringify(board));
        apiData.notes = JSON.parse(JSON.stringify(notes));
        const {data, error} = await postAPI('/boards/' + uuid, {board: apiData});
        if (error) {
            // handle error here
            alert(error);
        } else {
            alert(data.message);
        }
    }

    function handleMouseDown(event, noteId) {
        setDrag(noteId);
    }

    function handleMouseUp(event) {
        setDrag(null);
    }

    function handleDrag(event) {
        if (drag) {
            setNotes(notes.map(note => {
                if (note.id === drag) {
                    return {...note, x: note.x + event.movementX,
                    y: note.y + event.movementY};
                } else {
                    return note;
                }
            }));
        }
    }

    useEffect(() => {
        // getting the board data from the server
        getBoard();
    }, []);

    if (board) {
        return (
            <div onMouseMove={handleDrag} onMouseUp={handleMouseUp}>
                <div>
                    <input type='text' value={board.name || ''} onChange={e => 
                        setBoard({...board, name: e.target.value})}/>
                    <div onClick={handleSave}>Save</div>
                </div>
                <div onClick={handleClick} style={{width: '100%', height: '100vh'}}>
                    {notes.map(note =>
                        <div
                            style={{
                                width: 300,
                                height: 200,
                                position: 'absolute',
                                background: 'blue',
                                top: note.y,
                                left: note.x
                            }}
                            key={note.id}
                        >
                            <div
                                style={{
                                    width: '100%',
                                    height: 20,
                                }}
                            onMouseDown={event => handleMouseDown(event, note.id.slice(0))}
                            >
                            </div>
                            <textarea
                                style={{
                                    outline: 'none',
                                    width: '100%',
                                    height: '100%',
                                    resize: 'none',
                                }}
                                value={note.body}
                                onClick={e => e.stopPropagation()}
                                onChange={event => {
                                    setNotes(notes.map(_note => {
                                        if (note.id === _note.id)
                                            return {..._note, body: event.target.value};
                                        else
                                            return _note;
                                    }));
                                }}
                            ></textarea>
                        </div>
                    )}
                </div>
            </div>
        );
    } else {
        return (
            <h1>Loading</h1>
        );
    }
}
