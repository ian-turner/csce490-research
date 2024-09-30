export async function fetchAPI(route) {
    const response = await fetch(process.env.REACT_APP_API_URL + route, {
        credentials: 'include',
        method: 'GET',
    });

    const data = await response.json();
    if (response.status === 200) {
        return {error: null, data}
    } else {
        // error message
        if (data.message)
            return {error: data.message, data: null}
        else
            return {error: 'Error', data: null}
    }
}

export async function postAPI(route, body) {
    const response = await fetch(process.env.REACT_APP_API_URL + route, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const data = await response.json();
    if (response.status === 200) {
        return {data, error: null}
    } else {
        if (data.message)
            return {data: null, error: data.message}
        else
            return {data: null, error: 'Error'}
    }
}
