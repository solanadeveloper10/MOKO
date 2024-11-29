function isMobileDevice() {
    return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
document.addEventListener('DOMContentLoaded', function() {

    const toggleButtons = document.querySelectorAll('.toggle-btn');
    const offCanvas = document.getElementById('off-canvas');

    // Function to open the off-canvas menu
    const openOffCanvas = () => {
        offCanvas.classList.add('active');
        toggleButtons.forEach(btn => btn.classList.add('active'));
        document.body.classList.add('no-scroll');
    };

    // Function to close the off-canvas menu
    const closeOffCanvas = () => {
        offCanvas.classList.remove('active');
        toggleButtons.forEach(btn => btn.classList.remove('active'));
        document.body.classList.remove('no-scroll');
    };

    // Toggle off-canvas on button click
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (offCanvas.classList.contains('active')) {
                closeOffCanvas();
            } else {
                openOffCanvas();
            }
        });
    });


    const copyCaButtons = document.querySelectorAll(".copyCA");

    // Iterate over each button and attach a click event listener
    copyCaButtons.forEach(button => {
        button.addEventListener("click", function() {
            // Retrieve the text to copy from the 'data-ca' attribute
            const CA = "UEPp8H46WkPiBmi7nw35nyfFDNpxp9LWRPxSMHXpump"
            
            // Use the Clipboard API to copy the text
            navigator.clipboard.writeText(CA).then(() => {
                // Store the original button text to revert back later
                const originalText = button.querySelector(".copyCaInner").innerText;
                
                // Change the button text to indicate success
                button.querySelector(".copyCaInner").innerText = "Copied!";
                
                // Revert the button text back after 2 seconds (2000 milliseconds)
                setTimeout(() => {
                    button.querySelector(".copyCaInner").innerText = originalText;
                }, 2000);
            }).catch(error => {
                // Log any errors that occur during the copy process
                console.error("Failed to copy text: ", error);
                
                // Optionally, provide user feedback on failure
                button.querySelector(".copyCaInner").innerText = "Failed to copy!";
                setTimeout(() => {
                    button.querySelector(".copyCaInner").innerText = "Copy CA";
                }, 2000);
            });
        });
    });

 
    // Parallax Effect for Header Elements
    // Select all header elements that should have the parallax effect
    const headerElements = document.querySelectorAll('.header-position');

    // Get the container dimensions
    const container = document.querySelector('#header-container');
    let centerX = container.clientWidth / 2;
    let centerY = container.clientHeight / 2;

    // Pointer position
    let pointerX = centerX;
    let pointerY = centerY;

    // Flag to prevent multiple requestAnimationFrame calls
    let parallaxTicking = false;

    // Update center positions on window resize
    window.addEventListener('resize', () => {
        centerX = container.clientWidth / 2;
        centerY = container.clientHeight / 2;
    });

    // Handle pointer movements (mouse and touch)
    function handlePointerMove(x, y) {
        const rect = container.getBoundingClientRect();
        pointerX = x - rect.left;
        pointerY = y - rect.top;

        // Clamp the pointer within the container boundaries
        pointerX = Math.max(0, Math.min(pointerX, container.clientWidth));
        pointerY = Math.max(0, Math.min(pointerY, container.clientHeight));

        if (!parallaxTicking) {
            requestAnimationFrame(applyParallaxEffect);
            parallaxTicking = true;
        }
    }

    // Mouse event listener
    document.addEventListener('mousemove', (event) => {
        handlePointerMove(event.clientX, event.clientY);
    });

    // Touch event listeners
    document.addEventListener('touchstart', (event) => {
        if (event.touches.length === 1) { // Single touch
            handlePointerMove(event.touches[0].clientX, event.touches[0].clientY);
        }
    });

    document.addEventListener('touchmove', (event) => {
        if (event.touches.length === 1) { // Single touch
            handlePointerMove(event.touches[0].clientX, event.touches[0].clientY);
        }
    });

    // Prevent default scrolling behavior when interacting with the container
    container.addEventListener('touchmove', (event) => {
        event.preventDefault();
    });

    // Function to apply the parallax effect
    function applyParallaxEffect() {
        headerElements.forEach((el, index) => {
            const depth = (index + 1) / headerElements.length; // Vary depth for each layer
            const moveX = (pointerX - centerX) * depth * 0.05; // Adjust multiplier for intensity
            const moveY = (pointerY - centerY) * depth * 0.05;
            el.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) scale(1.05)`; // Use translate3d for better performance
        });

        parallaxTicking = false;
    }

    // Mask Functionality
    // Existing mask and container elements
    const maskElement = document.querySelector('.mask');
    const containerMask = document.getElementById('dulotopia');

    // Initialize mask size based on device width
    let maskSize = window.innerWidth <= 768 ? 80 : 150;

    // Set initial mask position to center of the container
    let maskPointerX = containerMask.clientWidth / 2;
    let maskPointerY = containerMask.clientHeight / 2;

    // Function to create a sharp, inverted mask
    function createInvertedSharpMask(x, y, size) {
        // Slightly offset the second color stop for a sharp edge
        return `radial-gradient(circle ${size}px at ${x}px ${y}px, rgba(0,0,0,0) ${size}px, rgba(0,0,0,1) ${size + 1}px)`;
    }

    // Apply the initial mask
    applyMask(maskPointerX, maskPointerY, maskSize);

    // Update mask on window resize
    window.addEventListener('resize', () => {
        maskSize = window.innerWidth <= 768 ? 80 : 150;
        // Reconstruct the inverted and sharp mask with the new size
        applyMask(maskPointerX, maskPointerY, maskSize);
    });

    // Handle pointer movements (mouse and touch) for the mask
    function handleMaskPointerMove(x, y) {
        const rect = containerMask.getBoundingClientRect();
        maskPointerX = x - rect.left;
        maskPointerY = y - rect.top;

        // Clamp the pointer within the container boundaries
        maskPointerX = Math.max(0, Math.min(maskPointerX, containerMask.clientWidth));
        maskPointerY = Math.max(0, Math.min(maskPointerY, containerMask.clientHeight));

        applyMask(maskPointerX, maskPointerY, maskSize);
    }

    // Mouse event listener for mask
    document.addEventListener('mousemove', (event) => {
        handleMaskPointerMove(event.clientX, event.clientY);
    });

    // Touch event listeners for mask
    document.addEventListener('touchstart', (event) => {
        if (event.touches.length === 1) { // Single touch
            handleMaskPointerMove(event.touches[0].clientX, event.touches[0].clientY);
        }
    });

    document.addEventListener('touchmove', (event) => {
        if (event.touches.length === 1) { // Single touch
            handleMaskPointerMove(event.touches[0].clientX, event.touches[0].clientY);
        }
    });

    // Prevent default scrolling behavior when interacting with the mask
    containerMask.addEventListener('touchmove', (event) => {
        event.preventDefault();
    });

    // Function to apply the mask
    function applyMask(x, y, size) {
        const maskValue = createInvertedSharpMask(x, y, size);
        maskElement.style.maskImage = maskValue;
        maskElement.style.webkitMaskImage = maskValue;
    }

    // Select the navbar
    const navbar = document.getElementById('navbar');

    // Function to toggle sticky class
    function handleScroll() {
        if (window.pageYOffset >= 100) { // Adjust the threshold as needed
            navbar.classList.add('sticky');
        } else {
            navbar.classList.remove('sticky');
        }
    }

    // Listen to scroll events with throttling to improve performance
    let isThrottled = false;
    window.addEventListener('scroll', () => {
        if (!isThrottled) {
            window.requestAnimationFrame(() => {
                handleScroll();
                isThrottled = false;
            });
            isThrottled = true;
        }
    }, { passive: true });

    // Select all text elements to animate
    const textElements = document.querySelectorAll('h1, h2, h3, p, a, button, small, span');

    // Define observer options
    const options = {
        threshold: 0.2 // Trigger when 20% of the element is visible
    };

    // Create the Intersection Observer
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if(entry.isIntersecting){
                entry.target.classList.add('animate-text');
                observer.unobserve(entry.target); // Stop observing after animation
            }
        });
    }, options);

    // Observe each text element
    textElements.forEach(el => {
        observer.observe(el);
    });

    const tabs = document.querySelectorAll('.tabs');

    tabs.forEach(tab => {
        tab.addEventListener('mouseenter', () => {
            tab.classList.add('active');
            const background = tab.querySelector('.tab-img-background');
            const glow = tab.querySelector('.img-glow');
            const img = tab.querySelector('.tab-img-container img');
            if(background) background.classList.add('active');
            if(glow) glow.classList.add('active');
            if(img) img.classList.add('active');
        });

        tab.addEventListener('mouseleave', () => {
            tab.classList.remove('active');
            const background = tab.querySelector('.tab-img-background');
            const glow = tab.querySelector('.img-glow');
            const img = tab.querySelector('.tab-img-container img');
            if(background) background.classList.remove('active');
            if(glow) glow.classList.remove('active');
            if(img) img.classList.remove('active');
        });
    });


    // Function to set the top position of .portal-bottom based on .portal-top's height
    function adjustPortalBottomPosition() {
        const portalTop = document.querySelector('.portal-top');
        const portalBottom = document.querySelector('.portal-bottom');

        if (portalTop && portalBottom) {
            const portalTopHeight = portalTop.offsetHeight;
            portalBottom.style.transform = `translateY(${portalTopHeight}px)`;
        }
    }

    function startPortalAnimation() {
        const portalTop = document.querySelector('.portal-top');
        const portalBottom = document.querySelector('.portal-bottom');
    
        if (!portalTop || !portalBottom) return;
    
        let lastTimestamp = null;
        const ANIMATION_SPEED = 50; // Pixels per second
    
        // Initialize transform values
        let portalTopTranslateY = 0;
        const portalTopHeight = portalTop.offsetHeight;
    
        // Position portal-bottom just below portal-top
        let portalBottomTranslateY = portalTopHeight;
    
        // Apply initial transforms
        portalTop.style.transform = `translateY(${portalTopTranslateY}px)`;
        portalBottom.style.transform = `translateY(${portalBottomTranslateY}px)`;
    
        // Store initial positions for reset
        const initialPortalTopTranslateY = portalTopTranslateY;
        const initialPortalBottomTranslateY = portalBottomTranslateY;
    
        function animate(timestamp) {
            if (!lastTimestamp) lastTimestamp = timestamp;
            const deltaTime = (timestamp - lastTimestamp) / 1000; // Convert to seconds
            lastTimestamp = timestamp;
    
            const deltaY = ANIMATION_SPEED * deltaTime;
    
            // Move both portals upwards
            portalTopTranslateY -= deltaY;
            portalBottomTranslateY -= deltaY;
    
            // Apply transforms
            portalTop.style.transform = `translateY(${portalTopTranslateY}px)`;
            portalBottom.style.transform = `translateY(${portalBottomTranslateY}px)`;
    
            // Reset positions once a portal has moved completely out of view
            if (portalTopTranslateY <= -portalTopHeight) {
                // Move portalTop to just below portalBottom
                portalTopTranslateY = portalBottomTranslateY + portalTopHeight;
    
                // Update transforms
                portalTop.style.transform = `translateY(${portalTopTranslateY}px)`;
            }
    
            if (portalBottomTranslateY <= -portalTopHeight) {
                // Move portalBottom to just below portalTop
                portalBottomTranslateY = portalTopTranslateY + portalTopHeight;
    
                // Update transforms
                portalBottom.style.transform = `translateY(${portalBottomTranslateY}px)`;
            }
    
            // Continue the animation loop
            animationFrameId = requestAnimationFrame(animate);
        }
    
        // Start the animation loop
        var animationFrameId = requestAnimationFrame(animate);
    
        // Return animationFrameId and initial positions for reset
        return {
            animationFrameId,
            initialPortalTopTranslateY,
            initialPortalBottomTranslateY
        };
    }
    
    let portalAnimation;
    
    function resetPortalAnimation() {
        const portalTop = document.querySelector('.portal-top');
        const portalBottom = document.querySelector('.portal-bottom');
    
        if (!portalTop || !portalBottom) return;
    
        // Cancel any ongoing animation frame
        if (portalAnimation && portalAnimation.animationFrameId) {
            cancelAnimationFrame(portalAnimation.animationFrameId);
        }
    
        // Reset transform positions to initial state
        portalTop.style.transform = `translateY(0px)`;
        portalBottom.style.transform = `translateY(${portalTop.offsetHeight}px)`;
    
        // Restart the animation
        portalAnimation = startPortalAnimation();
    }
    function initPortalAnimation() {
        adjustPortalBottomPosition();
        portalAnimation = startPortalAnimation();
    
        if (!isMobileDevice()) { // Only add resize listener for non-mobile devices
            window.addEventListener('resize', handlePortalResize);
        }

            // Select all elements with class paraLeft and paraRight
    const paraLeftElements = document.querySelectorAll('.paraLeft');
    const paraRightElements = document.querySelectorAll('.paraRight');

    // Define the maximum translation in pixels
    const maxTranslate = 100; // Adjust this value for desired subtlety

    // Function to handle scroll and apply transformations
    const handleScroll = () => {
        const windowHeight = window.innerHeight;
    
        paraLeftElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const speed = parseFloat(element.getAttribute('data-speed')) || 1;
    
            if (rect.top <= windowHeight && rect.bottom >= 0) {
                const distanceFromTop = windowHeight - rect.top;
                const visibilityRatio = distanceFromTop / (windowHeight + rect.height);
                const clampedRatio = Math.min(Math.max(visibilityRatio, 0), 1);
                const translateX = clampedRatio * maxTranslate * speed;
    
                element.style.transform = `translateX(${translateX}px)`;
            } else {
                element.style.transform = `translateX(0px)`;
            }
        });
    
        paraRightElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const speed = parseFloat(element.getAttribute('data-speed')) || 1;
    
            if (rect.top <= windowHeight && rect.bottom >= 0) {
                const distanceFromTop = windowHeight - rect.top;
                const visibilityRatio = distanceFromTop / (windowHeight + rect.height);
                const clampedRatio = Math.min(Math.max(visibilityRatio, 0), 1);
                const translateX = clampedRatio * maxTranslate * speed;
    
                element.style.transform = `translateX(-${translateX}px)`;
            } else {
                element.style.transform = `translateX(0px)`;
            }
        });
    };

    // Optimize scroll handling with requestAnimationFrame
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Initial call to set positions based on initial scroll
    handleScroll();
    }
    function handlePortalResize() {
        adjustPortalBottomPosition();
        resetPortalAnimation();
    }
        // Flag to track if takeDulo has been clicked
        let takeDuloClicked = false;

        // Select the takeDulo tab
        let takeDuloTab = null;

    
        // Function to nudge the DULO tab
        function nudgeTakeDuloTab() {
            if (takeDuloTab) {
                takeDuloTab.classList.add('nudge');
                
                // Remove the 'nudge' class after the animation ends to allow re-triggering
                takeDuloTab.addEventListener('animationend', function handleAnimationEnd() {
                    takeDuloTab.classList.remove('nudge');
                    takeDuloTab.removeEventListener('animationend', handleAnimationEnd);
                });
            }
        }

    // Handle the 'takeDulo' button click
    const takeDuloButton = document.getElementById("takeDulo");
    if (takeDuloButton) {
        // Assuming the 'tabs' class is on the parent div
        takeDuloTab = takeDuloButton.closest('.tabs');
    }
    if (takeDuloButton) {
        takeDuloButton.addEventListener("click", function () {
            // Existing functionality: Scroll to the bottom and initiate animations
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: "smooth"
            });

            // Observe when we reach the bottom of the page
            const observer = new IntersectionObserver(
                (entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            // Add 'active' class to elements
                            document.querySelectorAll(".smoke, .glow, .swirl-div, .left-door, .right-door").forEach(function (element) {
                                element.classList.add("active");
                            });
                            document.getElementById("firstFooter").classList.add("d-none");
                            document.getElementById("movable-text").style.opacity = "0"
                            document.getElementById("takeDulo").classList.add("d-none");

                            // Remove 'd-none' class from #space-section
                            const spaceSection = document.getElementById("space-section");
                            if (spaceSection) {
                                spaceSection.classList.remove("d-none");
                            }

                            // Initialize portal animation after making space-section visible
                            initPortalAnimation();

                            // Set the flag indicating takeDulo has been clicked
                            takeDuloClicked = true;

                            // Hide the confessTabWarning if visible
                            const confessTabWarning = document.getElementById('confessTabWarning');
                            if (confessTabWarning) {
                                confessTabWarning.classList.add('d-none');
                            }

                            // Stop observing once the work is done
                            observer.disconnect();
                        }
                    });
                },
                { threshold: 1.0 } // Trigger when the element is fully visible
            );

            // Target an element at the bottom of the page, like a footer
            const footer = document.querySelector("#firstFooter");
            if (footer) {
                observer.observe(footer);
            } else {
                // Fallback: If no footer exists, observe the last child of the body
                const lastChild = document.body.lastElementChild;
                if (lastChild) observer.observe(lastChild);
            }
        });
    }

    // Handle the 'confessTabButton' click
    const confessTabButton = document.getElementById('confessTabButton');
    if (confessTabButton) {
        confessTabButton.addEventListener('click', function(e) {
            e.preventDefault();

            if (takeDuloClicked) {
                // Scroll to the #confessions section
                const confessionsSection = document.getElementById('confessions');
                if (confessionsSection) {
                    confessionsSection.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                // Show the confessTabWarning
                const confessTabWarning = document.getElementById('confessTabWarning');
                if (confessTabWarning) {
                    confessTabWarning.classList.remove('d-none');
                }
                nudgeTakeDuloTab();
            }
        });
    }

    const submitButton = document.getElementById('submitConfession');
    const confessionSucc = document.getElementById('confessionSucc');
    const confessionForm = document.querySelector('.confession-form');
    const confessFormWarning = document.getElementById('confessFormWarning'); // Added
    
    // Select the elements to which the 'error' class will be added
    const fessionsContainer = document.querySelector('.fessions');
    const fessionsTextarea = document.querySelector('.fessions textarea');
    
    if (submitButton) {
        submitButton.addEventListener('click', function(e) {
            e.preventDefault();
    
            const confession = document.getElementById('confessionInput').value.trim();
            let wallet = document.getElementById('walletAddyInput').value.trim();
    
            // Assume no error initially
            let hasError = false;
    
            if (wallet  === '') wallet = "Anonymous";
            if (confession === '') {
                // Show the confessFormWarning instead of alert
                if (confessFormWarning) {
                    confessFormWarning.classList.remove('d-none');
                }
    
                // Add 'error' class to the relevant elements
                if (fessionsContainer) {
                    fessionsContainer.classList.add('error');
                }
                if (fessionsTextarea) {
                    fessionsTextarea.classList.add('error');
                }
    
                hasError = true;
            } else {
                // Hide the confessFormWarning if visible
                if (confessFormWarning) {
                    confessFormWarning.classList.add('d-none');
                }
    
                // Remove 'error' class if previously added
                if (fessionsContainer) {
                    fessionsContainer.classList.remove('error');
                }
                if (fessionsTextarea) {
                    fessionsTextarea.classList.remove('error');
                }
            }
    
            if (hasError) {
                return;
            }
    
            // Prepare data to send
            const data = {
                confession: confession,
                wallet: wallet
            };
    
            // Create a new XMLHttpRequest
            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/confess', true);
            xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    
            xhr.onreadystatechange = function() {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        // Success: Show success message and hide the form
                        confessionSucc.classList.remove('d-none');
                        confessionForm.classList.add('d-none');
    
                        // Optionally, clear the input fields
                        document.getElementById('confessionInput').value = '';
                        document.getElementById('walletAddyInput').value = '';
    
                        // Remove 'error' class in case it was previously added
                        if (fessionsContainer) {
                            fessionsContainer.classList.remove('error');
                        }
                        if (fessionsTextarea) {
                            fessionsTextarea.classList.remove('error');
                        }
                    } else {
                        // Error handling: Parse and display error message
                        let response;
                        try {
                            response = JSON.parse(xhr.responseText);
                        } catch (e) {
                            response = { message: 'An error occurred. Please try again.' };
                        }
    
                        // Show the confessFormWarning with the error message
                        if (confessFormWarning) {
                            confessFormWarning.textContent = response.message || 'An error occurred. Please try again.';
                            confessFormWarning.classList.remove('d-none');
                        } else {
                            alert(response.message || 'An error occurred. Please try again.');
                        }
    
                        // Add 'error' class to the relevant elements
                        if (fessionsContainer) {
                            fessionsContainer.classList.add('error');
                        }
                        if (fessionsTextarea) {
                            fessionsTextarea.classList.add('error');
                        }
                    }
                }
            };
    
            xhr.send(JSON.stringify(data));
        });
    }

    // Select all buttons with the class 'walletLoginFunc'
    document.querySelectorAll('.walletLoginFunc').forEach(button => {
        // Add a click event listener to each button
        button.addEventListener('click', () => {
            // Select the div with id 'walletNotification'
            const notificationDiv = document.getElementById('walletNotification');
            
            // Remove the 'd-none' class
            notificationDiv.classList.remove('d-none');
            
            // Set a timeout to add the 'd-none' class back after 2 seconds
            setTimeout(() => {
                notificationDiv.classList.add('d-none');
            }, 2000); // 2000 milliseconds = 2 seconds
        });
    });

});