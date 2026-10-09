$(document).ready(function () {
  const peso = n => "₱" + n.toLocaleString();

  // Show a message inside #message
  function showMessage(message, type) {
    $("#message").removeClass("d-none alert-success alert-danger alert-secondary").addClass("alert-" + type).text(message);
  }

  // ===== CART =====
  let cart = JSON.parse(localStorage.getItem("shopCart")) || {};

  function displayCart() {
    let rows = "";
    let total = 0;
    for (let name in cart) {
      let item = cart[name];
      total += item.price * item.quantity;
      rows += `<tr><td>${name}</td><td>${peso(item.price)}</td>
        <td><button class="btn btn-sm btn-outline-dark change" data-name="${name}" data-change="-1">−</button>
        ${item.quantity}
        <button class="btn btn-sm btn-outline-dark change" data-name="${name}" data-change="1">+</button></td>
        <td>${peso(item.price * item.quantity)}</td></tr>`;
    }
    $("#cart-items").html(rows || '<tr><td colspan="4" class="text-center text-secondary">Your cart is empty</td></tr>');
    $("#total").text(peso(total));
    localStorage.setItem("shopCart", JSON.stringify(cart));
  }

  $(".add").click(function () {
    let card = $(this).closest(".card");
    let name = card.find("h5").text();
    let price = Number(card.find(".price").text().replace(/\D/g, ""));
    if (!cart[name]) cart[name] = { price: price, quantity: 0 };
    cart[name].quantity++;
    displayCart();
    showMessage(name + " added to cart.", "success");
  });

  $("#cart-items").on("click", ".change", function () {
    let name = $(this).data("name");
    cart[name].quantity += $(this).data("change");
    if (cart[name].quantity < 1) delete cart[name];
    displayCart();
  });

  $("#clear-cart").click(function () {
    cart = {};
    displayCart();
    showMessage("Cart cleared.", "secondary");
  });

  $("#place-order").click(function () {
    if ($.isEmptyObject(cart)) {
      showMessage("Your cart is empty.", "danger");
      return;
    }
    cart = {};
    displayCart();
    showMessage("Thank you! Your order has been placed.", "success");
  });

  // ===== REVIEWS =====
  let reviews = JSON.parse(localStorage.getItem("reviews")) || [];

  function displayReviews() {
    let total = 0;
    $("#reviewsList").html(reviews.length ? "" : '<p class="text-center text-secondary mb-0">No reviews yet. Be the first to share your experience!</p>');
    reviews.forEach(function (review, index) {
      total += review.rating;
      let card = $(`<article class="card card-body mb-3">
        <div class="d-flex justify-content-between"><h5 class="name fw-bold"></h5>
        <button class="btn btn-outline-danger btn-sm delete" data-index="${index}">Delete</button></div>
        <div class="stars text-warning"></div><p class="comment"></p><small class="date text-secondary"></small></article>`);
      card.find(".name").text(review.name);
      card.find(".stars").text("★".repeat(review.rating) + "☆".repeat(5 - review.rating));
      card.find(".comment").text(review.comment);
      card.find(".date").text("Posted on: " + review.date);
      $("#reviewsList").append(card);
    });
    $("#averageRating").text((reviews.length ? total / reviews.length : 0).toFixed(1));
    $("#reviewCount").text(reviews.length);
    localStorage.setItem("reviews", JSON.stringify(reviews));
  }

  $("#reviewForm").submit(function (event) {
    event.preventDefault();
    let name = $("#reviewerName").val().trim();
    let rating = Number($("#rating").val());
    let comment = $("#reviewText").val().trim();
    if (name === "" || comment === "" || rating < 1) {
      showMessage("Please complete all fields correctly.", "danger");
      return;
    }
    reviews.push({ name: name, rating: rating, comment: comment, date: new Date().toLocaleDateString() });
    displayReviews();
    this.reset();
    showMessage("Thank you! Your review was submitted successfully.", "success");
  });

  $("#reviewsList").on("click", ".delete", function () {
    reviews.splice($(this).data("index"), 1);
    displayReviews();
    showMessage("Review deleted successfully.", "success");
  });

  // ===== CONTACT =====
  $("#contactForm").submit(function (event) {
    event.preventDefault();
    this.reset();
    $("#message").removeClass("d-none");
  });

  displayCart();
  displayReviews();
});