(() => {
  let products = [];
  const CATEGORY_LABEL = {
    "bento-box": "Bento Box", "food-pick": "Food Pick", divider: "Divider",
    "sauce-container": "Sauce Container", "lunch-bag": "Lunch Bag",
    utensil: "Utensil", wrapper: "Wrapper", accessory: "Accessory"
  };
  const MATERIAL_LABEL = {
    plastic: "Plastic", "stainless-steel": "Stainless Steel", wood: "Wood",
    bamboo: "Bamboo", silicone: "Silicone", fabric: "Fabric",
    aluminum: "Aluminum", lacquerware: "Lacquerware"
  };
  const SIZE_LABEL = { small: "Small (Kids)", medium: "Medium (Adult)", large: "Large (Family)" };

  const $ = id => document.getElementById(id);

  function populateFilters() {
    const cats = [...new Set(products.map(p => p.category))].sort();
    const mats = [...new Set(products.map(p => p.material))].sort();
    const sizes = [...new Set(products.map(p => p.size))].sort();

    cats.forEach(c => $("category").innerHTML += `<option value="${c}">${CATEGORY_LABEL[c] || c}</option>`);
    mats.forEach(m => $("material").innerHTML += `<option value="${m}">${MATERIAL_LABEL[m] || m}</option>`);
    sizes.forEach(s => $("size").innerHTML += `<option value="${s}">${SIZE_LABEL[s] || s}</option>`);
  }

  function getFiltered() {
    const q = $("search").value.toLowerCase();
    const cat = $("category").value;
    const mat = $("material").value;
    const sz = $("size").value;
    const sort = $("sort").value;

    let list = products.filter(p => {
      if (cat && p.category !== cat) return false;
      if (mat && p.material !== mat) return false;
      if (sz && p.size !== sz) return false;
      if (q && !p.name.toLowerCase().includes(q) && !p.brand.toLowerCase().includes(q)) return false;
      return true;
    });

    if (sort === "price-asc") list.sort((a, b) => a.price_usd - b.price_usd);
    else if (sort === "price-desc") list.sort((a, b) => b.price_usd - a.price_usd);
    else if (sort === "name-asc") list.sort((a, b) => a.name.localeCompare(b.name));

    return list;
  }

  function renderCard(p) {
    const features = [];
    if (p.microwave_safe) features.push("Microwave");
    if (p.dishwasher_safe) features.push("Dishwasher");
    const featHtml = features.map(f => `<span class="feature-icon">${f}</span>`).join("");
    const prosHtml = (p.pros || []).map(pr => `<li>${pr}</li>`).join("");
    const noteHtml = p.expert_note ? `<div class="collector-note">${p.expert_note}</div>` : "";
    const capHtml = p.capacity_ml ? `<span>${p.capacity_ml}ml</span>` : "";
    const colorsHtml = p.colors_available ? `<span>${p.colors_available} colors</span>` : "";

    return `<div class="product-card">
      <div class="brand">${p.brand}</div>
      <h3>${p.name}</h3>
      <div class="badges">
        <span class="badge badge-cat">${CATEGORY_LABEL[p.category] || p.category}</span>
        <span class="badge badge-mat">${MATERIAL_LABEL[p.material] || p.material}</span>
        <span class="badge badge-size">${SIZE_LABEL[p.size] || p.size}</span>
      </div>
      <div class="product-meta">
        ${capHtml}
        ${colorsHtml}
      </div>
      <div class="feature-icons">${featHtml}</div>
      <div class="product-price">$${p.price_usd.toFixed(2)}</div>
      <ul class="product-pros">${prosHtml}</ul>
      <div class="product-best"><strong>Best for:</strong> ${p.best_for}</div>
      ${noteHtml}
    </div>`;
  }

  function render() {
    const list = getFiltered();
    $("resultCount").textContent = `${list.length} product${list.length !== 1 ? "s" : ""} found`;
    $("grid").innerHTML = list.map(renderCard).join("");
  }

  function init() {
    fetch("data/products.json")
      .then(r => r.json())
      .then(data => {
        products = data;
        populateFilters();
        render();
      })
      .catch(err => {
        $("grid").innerHTML = `<p style="padding:24px;color:#78716C">Could not load products. ${err.message}</p>`;
      });

    ["search", "category", "material", "size", "sort"].forEach(id => {
      $(id).addEventListener(id === "search" ? "input" : "change", render);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
