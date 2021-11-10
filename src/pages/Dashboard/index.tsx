import React from 'react';
import {FiChevronRight} from 'react-icons/fi'
import {api} from '../../services/api'
import {Title, Form, Repos, Error} from './style'
import logo from '../../assets/logo.svg'
import {Link} from 'react-router-dom'

interface GitHubRepository{
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string
  }
}

const Dashboard: React.FC = () => {
  const[repos, setRepos] = React.useState<GitHubRepository[]>(() => {
    const storageRepos = localStorage.getItem('@GitCollection:repositorios')

    if(storageRepos){
      return JSON.parse(storageRepos)
    }
    return []
  })
  const[newRepo, setNewRepo] = React.useState('')
  const[inputError, setInputError] = React.useState('')

  const formEl = React.useRef<HTMLFormElement | null>(null)

  React.useEffect(() => {
    localStorage.setItem('@GitCollection:repositorios', JSON.stringify(repos))
  }, [repos])

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>):void{
    setNewRepo(event.target.value)
  }

  async function handleAddRepo(event: React.FormEvent<HTMLFormElement>): Promise<void>{
    event.preventDefault();

    if(!newRepo){
      setInputError('Informe o userName/repositorio')
      return
    }
    try {
      const response = await api.get<GitHubRepository>(`repos/${newRepo}`)

      console.log(response);
      
      const repository = response.data
    
      setRepos([...repos, repository])
      formEl.current?.reset()
      setNewRepo('')
      setInputError('')
    } catch {
      setInputError('repositorio não encontrado')
    }
  }

  return (
      <>
      <img src={logo} alt="git collection" />
        <Title>Catálogo de repositorios do GitHub </Title>
        <Form ref={formEl} hasError={Boolean(inputError)} onSubmit={handleAddRepo}>
            <input placeholder="username/repository_name" onChange={handleInputChange}/>
            <button type="submit">Buscar</button>
        </Form>

        {inputError  && <Error>{inputError}</Error>}

        <Repos>
         {repos.map((repositorio, index) => (
            <Link to={`repositorios/${repositorio.full_name}`} key={repositorio.full_name + index}>
            <img src={repositorio.owner.avatar_url} alt={repositorio.owner.login}/>
            <div>
              <strong>{repositorio.full_name}</strong>
              <p>{repositorio.description}</p>
            </div>
            <FiChevronRight  size={20}/>
          </Link>
         ))}
        </Repos>
      </>
  );
}
 
export default Dashboard