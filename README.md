# Flask-Ebay-Project

Flask-Ebay-Project is a web application that enables users to search for eBay products based on specific criteria and access comprehensive information about individual items, offering a user-friendly web interface for interacting with eBay listings. This project is developed using Python Flask for the backend and JavaScript and HTML/CSS for the frontend.

## Layers

1. **Backend:** Powered by Python Flask.
2. **Frontend:** Utilizes JavaScript and jQuery.

## Backend

**Functionality:** The backend is responsible for managing HTTP requests, interfacing with the eBay Finding API, processing user search parameters, and delivering search results and detailed item information in an organized format.

**Endpoints and Features:** The Flask backend includes several key endpoints:

- **`/`:** Serves the main HTML page for user interaction.
- **`/search`:** Processes user queries, interacts with the eBay Finding API, and provides product search results.
- **`/get_item_info`:** Retrieves in-depth information about specific eBay items.

**API Integration:** The backend integrates with the eBay Finding API to access product listings and item details. It formulates and dispatches requests to the eBay API endpoint, handles API responses, and transmits pertinent data to the frontend.

## Frontend

**Functionality:** The frontend of the eBay Product Search application focuses on crafting an intuitive user interface for seamless interaction with the backend. It manages user input, displays search results, and enables the exploration of item-specific information.

**Technologies:** The frontend is constructed using HTML, JavaScript, and CSS. JavaScript, in particular, is employed for client-side scripting, facilitating dynamic interactions and AJAX requests to the backend.

**Key Functions:**

- **validateForm():** Ensures that user input is valid and provides error messages when necessary.
- **searchEbay(maxResults):** Collects form data, validates it, and communicates with the backend to search for eBay products.
- **displayResults(results, maxResults):** Renders search results, presenting item titles, categories, conditions, and prices.
- **searchItem(attributes):** Initiates requests for comprehensive data about a specific eBay item from the backend and showcases it on the webpage.
- **clearForm():** Resets the search form and clears input fields.

**AJAX:** The frontend leverages AJAX (Asynchronous JavaScript and XML) to interact with the Flask backend. This approach ensures smooth data retrieval and updating without necessitating a complete page reload.

