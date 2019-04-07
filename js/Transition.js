class Transition {
    // Type 0 = swipe from right side.
    
    constructor(type, url, callback) {
        this.type = type;
        this.url = url;

        this.callback = callback;
    }

    run() {
        switch(this.type) {
            case 0: {
                const swipingDiv = document.createElement('div');
                swipingDiv.classList.add('transition-swipe-div');
                document.body.appendChild(swipingDiv);

                // Further understanding required as to why this was necessary but it works.
                window.requestAnimationFrame(function() {
                    swipingDiv.style.transition = 'left 1s';
                    window.requestAnimationFrame(function() {
                        swipingDiv.classList.add('coverScreen');
                    });
                });
                // We need to find out when this particular animation has ended so that the ajax can begin.

                swipingDiv.addEventListener('webkitTransitionEnd', () => {
                    var xhr = new XMLHttpRequest();
                    xhr.open('GET', this.url);

                    console.log(this.url)
                    xhr.onload = () => {
                        if (xhr.status === 200) {
                            let parsedDocument = new DOMParser().parseFromString(xhr.responseText, 'text/html');
            
                            const afterTransitionCover = document.createElement('div');
                            afterTransitionCover.classList.add('afterTransitionCover');
            
                            parsedDocument.getElementsByTagName('body')[0].appendChild(afterTransitionCover);
                            document.getElementsByTagName('body')[0].innerHTML = parsedDocument.getElementsByTagName('body')[0].innerHTML;
                            
                            // Called manually since this event won't fire given how we're injecting the page.
                            const DOMContentLoaded_event = document.createEvent("Event");
                            DOMContentLoaded_event.initEvent("DOMContentLoaded", true, true);
                            window.document.dispatchEvent(DOMContentLoaded_event);

                            window.requestAnimationFrame(function() {
                                document.querySelector('.afterTransitionCover').style.transition = 'transform 1s';
                                window.requestAnimationFrame(function() {
                                    document.querySelector('.afterTransitionCover').style.transform = 'translateX(-100%)';
                                });
                            });

                            document.querySelector('.afterTransitionCover').addEventListener('webkitTransitionEnd', (evt) => {
                                evt.target.parentNode.removeChild(evt.target);
                                this.callback();
                            });
                        }
                        else {
                            console.log('Request failed. Please check your internet connection.');
                        }
                    };
                    xhr.send();
                });
            }   
        }
    }

}

