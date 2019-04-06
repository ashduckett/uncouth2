// Replace the intitial state. This allows us to pass in a url if the user hits back and comes back to home.
history.replaceState({
    url: 'index.php',
    prettyUrlText: ''
}, 'Title', '/');



document.addEventListener('DOMContentLoaded', () => {
       
    window.onpopstate = (e) => {
        const transition = new Transition(0, e.state.url, () => {
//            console.log('page popped and transitioned')
        })
        transition.run();
    };

    const desktopNavLinks = document.querySelectorAll('.nav__menu-item-link, .nav__branding');
    desktopNavLinks.forEach((item) => {
        item.onclick = (e) => {
            e.preventDefault();
            
            const prettyUrl = e.target.getAttribute('data-prettyUrl');

            const transition = new Transition(0, e.target.href, () => {
                // When we push the state we need to pass the actual url so the page
                // can be reconstructed on hitting back or forward. Also a prettier URL.
                history.pushState({
                    url: e.target.href
                }, null, prettyUrl);
            });
            transition.run();
        };
    });

    const menuItems = document.querySelectorAll('.nav__menu-item');
    
    menuItems.forEach((menuItem, index) => {
        menuItem.style.animationDelay = (index + 1) / 12 + 's';
    });
    
    const monileMenuItems = document.querySelectorAll('.nav__mobileMenuItem');
    monileMenuItems.forEach((menuItem, index) => {
        menuItem.style.animationDelay = (index + 1) / 12 + 's';
    });


    window.addEventListener('scroll', () => {
        const menuItems = document.querySelectorAll('.nav__menu-item');

        if (window.scrollY === 0) {
            menuItems.forEach((menuItem) => {
                menuItem.classList.remove('nav__menu-item--hidden');
                
                menuItem.classList.add('nav__menu-item--show');

                
            });
            document.querySelector('.hamburger').classList.remove('hamburger--visible');

            document.querySelector('.nav__menu').classList.remove('nav__menu--hidden');
            
        } else {
            menuItems.forEach((menuItem) => {
                menuItem.classList.add('nav__menu-item--hidden');
                menuItem.classList.remove('nav__menu-item--show');
            });
            document.querySelector('.hamburger').classList.add('hamburger--visible');
            document.querySelector('.nav__menu').classList.remove('nav__menu--hidden');
            
        }
    });

    document.querySelector('.hamburger').addEventListener('click', () => {
        
        
        document.querySelector('.hamburger').classList.toggle('isActive');
        document.querySelector('.hamburger__altMenuContainer').classList.toggle('hamburger__altMenuContainer--show');
        document.querySelector('.altMenuItems').classList.toggle('altMenuItems--shown');

    });
    
    


});