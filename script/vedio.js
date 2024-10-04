

function setTimeString(time){
    // const day = parseInt(time/86400)
    // let reminingHour = day % 86400;
    const hour = parseInt(time/3600);
    let reminingSecond = time % 3600;
    const minute = parseInt(reminingSecond / 60);
    reminingSecond = reminingSecond % 60;
    return ` ${hour} h ${minute} m ${reminingSecond} s ago`
}


const removeActiveClass = () => {
    const buttons = document.getElementsByClassName('category-btn')
    console.log(buttons)
    for(let btn of buttons){
        btn.classList.remove('active')
    }
}

const loadCatagories = () => {
    fetch('https://openapi.programming-hero.com/api/phero-tube/categories')
        .then(res => res.json())
        .then(data => displayCatagories(data.categories))
        .catch(error => console.log(error))
}
const loadVideos = (searchText = "") => {
    fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`)
        .then(res => res.json())
        .then(data => displayVideo(data.videos))
        .catch(error => console.log(error))
}

const loadCategoryVideos = (id) =>{
    // alert(id)
    fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id} `)
    .then(res => res.json())
    .then(data => {
        removeActiveClass()

        const activeBtn = document.getElementById(`btn-${id}`)
        activeBtn.classList.add('active')
        displayVideo(data.category)
    })
    .catch(error => console.log(error))
}

const videoDetails = async(videoID) =>{
    console.log(videoID)

    const uri = `https://openapi.programming-hero.com/api/phero-tube/video/${videoID}`
    const res = await fetch(uri)
    const data = await res.json();
    displayDetails(data.video)
}
const displayDetails = (video) =>{
    console.log(video)
    const detailsContainer = document.getElementById('modal-content')

    detailsContainer.innerHTML = `
    <img src="${video.thumbnail}"/>
    <p>${video.description}<p/>
    `

    // document.getElementById('showModalData').click()

    document.getElementById('customModal').showModal()



}
// const cardDemo = {
//         "category_id": "1001",
//         "video_id": "aaaa",
//         "thumbnail": "https://i.ibb.co/L1b6xSq/shape.jpg",
//         "title": "Shape of You",
//         "authors": [
//             {
//                 "profile_picture": "https://i.ibb.co/D9wWRM6/olivia.jpg",
//                 "profile_name": "Olivia Mitchell",
//                 "verified": ""
//             }
//         ],
//         "others": {
//             "views": "100K",
//             "posted_date": "16278"
//         },
//         "description": "Dive into the rhythm of 'Shape of You,' a captivating track that blends pop sensibilities with vibrant beats. Created by Olivia Mitchell, this song has already gained 100K views since its release. With its infectious melody and heartfelt lyrics, 'Shape of You' is perfect for fans looking for an uplifting musical experience. Let the music take over as Olivia's vocal prowess and unique style create a memorable listening journey."
// }


const displayVideo = (videos) => {
    const videoContainer = document.getElementById('videos');
    videoContainer.innerHTML = '';


    if(videos.length === 0){
        videoContainer.classList.remove('grid')
        videoContainer.innerHTML = `
        <div class="min-h-[300px] flex flex-col gap-5 justify-center items-center">
        <img src="img/icon.png" />
        <h2>No Contant here in this Categories</h2>
        </div>
        `
    }
    else{
        videoContainer.classList.add('grid')

    }


    videos.forEach((video) => {
        console.log(video)
        const card = document.createElement('div')
        card.classList = "card card-compact"
        card.innerHTML = `
          <figure class='h-[200px] relative'>
    <img
      src="${video.thumbnail}"
      class="h-full w-full object-cover"
      alt="Shoes" />
      ${video.others.posted_date?.length == 0 ? "": `<span class="absolute right-2 bottom-2 bg-black text-white text-xs rounded p-1">${setTimeString(video.others.posted_date)}</span>`}
      
  </figure>
  <div class="px-0 py-2 flex gap-2">
    <div>
    <img class='w-10 h-10 rounded-full object-cover' src=${video.authors[0].profile_picture} />
    </div>
    <div>
    <h2 class="font-bold">${video.title}</h2>
    <div class='flex '>
    <p class='text-gray-400'>${video.authors[0].profile_name}</p>
    ${
        video.authors[0].verified == true ? ` <img class='w-5 h-5 ml-2' src="img/verified.png"` : ""
    }
    </div>
        <button onclick="videoDetails('${video.video_id}')" class= "btn btn-error btn-sm">Details</button>

    </div>

  </div>
        `;
    videoContainer.append(card)
    })
}

const displayCatagories = (categories) => {
    const catagoriesContainer = document.getElementById('categories')
    categories.forEach(item => {
        console.log(item)

        const buttonContainer = document.createElement('div')
        buttonContainer.innerHTML = `
        <button id="btn-${item.category_id}" onclick="loadCategoryVideos(${item.category_id})" class='btn category-btn'>
        ${item.category}
        </button>
        `

        catagoriesContainer.append(buttonContainer)
    })
}

document.getElementById('search-input').addEventListener('keyup',(e)=>{
    loadVideos(e.target.value)
})



loadCatagories()
loadVideos()