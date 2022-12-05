
let saveToken = (token) => {
    localStorage.setItem('token', token);
    // console.log('token saved' + token);
}

let logout = () => {
    localStorage.removeItem('token');
    window.location.href = "/";
}

let isLogged = () => {
    return localStorage.getItem('token') !== null;
}

export const accountService = {
    saveToken,
    logout,
    isLogged
}