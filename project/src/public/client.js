let store = Immutable.Map({
    data: '',
    currentData: 'Apod',
    Images: ['Curiosity', 'Opportunity', 'Spirit', 'Apod'],
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
                <button class="ImageButton">
                APOD
                </button>
            </li>
            <li class="ImageOption">
                <button class="ImageButton">
                CURIOSITY
                </button>
            </li>
            <li class="ImageOption">
                <button class="ImageButton">
                OPPORTUNITY
                </button>
            </li>
            <li class="ImageOption">
                <button class="ImageButton">
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
    if (state.get('currentData') === 'Apod'){
        return ImageOfTheDay(state.get('data'))
    }
}

// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {
    console.log(apod)
    // If image does not already exist, or it is not from today -- request it again
    const today = new Date()
    const photodate = new Date(apod.date)
    console.log(photodate.getDate(), today.getDate());

    console.log(photodate.getDate() === today.getDate());
    if (!apod || apod.date === today.getDate() ) {
        getImageOfTheDay()
        console.log(apod)
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

// ------------------------------------------------------  API CALLS

// Example API call
const getImageOfTheDay = () => {
    fetch(`http://localhost:3000/apod`)
        .then(res => res.json())
        .then(data => {
            updateStore(store, { data })
        })

}

// const getImageOfTheDay = (state) => {
//     fetch(`http://localhost:3000/apod`)
//         .then(res => res.json())
//         .then(apod => {
//             updateStore(store, { apod })
//         })

// }
