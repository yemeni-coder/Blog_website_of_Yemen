



// JavaScript to handle active class on click
				const currentLocation = window.location.pathname.split("/").pop();
				console.log(currentLocation); // Debug line
				document.querySelectorAll('#navbar ul li a').forEach(link => {
					// Check if the link matches the current page
					if (link.getAttribute('href') === currentLocation) {
						link.classList.add('active'); // Add active class if it matches
					}
					link.addEventListener('click', function() {
						document.querySelectorAll('#navbar ul li a').forEach(item => item.classList.remove('active'));
						this.classList.add('active'); // Add active class to clicked link
					});
				});



function openPopup(title, imgSrc, description) {
    document.getElementById('popup-title').innerText = title;
    document.getElementById('popup-image').src = imgSrc;
    document.getElementById('popup-description').innerText = description;
    document.getElementById('popup').style.display = 'block';
}

function closePopup() {
    document.getElementById('popup').style.display = 'none';
}

// Close the popup when the user clicks anywhere outside of the popup
window.onclick = function(event) {
    const popup = document.getElementById('popup');
    if (event.target === popup) {
        closePopup();
    }
}



function showPopup(imageSrc, title, description) {
    document.getElementById('popup-image').src = imageSrc;
    document.getElementById('popup-title').innerText = title;
    document.getElementById('popup-description').innerText = description;
    document.getElementById('popup').style.display = 'block';
}

function closePopup() {
    document.getElementById('popup').style.display = 'none';
}








// contact us form and button ----------------------------------------------------------

const contactLink = document.getElementById("contact-link");
const contactForm = document.getElementById("contact-form");
const successMessage = document.getElementById("success-message");
const contactFormContent = document.getElementById("contact-form-content");

contactLink.addEventListener("click", function(event) {
  event.preventDefault();
  contactForm.style.display = "block";
});

contactFormContent.addEventListener("submit", function(event) {
  event.preventDefault();

  // Simulate form submission and display success message
  successMessage.style.display = "block";
  contactFormContent.style.display = "none";

   // Hide the success message after 3 seconds
   setTimeout(() => {
    successMessage.style.display = "none";
  }, 3000);
});


  
   
















  
// for smal screen navbar

function openNav() {
    document.getElementById("navbar").classList.add("open");
  }
  
  function closeNav() {
    document.getElementById("navbar").classList.remove("open");
  }







    // Keep track of each carousel's current index
    const carouselIndices = {};

    function showImage(carouselId, index) {
        const images = document.querySelectorAll(`#${carouselId} .carousel-image`);
        images.forEach((img, i) => img.classList.toggle('active', i === index));
    }

    function prevImage(carouselId) {
        // Initialize index if not yet set
        if (!carouselIndices[carouselId]) carouselIndices[carouselId] = 0;
        
        const images = document.querySelectorAll(`#${carouselId} .carousel-image`);
        carouselIndices[carouselId] = (carouselIndices[carouselId] - 1 + images.length) % images.length;
        showImage(carouselId, carouselIndices[carouselId]);
    }

    function nextImage(carouselId) {
        // Initialize index if not yet set
        if (!carouselIndices[carouselId]) carouselIndices[carouselId] = 0;
        
        const images = document.querySelectorAll(`#${carouselId} .carousel-image`);
        carouselIndices[carouselId] = (carouselIndices[carouselId] + 1) % images.length;
        showImage(carouselId, carouselIndices[carouselId]);
    }

    document.addEventListener('DOMContentLoaded', () => {
        // Initialize each carousel to show the first image
        document.querySelectorAll('.image-carousel').forEach(carousel => {
            const carouselId = carousel.id;
            carouselIndices[carouselId] = 0; // Set initial index
            showImage(carouselId, carouselIndices[carouselId]);
        });
    });



  


    


// Get DOM elements
const searchOverlay = document.getElementById('searchOverlay');
const searchInput = document.getElementById('searchInput');
const searchCount = document.getElementById('searchCount');
const prevMatch = document.getElementById('prevMatch');
const nextMatch = document.getElementById('nextMatch');
const closeSearch = document.getElementById('closeSearch');
const searchButton = document.querySelector('.search-btn');

let matches = [];
let currentMatchIndex = -1;

// Open search with button click or Ctrl+F
searchButton.addEventListener('click', openSearch);
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        openSearch();
    }
    if (e.key === 'Escape') {
        closeSearchOverlay();
    }
});

function openSearch() {
    searchOverlay.classList.remove('hidden');
    searchInput.focus();
    if (searchInput.value) {
        performSearch();
    }
}

function closeSearchOverlay() {
    searchOverlay.classList.add('hidden');
    clearHighlights();
}

// Perform search
searchInput.addEventListener('input', performSearch);

function getTextNodes(node) {
    const textNodes = [];
    const walk = document.createTreeWalker(
        node,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: function(node) {
                // Skip script and style elements
                const parent = node.parentElement;
                if (!parent || 
                    parent.closest('#searchOverlay') || 
                    parent.tagName === 'SCRIPT' || 
                    parent.tagName === 'STYLE') {
                    return NodeFilter.FILTER_REJECT;
                }
                return NodeFilter.FILTER_ACCEPT;
            }
        }
    );

    let currentNode;
    while (currentNode = walk.nextNode()) {
        textNodes.push(currentNode);
    }
    return textNodes;
}

function performSearch() {
    clearHighlights();
    const searchTerm = searchInput.value.trim();
    
    if (!searchTerm) {
        updateMatchCount(0);
        return;
    }

    matches = [];
    const textNodes = getTextNodes(document.body);
    
    textNodes.forEach(node => {
        const text = node.textContent;
        let startIndex = 0;
        let index;

        // Find all occurrences of searchTerm in the text
        while ((index = text.toLowerCase().indexOf(searchTerm.toLowerCase(), startIndex)) > -1) {
            matches.push({
                node: node,
                startIndex: index,
                endIndex: index + searchTerm.length
            });
            startIndex = index + 1;
        }
    });

    if (matches.length > 0) {
        highlightMatches();
        currentMatchIndex = 0;
        updateMatchCount(matches.length);
        scrollToMatch(currentMatchIndex);
    } else {
        updateMatchCount(0);
    }
}

function highlightMatches() {
    // Sort matches by their position in the document
    matches.sort((a, b) => {
        if (a.node === b.node) {
            return a.startIndex - b.startIndex;
        }
        return Array.from(document.body.getElementsByTagName('*'))
            .indexOf(a.node.parentElement) - 
            Array.from(document.body.getElementsByTagName('*'))
            .indexOf(b.node.parentElement);
    });

    let lastNode = null;
    let lastIndex = 0;
    let fragments = [];

    matches.forEach((match, matchIndex) => {
        if (match.node !== lastNode) {
            if (lastNode) {
                // Handle any remaining text in the last node
                const remainingText = lastNode.textContent.slice(lastIndex);
                if (remainingText) {
                    fragments.push(document.createTextNode(remainingText));
                }
                // Replace the content of the last node
                const span = document.createElement('span');
                fragments.forEach(f => span.appendChild(f));
                lastNode.parentNode.replaceChild(span, lastNode);
                
                // Reset fragments for the new node
                fragments = [];
            }
            lastNode = match.node;
            lastIndex = 0;
        }

        // Add text before the match
        if (match.startIndex > lastIndex) {
            fragments.push(document.createTextNode(
                match.node.textContent.slice(lastIndex, match.startIndex)
            ));
        }

        // Add the highlighted match
        const highlight = document.createElement('span');
        highlight.className = 'search-highlight' + 
            (matchIndex === currentMatchIndex ? ' current' : '');
        highlight.textContent = match.node.textContent.slice(
            match.startIndex, 
            match.endIndex
        );
        fragments.push(highlight);

        lastIndex = match.endIndex;
    });

    // Handle the last node
    if (lastNode) {
        const remainingText = lastNode.textContent.slice(lastIndex);
        if (remainingText) {
            fragments.push(document.createTextNode(remainingText));
        }
        const span = document.createElement('span');
        fragments.forEach(f => span.appendChild(f));
        lastNode.parentNode.replaceChild(span, lastNode);
    }
}

function clearHighlights() {
    document.querySelectorAll('.search-highlight').forEach(highlight => {
        const parent = highlight.parentNode;
        if (parent) {
            while (highlight.firstChild) {
                parent.insertBefore(highlight.firstChild, highlight);
            }
            parent.removeChild(highlight);
            // Normalize the parent to merge adjacent text nodes
            parent.normalize();
        }
    });
}

function updateMatchCount(total) {
    if (total === 0) {
        searchCount.textContent = 'No results';
        prevMatch.disabled = true;
        nextMatch.disabled = true;
    } else {
        searchCount.textContent = `${currentMatchIndex + 1} of ${total}`;
        prevMatch.disabled = currentMatchIndex === 0;
        nextMatch.disabled = currentMatchIndex === total - 1;
    }
}

function scrollToMatch(index) {
    const highlights = document.querySelectorAll('.search-highlight');
    highlights.forEach(h => h.classList.remove('current'));
    
    if (highlights[index]) {
        highlights[index].classList.add('current');
        highlights[index].scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }
}

// Navigation between matches
prevMatch.addEventListener('click', () => {
    if (currentMatchIndex > 0) {
        currentMatchIndex--;
        updateMatchCount(matches.length);
        scrollToMatch(currentMatchIndex);
    }
});

nextMatch.addEventListener('click', () => {
    if (currentMatchIndex < matches.length - 1) {
        currentMatchIndex++;
        updateMatchCount(matches.length);
        scrollToMatch(currentMatchIndex);
    }
});

// Close search
closeSearch.addEventListener('click', closeSearchOverlay);
