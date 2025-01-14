const contentContainer = document.querySelector('.content-container');
let scrollAmount = 0;

function autoScroll() {
  if (scrollAmount <= contentContainer.scrollWidth - contentContainer.clientWidth) {
    contentContainer.scrollBy(2, 0); 
    scrollAmount += 2;
  } else {
    contentContainer.scrollTo(0, 0); 
    scrollAmount = 0;
  }
}

setInterval(autoScroll, 2000); 
