document.addEventListener('DOMContentLoaded', function() {
    console.log("[CAROUSEL SCRIPT] DOMContentLoaded event fired.");

    const carouselContainer = document.querySelector('.clients-section .carousel-container');
    const track = document.querySelector('.clients-section .carousel-track');

    // Step 1: Verify element selection
    if (!carouselContainer) {
        console.error("[CAROUSEL SCRIPT] ERROR: '.clients-section .carousel-container' not found!");
        return; 
    } else {
        console.log("[CAROUSEL SCRIPT] Found '.clients-section .carousel-container':", carouselContainer);
    }

    if (!track) {
        console.error("[CAROUSEL SCRIPT] ERROR: '.clients-section .carousel-track' not found!");
        return; 
    } else {
        console.log("[CAROUSEL SCRIPT] Found '.clients-section .carousel-track':", track);
    }

    // Get all original items
    const originalItems = Array.from(track.children);
    console.log(`[CAROUSEL SCRIPT] Found ${originalItems.length} original items in track.`);

    if (originalItems.length === 0) {
        console.warn("[CAROUSEL SCRIPT] WARNING: No items found in the carousel track. Carousel will not run.");
        return; 
    }

    // Calculate how many items to show based on screen width
    function calculateItemsToShow() {
        const containerWidth = carouselContainer.offsetWidth;
        if (containerWidth < 576) {
            return 1; // Mobile: show 1
        } else if (containerWidth < 992) {
            return 2; // Tablet: show 2
        } else if (containerWidth < 1200) {
            return 3; // Small desktop: show 3
        } else {
            return 4; // Large desktop: show 4
        }
    }

    let itemsToShow = calculateItemsToShow();
    console.log(`[CAROUSEL SCRIPT] Showing ${itemsToShow} items based on screen width.`);

    // Clear the track and add appropriate number of items
    function setupCarousel() {
        // Clear the track
        while (track.firstChild) {
            track.removeChild(track.firstChild);
        }
        
        // Add items based on calculated number
        for (let i = 0; i < originalItems.length; i++) {
            track.appendChild(originalItems[i].cloneNode(true));
        }
        
        // Add clones for infinite scrolling
        for (let i = 0; i < Math.min(itemsToShow, originalItems.length); i++) {
            const clone = originalItems[i].cloneNode(true);
            track.appendChild(clone);
        }
        
        console.log(`[CAROUSEL SCRIPT] Carousel setup complete. Total items in track: ${track.children.length}.`);
    }

    setupCarousel();

    // Calculate total width of the visible set of items
    function calculateTotalWidth() {
        let totalWidth = 0;
        const visibleItems = Math.min(itemsToShow, originalItems.length);
        
        for (let i = 0; i < visibleItems; i++) {
            const item = track.children[i];
            const style = window.getComputedStyle(item);
            const marginLeft = parseFloat(style.marginLeft) || 0;
            const marginRight = parseFloat(style.marginRight) || 0;
            totalWidth += item.offsetWidth + marginLeft + marginRight;
        }
        
        return totalWidth;
    }

    let totalWidthOfVisibleSet = calculateTotalWidth();
    console.log(`[CAROUSEL SCRIPT] Total width of visible items: ${totalWidthOfVisibleSet}px.`);

    let currentPosition = 0;
    const scrollSpeed = 1;
    const intervalTime = 30;

    function autoScroll() {
        currentPosition -= scrollSpeed;
        track.style.transform = `translateX(${currentPosition}px)`;

        // When we've scrolled the width of one item, reset to beginning
        const firstItem = track.children[0];
        const style = window.getComputedStyle(firstItem);
        const marginLeft = parseFloat(style.marginLeft) || 0;
        const marginRight = parseFloat(style.marginRight) || 0;
        const itemWidth = firstItem.offsetWidth + marginLeft + marginRight;

        if (Math.abs(currentPosition) >= itemWidth) {
            // Move first item to end
            track.appendChild(track.children[0]);
            // Reset position
            currentPosition += itemWidth;
            track.style.transform = `translateX(${currentPosition}px)`;
        }
    }

    let scrollInterval = null;

    function startScrolling() {
        if (scrollInterval !== null) {
            clearInterval(scrollInterval);
        }
        scrollInterval = setInterval(autoScroll, intervalTime);
        console.log("[CAROUSEL SCRIPT] Scroll animation started.");
    }

    function stopScrolling() {
        if (scrollInterval !== null) {
            clearInterval(scrollInterval);
            scrollInterval = null;
            console.log("[CAROUSEL SCRIPT] Scroll animation paused.");
        }
    }

    // Pause on hover
    carouselContainer.addEventListener('mouseenter', stopScrolling);
    carouselContainer.addEventListener('mouseleave', startScrolling);

    // Handle window resize
    window.addEventListener('resize', function() {
        const newItemsToShow = calculateItemsToShow();
        if (newItemsToShow !== itemsToShow) {
            itemsToShow = newItemsToShow;
            setupCarousel();
            totalWidthOfVisibleSet = calculateTotalWidth();
            console.log(`[CAROUSEL SCRIPT] Resized: now showing ${itemsToShow} items. Total width: ${totalWidthOfVisibleSet}px.`);
        }
    });

    // Start the carousel
    startScrolling();
});