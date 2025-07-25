import lunr from "lunr";

// Handle search form submit ===
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-box");

if (searchForm && searchInput) {
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query.length > 1) {
      window.location.href = `/search.html?q=${encodeURIComponent(query)}`;
    }
  });
}

// Handle displaying results on /search.html ===
if (window.location.pathname.startsWith("/search")) {
  const params = new URLSearchParams(window.location.search);
  const query = params.get("q");
  /*console.log("Query param:", query);*/
  const resultsContainer = document.getElementById("search-results");

  if (resultsContainer && query && query.length > 1) {
    fetch("/index.json")
      .then((res) => res.json())
      .then((data) => {
        const documents = {};
        const idx = lunr(function () {
          this.ref("href");
          this.field("title");
          this.field("body");

          data.forEach((doc) => {
            documents[doc.href] = doc;
            this.add(doc);
          });
        });

        const results = idx.search(query);

        if (results.length === 0) {
          resultsContainer.innerHTML = `<p>No results found for <strong>${query}</strong>.</p>`;
          return;
        }

        const ul = document.createElement("ul");
        results.forEach((result) => {
          const doc = documents[result.ref];
          const li = document.createElement("li");
          li.innerHTML = `<a href="${doc.href}">${doc.title}</a>`;
          ul.appendChild(li);
        });

        resultsContainer.innerHTML = `<p>Results for <strong>${query}</strong>:</p>`;
        resultsContainer.appendChild(ul);
      })
      .catch((err) => {
        console.error("Search failed:", err);
        resultsContainer.innerHTML = "<p>Search failed. Please try again later.</p>";
      });
  } else if (resultsContainer) {
    resultsContainer.innerHTML = "<p>No search query provided.</p>";
  }
}
