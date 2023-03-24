document.addEventListener( 'DOMContentLoaded', () => {
  const quotesEl = document.querySelector('.quotes');
  const loader = document.querySelector('.loader');

  // The following getQuotes() function calls the API and return the quotes:
  const getQuotes = async (page, limit) => {
    const API_URL = `https://api.javascripttutorial.net/v1/quotes/?page=${page}&limit=${limit}`;
    const response = await fetch(API_URL);
    // handle 404
    if (!response.ok) {
        throw new Error(`An error occurred: ${response.status}`);
    }
    return await response.json();
  }

  /**
   * The following defines the showQuotes() function that generates the <blockquote> elements
   * from the quotes array and appends them to the quotes element:
   */
  // show the quotes
  const showQuotes = (quotes) => {
    quotes.forEach(quote => {
        const quoteEl = document.createElement('blockquote');
        quoteEl.classList.add('quote');

        quoteEl.innerHTML = `
            <span>${quote.id})</span>
            ${quote.quote}
            <footer>${quote.author}</footer>
        `;

        quotesEl.appendChild(quoteEl);
    });
  };

  /**
   * Show/hide loading indicator functions
   * The following defines two functions that show and hide the loading indicator element:
   */
  const hideLoader = () => {
    loader.classList.remove('show');
  };

  const showLoader = () => {
      loader.classList.add('show');
  };

  // The following declares the currentPage variable and initialize it to one:
  let currentPage = 1;

  // To specify the number of quotes that you want to fetch at a time, you can use a constant like this:
  const limit = 10;

  // The following total variable stores the total of quotes returned from the API:
  let total = 0;

  /*
    The hasMoreQuotes() function
    The following hasMoreQuotes() function returns true if:

    It’s the first fetch (total === 0)
    Or there are more quotes to fetch from the API (startIndex < total)
  */
  const hasMoreQuotes = (page, limit, total) => {
    const startIndex = (page - 1) * limit + 1;
    return total === 0 || startIndex < total;
  };


  /*
      The loadQuotes() function
      The following defines a function that performs four actions:

      - Show the loading indicator.
      - Get the quotes from the API by calling the getQuotes() function if there are more quotes to fetch.
      - Show the quotes on the page.
      - Hide the loading indicator.
  */
  // load quotes
  const loadQuotes = async (page, limit) => {
    // show the loader
    showLoader();
    try {
        // if having more quotes to fetch
        if (hasMoreQuotes(page, limit, total)) {
            // call the API to get quotes
            const response = await getQuotes(page, limit);
            // show quotes
            showQuotes(response.data);
            // update the total
            total = response.total;
        }
    } catch (error) {
        console.log(error.message);
    } finally {
        hideLoader();
    }
  };

  /**
   * If the getQuotes() function executes very fast, you won’t see the loading indicator.
   * To make sure that the loading indicator always showing, you can use the setTimeout() function:
   */
  // // load quotes
  // const loadQuotes = async (page, limit) => {

  //   // show the loader
  //   showLoader();

  //   // 0.5 second later
  //   setTimeout(async () => {
  //       try {
  //           // if having more quotes to fetch
  //           if (hasMoreQuotes(page, limit, total)) {
  //               // call the API to get quotes
  //               const response = await getQuotes(page, limit);
  //               // show quotes
  //               showQuotes(response.data);
  //               // update the total
  //               total = response.total;
  //           }
  //       } catch (error) {
  //           console.log(error.message);
  //       } finally {
  //           hideLoader();
  //       }
  //   }, 500);

  // };

  /**
   * Attach the scroll event
      To load more quotes when users scroll to the bottom of the page, you need to attach a scroll event handler.

      The scroll event handler will call the loadQuotes() function if the following conditions are met:

      First, the scroll position is at the bottom of the page.
      Second, there are more quotes to fetch.
      The scroll event handler will also increase the currentPage variable before loading the next quotes.
   */
  window.addEventListener('scroll', () => {
      const {
          scrollTop,
          scrollHeight,
          clientHeight
      } = document.documentElement;
  
      if (scrollTop + clientHeight >= scrollHeight - 5 &&
          hasMoreQuotes(currentPage, limit, total)) {
          currentPage++;
          loadQuotes(currentPage, limit);
      }
  }, {
      passive: true
  });

  /**
   * Initialize the page
   * When the page loads for the first time, you need to call the loadQuotes() function
   * to load the first batch of quotes:
   */
  loadQuotes(currentPage, limit);

} )