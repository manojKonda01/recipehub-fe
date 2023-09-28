window.onload = function() {
    // Fetch Most Popular recipes (for now fetching from json file)
    const popular_recipes_section = document.getElementById('recipe_cards');
    function load_popular_recipes_section()
    {
        fetch('assets/scripts/popular_recipes.json')
        .then(response => response.json())
        .then(data => {
            let appenHtml = '';
            for(let i in data){
                appenHtml += `<figure class="recipe-card margin-0">
                                <img src="`+data[i].url+`" alt="`+data[i].name+`Image">
                                <div class="recipe-overlay"></div>
                                <figcaption class="recipe-desc">
                                <p class="line1">Most Popular</p>
                                <p class="recipe-name">`+data[i].name+`</p>
                                <p class="chef-name">By `+data[i].by+`</p>
                                </figcaption>
                            </figure>`;
            }
            popular_recipes_section.innerHTML = appenHtml;
            const slides = document.querySelectorAll(".recipe-card");
            slides[0].style.display = 'block';

            // Click events for Previoud and Next (to scroll most popular recipies)
            const next_popular_reciepe = document.getElementById('next_popular_reciepe');
            const prev_popular_reciepe = document.getElementById('prev_popular_reciepe');
            let slideIndex = 0;
            next_popular_reciepe.addEventListener('click', function(){
                for (let i = 0; i < slides.length; i++) {
                    slides[i].style.display = "none";
                }
                slideIndex++;
                if (slideIndex >= slides.length) {
                    slideIndex = 0;
                }
                slides[slideIndex].style.display = "block";
            });
            prev_popular_reciepe.addEventListener('click',function(){
                for (let i = 0; i < slides.length; i++) {
                    slides[i].style.display = "none";
                }
                slideIndex--;
                if (slideIndex < 0) {
                    slideIndex = slides.length - 1;
                }
                slides[slideIndex].style.display = "block";
            });
        })
        .catch(error => console.log(error));
    }
    load_popular_recipes_section();
}


let navbar = document.getElementById('rh-navbar_down');
const menu_toggle_button = document.getElementById('menu_toggle_btn');
const close_navbar = document.getElementById('close_navbar');

// On Click Menu Icon Show the Menu List
menu_toggle_button.addEventListener('click', function(event){
    navbar.style.height= '80%';
    document.body.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
});

// On Click Close Icon close the Menu List
close_navbar.addEventListener('click', function(event){
    navbar.style.height = '0%';
    document.body.style.backgroundColor = 'rgba(0, 0, 0, 0)';
})

const mouse_click_sound = document.getElementById('mouse_click_sound');
const click_sound_play = document.querySelectorAll('.nested-submenu-item, #close_navbar');
for(let i=0; i< click_sound_play.length; i++){
    click_sound_play[i].addEventListener('click', function(){
        mouse_click_sound.play();
    });
}
