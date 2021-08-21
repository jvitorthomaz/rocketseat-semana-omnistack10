import React from 'react';

import './style.css';

//usando desestruturação
function DevItem({ dev }){

    //Em = <span>{dev.techs.join(', ')}</span>
    //como techs é um array, deve-se juntar o array e então separar por ","

    return (
        <li className="dev-item">
            <header>
              <img src={dev.avatar_url} alt={dev.name}/>
              <div className="user-info">
                <strong>{dev.name}</strong>
                <span>{dev.techs.join(', ')}</span>  
              </div>
            </header>
            <p>{dev.bio}</p>
            <a href={`https://github.com/${dev.github_username}`}>Acessar perfil no Github</a>
          </li>
    );
}

export default DevItem;