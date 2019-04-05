document.addEventListener('DOMContentLoaded', () => {
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