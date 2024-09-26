import { useState } from 'react';
import { useNavigate } from "react-router-dom";


export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    async function handleSubmit(event) {
        event.preventDefault();

        // handle login request to server
        const response = await fetch(process.env.REACT_APP_API_URL + '/login', {
            method: 'POST',
            body: JSON.stringify({username, password}),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 200) {
            // successful login
            navigate('/');
        } else {
            // do error here
            const data = await response.json();
            if (data.message)
                alert(data.message);
            else
                alert('Error');
        }
    }

    return (<div>
        <form onSubmit={handleSubmit}>
            <h3>Login</h3>
            <div>
                <label htmlFor='username-input'>Username</label>
                <input type='text' name='username' id='username-input' placeholder='username'
                value={username} onChange={e => setUsername(e.target.value)}/>
            </div>
            <div>
                <label htmlFor='password-input'>Password</label>
                <input type='password' name='password' id='password-input'
                value={password} onChange={e => setPassword(e.target.value)}/>
            </div>
            <button type='submit'>Submit</button>
        </form>
    </div>);
}
