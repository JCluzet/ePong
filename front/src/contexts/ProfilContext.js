import React, { createContext, useState } from 'react';

export const ProfilContext = createContext();

const ProfilContextProvider = (props) => {
    const [profil, setProfil] = useState({
        name: 'John Doe',
        avatarUrl: 'https://randomuser.me/api/portraits'
    });

    const editProfil = (name, avatarUrl) => {
        console.log("bam" . name, avatarUrl);
        setProfil({ name, avatarUrl });
    };

    return (
        <ProfilContext.Provider value={{ profil, editProfil}}>
            {props.children}
        </ProfilContext.Provider>
    );
}

export default ProfilContextProvider;