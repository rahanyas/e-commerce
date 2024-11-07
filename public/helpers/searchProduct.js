$(document).ready(function() {


  $(".inputSearch").on("keyup", function() {
    let query = $(this).val();
    console.log(query);

    // If the search box is empty, clear the results
    if (!query) {
      $(".searchResults").html("");
      return;
    }

    // Send AJAX request
    $.ajax({
      url: '/search',
      method: 'GET',
      data: { query: query },
      success: function(response) {
        // Clear previous results
        $(".searchResults").html("");

        // Build the section container for the search results
        let sectionHTML = `
          <section class="bg0 p-t-23 p-b-140">
            <div class="container">
              <div class="row isotope-grid">
        `;
        
        

        if (response.results && response.results.length > 0) {
          // Loop through results and add each product to the HTML structure
          response.results.forEach(product => {
            sectionHTML += `
              <div class="col-sm-6 col-md-4 col-lg-3 p-b-35 isotope-item ${product.category ? product.category.category : 'default-category'}">
                <div class="block2">
                  <div class="block2-pic hov-img0">
                    <img src="${product.images[0]?.url}" alt="${product.name}" class="img-fluid" />
                    <a href="/productDetail/${product._id}" class="block2-btn flex-c-m stext-103 cl2 size-102 bg0 bor2 hov-btn1 p-lr-15 trans-04">
                      Quick View
                    </a>
                  </div>
                  <div class="block2-txt flex-w flex-t p-t-14">
                    <div class="block2-txt-child1 flex-col-l ">
                      <a href="/productDetail/${product._id}" class="stext-104 cl4 hov-cl1 trans-04 js-name-b2 p-b-6">
                        ${product.name}
                      </a>
                      <span class="stext-105 cl3">$${product.price}</span>
                    </div>
                    <div class="block2-txt-child2 flex-r p-t-3">
                      <form action="/addToWishList/${product._id}" method="post">
                        <button type="submit">
                          <i class="fa fa-regular fa-heart"></i>
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            `;
          });

          // Close the row and container
          sectionHTML += `
              </div> <!-- End of row -->
            </div> <!-- End of container -->
          </section>
          <h4 class="related-products-title">related products</h4>
          `;

          // Add the constructed HTML to the searchResults div
          $(".searchResults").html(sectionHTML);
          $('.section-slide').hide();
          $('.sec-banner.bg0.p-t-80.p-b-50').hide();
         
        } else {
          $(".searchResults").html(`<h1 class="text-center m-4">No results found</h1>`);
        }
      },
      error: function(error) {
        console.error("Error fetching search results:", error);
      }
    });
  });
});
