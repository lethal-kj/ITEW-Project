$(document).ready(function () {

  function showMessage(message, type) {
    $("#message").removeClass("d-none alert-success alert-danger alert-secondary").addClass("alert-" + type).text(message);
  }

  // ===== CART =====
  let cart = {};

  function displayCart() {
    let rows = "";
    let total = 0;
    for (let name in cart) {
      let subtotal = cart[name].price * cart[name].quantity;
      total += subtotal;
      rows += `<tr><td>${name}</td><td>₱${cart[name].price}</td><td>${cart[name].quantity}</td><td>₱${subtotal}</td></tr>`;
    }
    if (rows === "") {
      rows = '<tr><td colspan="4" class="text-center text-secondary">Your cart is empty</td></tr>';
    }
    $("#cart-items").html(rows);
    $("#total").text("₱" + total);
  }

  $(".add").click(function () {
    let card = $(this).closest(".card");
    let name = card.find("h5").text();
    let price = Number(card.find(".price").text().replace(/\D/g, ""));
    if (!cart[name]) {
      cart[name] = { price: price, quantity: 0 };
    }
    cart[name].quantity++;
    displayCart();
    showMessage(name + " added to cart.", "success");
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
    $("#reviewsList").empty();
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
    let average = reviews.length > 0 ? total / reviews.length : 0;
    $("#averageRating").text(average.toFixed(1));
    $("#reviewCount").text(reviews.length);
    localStorage.setItem("reviews", JSON.stringify(reviews));
  }

  $("#reviewForm").submit(function (event) {
    event.preventDefault();
    let name = $("#reviewerName").val().trim();
    let comment = $("#reviewText").val().trim();
    if (name === "" || comment === "") {
      showMessage("Please complete all fields correctly.", "danger");
      return;
    }
    reviews.push({ name: name, rating: Number($("#rating").val()), comment: comment, date: new Date().toLocaleDateString() });
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
