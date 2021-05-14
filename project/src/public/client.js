let store = Immutable.Map({
    data: '',
    currentData: 'apod',
    Images: ['curiosity', 'opportunity', 'spirit', 'apod'],
})

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
    store = store.merge(newState)
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}


// create content
const App = (state) => {

    return `
        <header>
            <h2>Space exploration</h2> 
            <h1>Rovers' recent photos</h1>
            <nav>
            <ul id="options"   >
            <li class="ImageOption">
                <button class="ImageButton" onclick="getImageOfTheDay()">
                APOD
                </button>
            </li>
            <li class="ImageOption">
                <button class="ImageButton" onclick="getRoverData('curiosity')">
                CURIOSITY
                </button>
            </li>
            <li class="ImageOption">
                <button class="ImageButton" onclick="getRoverData('opportunity')">
                OPPORTUNITY
                </button>
            </li>
            <li class="ImageOption">
                <button class="ImageButton" onclick="getRoverData('spirit')">
                SPIRIT
                </button>
            </li>
            </ul>
        </nav>
        </header>

        <main>
            <section>
                ${getData(state)}
            </section>
        </main>
        <footer></footer>
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})

// ------------------------------------------------------  COMPONENTS

const getData = (state) => {
    if (state.get('currentData') === 'apod'){
        return ImageOfTheDay(state.get('data'))
    }
    if (state.get('currentData') === 'curiosity'){
        return RoverPhotos(state.get('data'), 'curiosity')
    }
    if (state.get('currentData') === 'opportunity'){
        return RoverPhotos(state.get('data'), 'opportunity')
    }
    if (state.get('currentData') === 'spirit'){
        return RoverPhotos(state.get('data'), 'spirit')
    }
}

// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {
    // If image does not already exist, or it is not from today -- request it again
    const today = new Date()

    if (!apod || apod.date === today.getDate() ) {
        getImageOfTheDay()
    }

    // check if the photo of the day is actually type video!
    if (apod.media_type === "video") {
        return (`
            <p>See today's featured video <a href="${apod.url}">here</a></p>
            <p>${apod.title}</p>
            <p>${apod.explanation}</p>
        `)
    } else {
        return (`
            <div class="apodTitle">
            <h2>Here is the Astronomical Picture of the Day!!</h2>
            </div>
            <img src="${apod.get('image').get('url')}" class="apod"/>
            <div class="apodExp">
            <p><b>Explanation:</b> ${apod.get('image').get('explanation')}</p>
            </div>
        `)
    }
}

const RoverPhotos = (data, rover) => {
    // If image does not already exist, or it is not from today -- request it again
    if (!data ) {
        getRoverData(rover)
    }
    const launchDate = data.get('photos').get('0').get('rover').get('launch_date')
    const landinghDate = data.get('photos').get('0').get('rover').get('landing_date')
    const status = data.get('photos').get('0').get('rover').get('status')
    const rover_info = `<div class="roverTitle">
                            <h2>Here are the photos of the ${rover} rover</h2>
                        </div>
                        <div class="roverInfo">
                            <p>The ${rover} was launced on ${launchDate} and landed on mars on ${landinghDate}.
                            Its current status is ${status}
                            </p>
                        </div>`
    const totalPhotos = data.get('photos').size > 15 ? 15 : data.get('photos').size 
    const photos = data.get('photos').filter((val, idx) => idx < totalPhotos)
    const makeTiles = (photo) => {
        return `<div class="gridItem">
                    <img class="gridImg" src=${photo.get('img_src')}>
                    <p>This photo was taken in ${photo.get('earth_date')}</p>
                </div>`
            }
    return rover_info + '<main id="grid">\n' + photos.
        map(photo => makeTiles(photo)).
        reduce((acc, act) => acc + act + '\n')
        + '\n<\main>'
}

// ------------------------------------------------------  API CALLS

// Example API call
const getImageOfTheDay = () => {
    fetch(`http://localhost:3000/apod`)
        .then(res => res.json())
        .then(data => {
            updateStore(store, { data: data,  currentData: 'apod'})
        })

}

const getRoverData = (rover) => {
    fetch(`http://localhost:3000/rovers/${rover}`)
        .then(res => res.json())
        .then(data => {
            updateStore(store, { data: data.data,  currentData: rover} )
        })

}
