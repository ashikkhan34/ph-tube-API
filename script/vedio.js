// Function to format the time in hours, minutes, and seconds ago format
function setTimeString(time){
    const hour = parseInt(time / 3600); // Calculate hours
    let reminingSecond = time % 3600; // Remaining seconds after calculating hours
    const minute = parseInt(reminingSecond / 60); // Calculate minutes from remaining seconds
    reminingSecond = reminingSecond % 60; // Remaining seconds after calculating minutes
    // Return formatted string
    return `${hour} h ${minute} m ${reminingSecond} s ago`;
}

// Function to remove 'active' class from all category buttons
const removeActiveClass = () => {
    const buttons = document.getElementsByClassName('category-btn'); // Get all category buttons
    console.log(buttons);
    for (let btn of buttons) {
        btn.classList.remove('active'); // Remove 'active' class from each button
    }
}

// Function to fetch categories and display them
const loadCatagories = () => {
    fetch('https://openapi.programming-hero.com/api/phero-tube/categories')
        .then(res => res.json()) // Convert response to JSON
        .then(data => displayCatagories(data.categories)) // Pass categories to display function
        .catch(error => console.log(error)); // Log error if request fails
}

// Function to fetch and display videos based on search text
const loadVideos = (searchText = "") => {
    fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`) // Fetch videos by search text
        .then(res => res.json()) // Convert response to JSON
        .then(data => displayVideo(data.videos)) // Pass videos to display function
        .catch(error => console.log(error)); // Log error if request fails
}

// Function to fetch videos by category ID
const loadCategoryVideos = (id) => {
    fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`) // Fetch videos by category
    .then(res => res.json()) // Convert response to JSON
    .then(data => {
        removeActiveClass(); // Remove 'active' class from all buttons
        const activeBtn = document.getElementById(`btn-${id}`); // Get the clicked button by ID
        activeBtn.classList.add('active'); // Add 'active' class to the clicked button
        displayVideo(data.category); // Pass the category videos to display function
    })
    .catch(error => console.log(error)); // Log error if request fails
}

// Function to fetch and display video details based on video ID
const videoDetails = async(videoID) => {
    console.log(videoID);
    const uri = `https://openapi.programming-hero.com/api/phero-tube/video/${videoID}`; // Create URI to fetch video details
    const res = await fetch(uri); // Fetch video details
    const data = await res.json(); // Convert response to JSON
    displayDetails(data.video); // Pass video details to display function
}

// Function to display video details in a modal
const displayDetails = (video) => {
    console.log(video);
    const detailsContainer = document.getElementById('modal-content'); // Get the modal content container

    // Populate the modal content with video thumbnail and description
    detailsContainer.innerHTML = `
    <img src="${video.thumbnail}"/>
    <p>${video.description}<p/>
    `;

    // Show the modal dialog with video details
    document.getElementById('customModal').showModal();
}

// Function to display videos in the container
const displayVideo = (videos) => {
    const videoContainer = document.getElementById('videos'); // Get the video container
    videoContainer.innerHTML = ''; // Clear the container content

    // If no videos are found, display a message
    if(videos.length === 0) {
        videoContainer.classList.remove('grid'); // Remove grid layout
        videoContainer.innerHTML = `
        <div class="min-h-[300px] flex flex-col gap-5 justify-center items-center">
        <img src="img/icon.png" />
        <h2>No Content here in this Category</h2>
        </div>
        `;
    } else {
        videoContainer.classList.add('grid'); // Add grid layout if videos exist
    }

    // Loop through each video and create a card for each
    videos.forEach((video) => {
        console.log(video);
        const card = document.createElement('div'); // Create a new div element for each video
        card.classList = "card card-compact"; // Add class to the card
        card.innerHTML = `
          <figure class='h-[200px] relative'>
            <img
              src="${video.thumbnail}"
              class="h-full w-full object-cover"
              alt="Video Thumbnail" />
            ${video.others.posted_date?.length == 0 ? "" : `<span class="absolute right-2 bottom-2 bg-black text-white text-xs rounded p-1">${setTimeString(video.others.posted_date)}</span>`}
          </figure>
          <div class="px-0 py-2 flex gap-2">
            <div>
              <img class='w-10 h-10 rounded-full object-cover' src=${video.authors[0].profile_picture} />
            </div>
            <div>
              <h2 class="font-bold">${video.title}</h2>
              <div class='flex '>
                <p class='text-gray-400'>${video.authors[0].profile_name}</p>
                ${video.authors[0].verified == true ? `<img class='w-5 h-5 ml-2' src="img/verified.png"/>` : ""}
              </div>
              <button onclick="videoDetails('${video.video_id}')" class="btn btn-error btn-sm">Details</button>
            </div>
          </div>
        `;
        videoContainer.append(card); // Add the card to the video container
    });
}

// Function to display category buttons
const displayCatagories = (categories) => {
    const catagoriesContainer = document.getElementById('categories'); // Get the category container
    categories.forEach(item => {
        console.log(item);
        const buttonContainer = document.createElement('div'); // Create a new div for each category button
        buttonContainer.innerHTML = `
        <button id="btn-${item.category_id}" onclick="loadCategoryVideos(${item.category_id})" class='btn category-btn'>
        ${item.category}
        </button>
        `;
        catagoriesContainer.append(buttonContainer); // Add the button to the category container
    });
}

// Add event listener for the search input to fetch videos based on user input
document.getElementById('search-input').addEventListener('keyup',(e) => {
    loadVideos(e.target.value); // Fetch videos based on search input
});

// Load categories and videos on page load
loadCatagories(); // Fetch and display categories
loadVideos(); // Fetch and display all videos


