async function fetchData() {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all?fields=name,flags,altSpellings,translations')

    if(!response.ok) {
      throw new Error(`Erro HTTP. Status: ${response.status}, ${response.statusText}`)
    }

    if(response.status == 200) {
      var data = await response.json()
      
      return data
    }

  } catch (error) {
    console.error(error)
  }
}

function shuffle(arr) {
  for(let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
  }
}

function createFlag(country) {
  const divBandeira = document.createElement('div')
  divBandeira.classList.add('bandeira')
  
  const imgBandeira = document.createElement('img')
  imgBandeira.src = country.flags.png
  imgBandeira.classList.add('img-bandeira')
  divBandeira.appendChild(imgBandeira)

  // const h2Nome = document.createElement('h2')
  // h2Nome.innerText = country.translations.por.common
  // divBandeira.appendChild(h2Nome)
  
  const input = document.createElement('input')
  input.type = 'text'
  input.classList.add('input-nome')
  divBandeira.appendChild(input)

  return {
    element: divBandeira,
    input: input,
  }
}

function formatarNomePais(nome) {
  if(typeof nome != "string") return nome
  return nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}

async function app() {
  const divBandeiras = document.getElementById('bandeiras')
  var data = await fetchData()

  shuffle(data)

  console.log(data[1])

  data.forEach(country => {
    const names = [
      formatarNomePais(country.name.common).toLowerCase(),
      formatarNomePais(country.translations.por.common).toLowerCase(),
      ... country.altSpellings.map(val => formatarNomePais(val).toLowerCase())
    ]

    const obj = createFlag(country)
    obj.input.addEventListener('input', (e) => {
      var chute = formatarNomePais(e.target.value).toLowerCase()
      if(names.includes(chute)) {
        e.target.value = country.translations.por.common
        e.target.disabled = true
      }
      
    })
    divBandeiras.appendChild(obj.element)
  })

}

app()