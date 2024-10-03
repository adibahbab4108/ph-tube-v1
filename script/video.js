const getTime = (time) => {
    const hour = parseInt(time / 3600);
    let remainingSeconds = time % 3600;
    const minutes = parseInt(remainingSeconds / 60);
    remainingSeconds = minutes % 60;

    return `${hour}h ${minutes}min ${remainingSeconds}sec`;
}
const activateBtn = (allCategoryBtn, clicked) => {

    for (let btn of allCategoryBtn) {
        btn.classList.remove('bg-red-300', 'hover:bg-red-500', 'text-white');
    }
    document.getElementById(clicked).classList.add('bg-red-300', 'hover:bg-red-500', "text-white")
}
const loadCatagoryVideos = (id) => {
    // alert(id)
    fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
        .then(res => res.json())
        .then(data => displayVideos(data.category))
        .catch(err => console.log(err))
}

// loadCatagories
const loadCatagories = () => {
    // fetch
    fetch('https://openapi.programming-hero.com/api/phero-tube/categories')
        .then(res => res.json())
        .then(data => displayCatagories(data.categories))
        .catch(err => console.log(err))
}

// loadVideos
const loadVideos = (searchText = "") => {
    // fetch
    fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`)
        .then(res => res.json())
        .then(data => displayVideos(data.videos))
        .catch(err => console.log(err))
}

//  displayCatagories
const displayCatagories = (categories) => {
    const categoryContainer = document.getElementById('category-btn');
    const allCategoryBtn = document.getElementsByClassName('category-btns');

    categories.forEach(element => {

        const button = document.createElement('button');
        button.classList.add("category-btns", "btn");
        button.id = `btn-${element.category_id}`
        button.innerText = element.category;
        button.onclick = () => {
            activateBtn(allCategoryBtn, `btn-${element.category_id}`);
            loadCatagoryVideos(element.category_id);
        }
        categoryContainer.append(button)
    });
}
const displayDetails = async (videoId) => {
    const url = `https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`;
    const res = await fetch(url);
    const data = await res.json();
    console.log(data.video.description)

    const descriptionContainer = document.getElementById('modal-content');
    descriptionContainer.innerHTML = `
        <p>${data.video.description}</p>
    `
    document.getElementById("videoDescriptionModal").showModal();
}
const displayVideos = (videos) => {
    const videoContainer = document.getElementById('videos');
    videoContainer.innerHTML = "";

    if (videos.length == 0) {
        videoContainer.classList.remove('grid')
        videoContainer.innerHTML = `
        <div class="min-h-screen flex flex-col gap-5 justify-center items-center">
        <img src="assets/Icon.png"/>
        <h2 class="text-center text-2xl font-bold"> No content found </h2>
        </div>
        `;
        return
    } else {
        videoContainer.classList.add('grid')

    }
    videos.forEach(video => {
        const videoCard = document.createElement('div');
        videoCard.classList = ('card card-compact');

        videoCard.innerHTML = `
        <figure class="h-[200px] relative">
        <img
        src="${video.thumbnail}"
        class="h-full w-full object-cover"
        alt="Thumbnail" />
        ${video.others.posted_date?.length == 0 ? "" : `<span class="absolute right-2 bottom-2 bg-black rounded p-1 text-white text-xs">${getTime(video.others.posted_date)}</span>`}
            </figure>
            <div class="flex justify-between px-0 py-2 ">
                <div class="px-0 py-2 flex gap-2 ">
                     <div>
                        <img class="h-10 w-10 rounded-full object-cover" src="${video.authors[0].profile_picture}"/>
                    </div>
                    <div>
                        <h2 class="font-bold">${video.title}</h2>
                        <div class="flex items-center gap-2">
                            <p>${video.authors[0].profile_name}</p>
                            ${video.authors[0].verified == true ? '<img class="w-5" src="https://img.icons8.com/?size=48&id=D9RtvkuOe31p&format=png" />' : ""}
                        </div>
                    </div>   
                </div>
              <button onclick="displayDetails('${video.video_id}')" class="btn bg-red-500 text-white">Details</button>
            </div>
        `

        videoContainer.append(videoCard)
    })
}
document.getElementById('search-input').addEventListener('keyup', (e) => {
    loadVideos(e.target.value)
})

loadCatagories();
loadVideos();
