document.addEventListener("DOMContentLoaded", () => {
  // Select the target node where you expect the element to be added
  const targetNode = document.querySelector("body");

  // Create a new instance of MutationObserver with a callback function
  const observer = new MutationObserver((_, observer) => {
    // Check if the specific element has been added
    const secondSection = document.querySelector(
      "#guide-renderer #sections ytd-guide-section-renderer:nth-child(2)"
    );
    if (secondSection) {
      const isHomePage = !!document.querySelector(
        "#page-manager [page-subtype='home']"
      );
      if (!isHomePage) {
        secondSection.classList.add("show");
      }

      secondSection
        .querySelector(
          "ytd-guide-collapsible-entry-renderer[can-show-more] ytd-guide-entry-renderer #endpoint"
        )
        ?.click();
      // append the subscribeList before the #header.ytd-rich-grid-renderer
      const subscribeList = getSubscriptions(secondSection);
      const header = document.querySelector("#header.ytd-rich-grid-renderer");
      header?.insertAdjacentElement("beforebegin", subscribeList);
      // Disconnect the observer if needed
      observer.disconnect();
    }
  });

  // Configure and start the observer to watch for child additions to the target node
  const config = { childList: true };
  observer.observe(targetNode, config);
});

function getSubscriptions(section) {
  // Query Selector all of this
  // 1. #items > ytd-guide-entry-renderer
  // 2. "#items > ytd-guide-collapsible-entry-renderer #expandable-items ytd-guide-entry-renderer"
  const items = section.querySelectorAll(
    "#items > ytd-guide-entry-renderer, #items > ytd-guide-collapsible-entry-renderer #expandable-items ytd-guide-entry-renderer"
  );
  // create a new div element that has a classname called `subscribe-list`
  const subscribeList = document.createElement("div");
  subscribeList.className = "subscribe-list";
  items.forEach((item) => {
    // extract the image url from thumbnails url here
    //<yt-icon class="guide-icon style-scope ytd-guide-entry-renderer" disable-upgrade="{&quot;thumbnails&quot;:[{&quot;url&quot;:&quot;https://yt3.ggpht.com/4iJ6AIV6wX2VI0-BfhdyKo8WPtOOHDjzna5bAMz8lu5967RwftgpI68o0IFuOHrvqJW9XNzVRAs=s88-c-k-c0x00ffffff-no-rj&quot;}]}" hidden="">
    // </yt-icon>
    // img should contain that url inside the disable-upgrade attribute's thumbnails url
    const img = item.querySelector("yt-icon").getAttribute("disable-upgrade");
    if (img) {
      const title = item.querySelector("#endpoint").getAttribute("title");
      const href = item.querySelector("#endpoint").getAttribute("href");
      const imgURL = JSON.parse(img).thumbnails[0].url;
      const isNewContentAvailable = item.getAttribute("line-end-style");
      // subscribeList is the parent element
      // create a new anchor element
      const anchor = document.createElement("a");
      anchor.setAttribute("href", href);
      anchor.setAttribute("title", title);
      anchor.setAttribute("line-end-style", isNewContentAvailable);
      // create a new img element
      const imgElement = document.createElement("img");
      imgElement.src = imgURL;
      imgElement.alt = title;
      // append the imgElement to the anchor
      anchor.appendChild(imgElement);
      subscribeList.appendChild(anchor);
    }
  });
  return subscribeList;
}
