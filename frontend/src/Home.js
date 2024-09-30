import { useState, useEffect } from 'react';
import { fetchAPI, postAPI } from './api.js';
import { useNavigate } from "react-router-dom";


export default function Home() {
    const navigate = useNavigate()
    async function handleNewBoard(event) {
        event.preventDefault();
        const {data, error} = await postAPI('/newboard', {});
        if (data) {
            navigate('/boards/' + data.board_id)
        }
    }

    const [boards, setBoards] = useState([]);
    useEffect(() => {
        async function getData() {
            const {data, error} = await fetchAPI('/myboards');
            if (data && data.boards)
                setBoards(data.boards)
        }
        getData();
    }, []);

    return (
        <div>
            <h3>My Boards</h3>
            <a onClick={handleNewBoard}>New board</a>
            {boards.map((board) =>
                <div onClick={e => e.detail === 2 ? navigate('/boards/' + board.id) : console.log()} key={board.id}>{board.name}</div>
            )}
        </div>
    );
}
