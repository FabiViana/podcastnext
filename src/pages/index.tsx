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


export default function Home(props) {
  console.log(props.episodes)

  return (
    <div>
    <h1>Index</h1>
    </div>
  )
}

export async function getStaticProps() {
  const response = await fetch('http://localhost:3333/episodes')
  const data = await response.json()

  return {
    props: {
      episodes: data,
    },
    //a mais no SSG passar o REVALIDATE  recebe um numero em segundos de quanto em quanto tempo preciso gerar um nova chamada na api, dentro do pedíodo eles receberam uma pagina statica
    //mas o SSG só atende em produção
    revalidate: 60 * 60 * 0,
  }
}
