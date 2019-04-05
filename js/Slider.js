// Controller
class Slider {
    constructor(canvas, slides) {
        this.model = new SliderModel(slides);
        this.view = new SliderView(canvas, this);
    }

    render() {
        this.view.render();
    }

    getCurrentSlideIndex() {
        return this.model.currentSlide;
    }

    getSlides() {
        return this.model;
    }
}

class SliderModel {
    constructor(slideModelArray) {
        if (slideModelArray.length > 0) {
            this.currentSlide = 0;
        } else {
            this.currentSlide = null;
        }
    
        // Store slide model data
        this.slideModels = slideModelArray;
    }
}

// View
class SliderView {
    
    getAllSlides() {
        return this.controller.getSlides();
    }

    getPrevSlideElement() {
        if (this.slideElements.length > 1) {
            if (this.currentSlideIndex == 0) {
                return this.slideElements[this.slideElements.length - 1]
            } else {
                return this.slideElements[this.currentSlideIndex - 1]
            }
        }
    }

    getNextSlideElement() {
        if (this.slideElements.length > 1) {
            if (this.currentSlideIndex + 1 !== this.slideElements.length) {
                return this.slideElements[this.currentSlideIndex + 1];
            } else {
                return this.slideElements[0];
            }
        }
    }
    

    getCurrentSlideElement() {
        return this.slideElements[this.currentSlideIndex];
    }

    constructor(canvas, controller) {
        this.shiftsLeft = null;
        this.shiftsRight = null;
        this.canvas = canvas;
        this.currentSlideElement = null;
        this.controller = controller;
        this.i = 0;
        this.globalId = null;
        this.end = null;
        this.slideElements = [];
        this.currentSlideIndex = 0;
        this.isAnimating = false;
        this.shouldAutoScroll = true;

        // Construct slide elements
        const slideModels = this.getAllSlides().slideModels;

        slideModels.forEach(function(slide) {
            this.slideElements.push(slide.view.slideElement);
        }, this);
    }

    fixLayout() {
        const containerWidth = this.container.offsetWidth;
        this.getCurrentSlideElement().style.left = 0 + 'px';
        this.getCurrentSlideElement().style.width = containerWidth + 'px';

        this.getNextSlideElement().style.width = containerWidth + 'px';
        this.getNextSlideElement().style.left = containerWidth + 'px';

        this.getPrevSlideElement().style.width = containerWidth + 'px';
        this.getPrevSlideElement().style.left = -containerWidth + 'px';
    }

    async render() {
        var container = document.createElement('div');
        container.classList.add('uncouthSlider');
        this.canvas.appendChild(container);

        this.currentSlideElement = this.getCurrentSlideElement();
        this.prevSlideElement = this.getPrevSlideElement();
    
        this.prevSlideElement.style.left = -(this.canvas.offsetWidth) + 'px';

        this.nextSlideElement = this.getNextSlideElement();
        this.nextSlideElement.style.left = this.canvas.offsetLeft + this.canvas.offsetWidth + 'px';

        container.appendChild(this.currentSlideElement);
        container.appendChild(this.prevSlideElement);
        container.appendChild(this.nextSlideElement);

        this.container = container;

        // Next buttons could be optional
        // const previousBtn = document.createElement('a');
        // previousBtn.classList.add('sliderPrevBtn');
        // previousBtn.href = '#';
        // previousBtn.innerHTML = '<i class="arrow left"></i>';
        // container.appendChild(previousBtn);

        // const nextBtn = document.createElement('a');
        // nextBtn.classList.add('sliderNextBtn');
        // nextBtn.href = '#';
        // nextBtn.innerHTML = '<i class="arrow right"></i>';
        // container.appendChild(nextBtn);


        // Add dot links

        const dotsContainer = document.createElement('div');
        dotsContainer.classList.add('uncouthSlider__dotsContainer');


        for (let i = 0; i < this.getAllSlides().slideModels.length; i++) {
    
            const dotLink = document.createElement('a');
            
            if (i == 0) {
                dotLink.innerHTML = '<span class="dot active"></span>';
            } else {
                dotLink.innerHTML = '<span class="dot"></span>';
            }
            
            
            dotLink.href = '#';


            dotLink.addEventListener('click', (e) => {
                e.preventDefault();
                // Someone hit a dot to the right of the current one.
                if (i > this.currentSlideIndex) {
                    this.shiftLeft((i - this.currentSlideIndex));
                } else if (i < this.currentSlideIndex) {
                    this.shiftRight((this.currentSlideIndex - i));
                }
            });
            
            
            
            
            dotsContainer.appendChild(dotLink);
        }
        


        container.appendChild(dotsContainer);




        var self = this;
        // nextBtn.addEventListener('click', async function(evt) {
        //     if (!self.isAnimating) {
        //         self.isAnimating = true;
        //         self.shiftLeft(1);
        //     }
        // });

        // previousBtn.addEventListener('click', function(evt) {
        //     if (!self.isAnimating) {
        //         self.isAnimating = true;
        //         self.shiftRight(1);
        //     }
        // });

        

        // On window resize, all slides should resize to match the screen width
        window.addEventListener('resize', function(evt) {
            self.fixLayout();
        });

        this.fixLayout();


        // Fire every five seconds

        window.setInterval(function() {
            if (self.shouldAutoScroll) {
                self.shiftLeft();
            }
        }, 5000);

        container.addEventListener('mouseenter', function() {
            self.shouldAutoScroll = false;
        });

        container.addEventListener('mouseleave', function() {
            self.shouldAutoScroll = true;
        });
        
    }

    // So we have a shift count
    shiftLeft(shiftCount) {
        if (this.shiftsLeft == null) {
            this.shiftsLeft = shiftCount;
        }

        const duration = 500;
        let currentTime = +new Date();

        if (this.end === null) {
            this.end = +new Date() + duration;
        }

        const containerWidth = this.canvas.offsetWidth;
        let left = this.currentSlideElement.offsetLeft;

        // We are going left, so check to see if the current left is 
        if (left > -containerWidth && currentTime <= this.end) {
            let whatsLeft = this.end - currentTime;
            
            let percentOfDurationPassed = (100 - (whatsLeft / duration) * 100);
            let slidePosition = containerWidth / 100 * percentOfDurationPassed;
            this.i = -slidePosition;
            this.currentSlideElement.style.left = this.i + 'px';
            this.getNextSlideElement().style.left = (containerWidth + this.i) + 'px';
        } else {
            // This code runs when everything in the above has finished. The entirety of the drawing happens above!
            // So how can we make it deal with multiple shifts?
            this.i = 0;
            this.end = null;

            if (this.currentSlideElement.offsetLeft !== -containerWidth || this.getNextSlideElement().offsetLeft !== 0) {
                this.currentSlideElement.style.left = -containerWidth + 'px';
                this.getNextSlideElement().style.left = '0px';
            }

            cancelAnimationFrame(this.globalId);
            
            if (this.currentSlideIndex !== this.slideElements.length - 1) {
                this.currentSlideIndex++;
            } else {
                this.currentSlideIndex = 0;
            }
            this.currentSlideElement = this.slideElements[this.currentSlideIndex];

            // Get the previous slide and move it to the left off screen and get the next one and move that to the right off-screen.
            this.getPrevSlideElement().style.left = -(this.canvas.width) + 'px';
            this.isAnimating = false;
            this.fixLayout();
            
            const dotsArray = document.querySelectorAll('.dot');
            dotsArray.forEach(function(dot, index) {
                if (index == this.currentSlideIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            }, this);
            

            // What is the answer?
            this.shiftsLeft--;
            if (this.shiftsLeft > 0) {
                this.shiftLeft();
            } else {
                this.shiftsLeft = null;
            }
            return;
        }
        
        var self = this;


        this.globalId = requestAnimationFrame(function() {
            self.shiftLeft();
        });
    }

    shiftRight(shiftCount = null) {
        if (this.shiftsRight == null) {
            this.shiftsRight = shiftCount;
        }

        this.isAnimating = true;
        const duration = 500;
        let currentTime = +new Date();

        if (this.end === null) {
            this.end = +new Date() + duration;
        }

        const containerWidth = this.canvas.offsetWidth;
        let left = this.currentSlideElement.offsetLeft;

        if (left <= containerWidth && currentTime <= this.end) {
            let whatsLeft = this.end - currentTime;
            
            let percentOfDurationPassed = (100 - (whatsLeft / duration) * 100);

            // Now find that % of the full width
            let slidePosition = containerWidth / 100 * percentOfDurationPassed;
            this.i = slidePosition;
            this.currentSlideElement.style.left = this.i + 'px';
            this.getPrevSlideElement().style.left = -(this.getPrevSlideElement().offsetWidth) + this.i + 'px';
        } else {
            this.i = 0;
            this.end = null;

            if (this.currentSlideElement.offsetLeft !== containerWidth || this.getPrevSlideElement().offsetLeft !== 0) {
                this.currentSlideElement.style.left = containerWidth + 'px';
                this.getPrevSlideElement().style.left = '0px';
            }

            cancelAnimationFrame(this.globalId);
            
            if (this.currentSlideIndex !== 0) {
                this.currentSlideIndex--;
            } else {
                this.currentSlideIndex = this.slideElements.length - 1;
            }
            this.currentSlideElement = this.slideElements[this.currentSlideIndex];

            // Get the previous slide and move it to the left off screen and get the next one and move that to the right off-screen.
            this.getPrevSlideElement().style.left = -(this.canvas.width) + 'px';
            this.isAnimating = false;
            this.fixLayout();

            const dotsArray = document.querySelectorAll('.dot');

            dotsArray.forEach(function(dot, index) {
                if (index == this.currentSlideIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            }, this);
            
            this.shiftsRight--;

            if (this.shiftsRight > 0) {
                this.shiftRight(1);
            } else {
                this.shiftsRight = null;
            }
            
            return;
            
        }

        var self = this;

        this.globalId = requestAnimationFrame(function() {
            self.shiftRight();
        });
    
    
    }
}

// Controller
class Slide {


    constructor(profileName, profilePosition, quotation, imageName) {
        this.model = new SlideModel(profileName, profilePosition, quotation, imageName);
        this.view = new SlideView(this.model);
    }

    render() {
        this.view.render();
    }
}

class SlideView {
    constructor(model) {
        this.slideElement = document.createElement('div');
        this.slideElement.classList.add('slide');
        this.slideElement.style.position = 'absolute';
        this.slideElement.style.top = '0';
        // this.slideElement.style.height = '100%';

        // Create the image
        const sliderImage = document.createElement('img');
        sliderImage.src = 'img/' + model.imageName;
        sliderImage.classList.add('sliderImage');

        
        const sliderQuote = document.createElement('p');
        sliderQuote.innerHTML = model.quotation;
        sliderQuote.classList.add('sliderQuote');
        
        
        const sliderProfileContainer = document.createElement('div');
        // sliderProfileContainer.style.height = '100px';
        // sliderProfileContainer.style.width = '600px';

        sliderProfileContainer.classList.add('sliderProfileContainer');

        const sliderProfileImage = document.createElement('img');
        sliderProfileImage.src = 'img/' + model.imageName;
        sliderProfileImage.style.width = '70px';
        sliderProfileImage.style.height = '70px';
        sliderProfileImage.classList.add('sliderProfileImage');

        const sliderProfileName = document.createElement('h3');
        sliderProfileName.innerHTML = model.profileName;
        sliderProfileName.classList.add('profileName');
        
        const sliderProfileTitle = document.createElement('h4');
        sliderProfileTitle.innerHTML = model.profilePosition;
        sliderProfileTitle.classList.add('profileTitle');


        sliderProfileContainer.appendChild(sliderProfileImage);

        const sliderProfileCredentials = document.createElement('div');
        sliderProfileCredentials.classList.add('profileCredentials');
        sliderProfileCredentials.appendChild(sliderProfileName);
        sliderProfileCredentials.appendChild(sliderProfileTitle);
        
        sliderProfileContainer.appendChild(sliderProfileCredentials);

        // Create the title
        const sliderTitle = document.createElement('h2');
        sliderTitle.innerHTML = model.title;
        sliderTitle.classList.add('sliderTitle');

        const sliderText = document.createElement('p');
        sliderText.innerHTML = model.text;
        sliderText.classList.add('sliderText');
        
        const sliderCenterPiece = document.createElement('div');
        sliderCenterPiece.classList.add('sliderCenterPiece');
        
        sliderCenterPiece.appendChild(sliderQuote);
        sliderCenterPiece.appendChild(sliderProfileContainer);
        
        this.slideElement.appendChild(sliderCenterPiece);
    }

    getSlideElement() {
        return this.slideElement;
    }
}

class SlideModel {
    // profileName, profilePosition, quotation, imageName
    constructor(profileName, profilePosition, quotation, imageName) {
        this.profileName = profileName;
        this.profilePosition = profilePosition;
        this.quotation = quotation;
        
        // this.title = title;
        // this.text = text;
        this.imageName = imageName;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // profileName, profilePosition, quotation, imageName
    
    var slideOne = new Slide('Will Carr', 'Digital Project Manager, Conceptai', 'Ash is a fantastic developer and incredibly talented. He is a highly motivated individual often going above and beyond to complete projects. He has been a great asset to the team and it was hard to see him go!', 'will.jpg');
    var slideTwo = new Slide('Will Carr', 'Digital Project Manager, Conceptai', 'Ash is a fantastic developer and incredibly talented. He is a highly motivated individual often going above and beyond to complete projects. He has been a great asset to the team and it was hard to see him go!', 'will.jpg');
    var slideThree = new Slide('Will Carr', 'Digital Project Manager, Conceptai', 'Ash is a fantastic developer and incredibly talented. He is a highly motivated individual often going above and beyond to complete projects. He has been a great asset to the team and it was hard to see him go!', 'will.jpg');
    
    
    var container = document.querySelector('.sliderContainer');

    var slider = new Slider(container, [slideOne, slideTwo, slideThree]);
    slider.render();
});
