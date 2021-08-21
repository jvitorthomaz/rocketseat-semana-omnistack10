import React, { useState, useEffect } from 'react';
import api from './services/api'

import './global.css';
import './App.css';
import './Sidebar.css';
import './Main.css';

import DevForm from './components/DevForm'
import DevItem from './components/DevItem'


//Conceitos Principais do React:

/*
COMPONENTE: bloco isolado de HTMl CSS e JS, o qual nao interfere no resto da aplicacao 
- Deve ser feito apenas um comonente por arquivo, não se pode ter 2 ou mais no mesmo arquivo
*/

//ESTADO: Informações mantidas pelo componente (LEMBRAR DO CONCEITO DE IMUTABILIDADE)


//PROPRIEDADE: Informações que um componente PAI passa para um componenete FILHO


function App() {
  const [ devs, setDevs ] = useState([]);

  useEffect(() => {
    async function loadDevs() {
      const response = await api.get('/devs');

      setDevs(response.data);
    }
    loadDevs();
  }, []);

  async function handleAddDev(data) {
    //Para cadastrar um dev chama o metodo POST no Insomnia
    const response = await api.post('/devs', data)
    
/*
    para atualizar na tela = pegar o obj do dev que foi cadastrado eincluir ele no final do array de devs
    para isso, cria-se um array, copia todos os devs que já tem dentro do estado e adiciona o novo no final
*/
    setDevs([...devs, response.data]);
  }

  return (
    <div id="app">
      <aside>
        <strong>Cadastrar</strong>
        <DevForm onSubmit={handleAddDev} />
      </aside>

      <main>
        <ul>

          {devs.map(dev => (
//se colocasse {} estaria declarando o corpo da funçao. Não colocando {}, esta declarando o  
//retorno da funçao
/*
    quando se usa map,quando se percorre um array dentro da renderizaçao, o primeiro item dentro do map precisa ter um propriedade chamada "Key" e o valor dela precisar ser uma informaçao unica que se tem para cada um ds itens
    Em = <span>{dev.techs.join(', ')}</span>
    como techs é um array, deve-se juntar o array e então separar por ","
*/
            <DevItem key={dev._id} dev={dev} />
          ))}
        
        </ul>
      </main>
    </div>
  );
}

export default App;
