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

function filterCountries(arr) {
  const banList = ['bv', 'mp', 'gp', 'hk', 'fk', 'cw', 'pn', 'mq', 'cc', 'tf', 'gu', 'mo', 'pr', 'je', 'gg', 'nf', 'tk', 'fo', 'bl', 'im', 'aq', 'mf', 'ky', 'nc', 'ps', 'nu', 'vg', 'ax', 'aw', 'yt', 'bm', 'vi', 'eh', 'um', 'as', 'gf', 'ms', 'pm', 'gi', 'gs', 'sj', 'tc', 'ai', 'pf', 'sx', 'cx', 'wf', 'ck', 'io', 're', 'hm', 'sh', 'gl', 'bes islands', 'saint helena']
  var filteredArr = []
  arr.forEach(val => {
    if(!banList.includes(val.altSpellings[0].toLowerCase())) {
      filteredArr.push(val)
    }
  })

  return filteredArr
}

function createFlag(country) {
  const divBandeira = document.createElement('div')
  divBandeira.classList.add('bandeira')
  
  const imgBandeira = document.createElement('img')
  imgBandeira.src = country.flags.png
  imgBandeira.classList.add('img-bandeira')
  imgBandeira.addEventListener('click', () => console.log(country.altSpellings))
  divBandeira.appendChild(imgBandeira)

  
  const input = document.createElement('input')
  input.type = 'text'
  input.style.maxWidth = '326px'
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
  countriesArr = filterCountries(data)
  console.log(countriesArr)


  countriesArr.forEach(country => {
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