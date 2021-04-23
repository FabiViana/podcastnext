//--------------SPA
//useEffect é um hook uma função dispara sempre quando algo ...algo conteça "efeitos colateriais)"
//primeiro parâmetro o que eu quero executar e o segundo quando, passando o [] vazio ele vai execultar apenas uma vez

//----EX:

// import {useEffect} from 'react';

// export default function Home() {
//   useEffect(() => {
//     fetch('http://localhost:3333/episodes')
//     .then(response => response.json())
//     .then(data => console.log(data))
//   }, [])
//   return (
//     <h1>Index</h1>
//   )
// }

//---------------SSR
//Com next
//criar em qualquer arquivo em pages
//getServerSideProps ele roda toda vez que alguem acessa a página

//----EX:
// export default function Home(props) {
//   console.log(props.episodes)

//   return (
//     <h1>Index</h1>
//   )
// }

// export async function getServerSideProps() {
//   const response = await fetch('http://localhost:3333/episodes')
//   const data = await response.json()

//   return {
//     props: {
//       episodes: data,
//     }
//   }
// }

//SSG--NEXT
//Assim que alguém acessa essa página é gerado uma versão estatica 
//-Evita gastar recurso de requisição
//-Página muito mais performática
import { GetStaticProps } from 'next';
import Image from  'next/image';
import { api } from '../services/api';
import {format, parseISO} from 'date-fns';
import  ptBR  from 'date-fns/locale/pt-BR';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';
import styles from './home.module.scss';

type Episodes = {
  id: string,
  title: string,
  thumbnail: string,
  description: string,
  members: string,
  duration: number,
  durationAsString: string,
  url: string,
  publishedAT: string,
}

type HomeProps = {
  // episodes: Episodes[];
  //ou episodes: Array<Episodes>
  latestEpisodes: Episodes[];
  allEpisodes: Episodes[];
}

export default function Home({latestEpisodes, allEpisodes}: HomeProps) {
  return (
    <div className={styles.homepage}>
    <section className={styles.latestEpisodes}>
      <h2>Últimos lançamentos</h2>
      <ul>
        {latestEpisodes.map(episodes => {
          return (
            <li key={episodes.id}> 
              <Image 
                width={192} 
                height={192} 
                src={episodes.thumbnail} 
                alt={episodes.title} 
                />

              <div className={styles.episodeDetails}>
                <a href="">{episodes.title}</a>
                <p>{episodes.members}</p>
                <span>{episodes.publishedAT}</span>
                <span>{episodes.durationAsString}</span>
              </div>
              <button type="button">
                <img src="/play-green.svg" alt="Tocar episódio" />
              </button>
            </li>
          )
        })}
      </ul>
    </section>
    <section className={styles.allEpisodes}>
      
    </section>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAT: format(parseISO(episode.published_at), 'd MMM yy', {locale: ptBR}),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      description: episode.description,
      url: episode.file.url,
    }
  })

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length)

  return {
    props: {
      episodes,
      latestEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8,
  }
  //a mais no SSG passar o REVALIDATE  recebe um numero em segundos de quanto em quanto tempo preciso gerar um nova chamada na api, dentro do pedíodo eles receberam uma pagina statica
    //mas o SSG só atende em produção
}
