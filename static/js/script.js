function hideTooltip() {
  var keywords = document.getElementById('keywords').value;
  var tooltip = document.getElementById('tooltip');

  if (keywords) {
    tooltip.style.visibility = 'hidden';
    tooltip.style.opacity = 0;
  }
}
function validateForm() {
  var keywords = document.getElementById('keywords').value;

  if (!keywords) {
    var tooltip = document.getElementById('tooltip');
    tooltip.style.visibility = 'visible';
    tooltip.style.opacity = 1;
    return false;
  }

  var minPrice = parseFloat(document.getElementById('price_from').value);
  var maxPrice = parseFloat(document.getElementById('price_to').value);

  if (
    (!isNaN(minPrice) && minPrice < 0) ||
    (!isNaN(maxPrice) && maxPrice < 0)
  ) {
    alert(
      'Price Range values cannot be negative! Please try a value greater than or equal to 0.0'
    );
    return false;
  }
  if (!isNaN(minPrice) && !isNaN(maxPrice) && minPrice > maxPrice) {
    alert(
      'Oops! Lower price limit cannot be greater than upper limit! Please try again.'
    );
    return false;
  }

  return true;
}

function searchItem(attributes) {
  $.get('/get_item_info', attributes, function (result) {
    const resultsContainer = document.getElementById('results');

    resultsContainer.innerHTML = '';

    const headline = document.createElement('div');
    headline.classList.add('card-headline');
    headline.innerHTML = `<h2>Item Details</h2>`;
    resultsContainer.appendChild(headline);

    const button = document.createElement('button');
    button.classList.add('back-button');
    button.innerText = 'Back to search reasults';

    button.onclick = function () {
      searchEbay(attributes.max);
    };
    resultsContainer.appendChild(button);

    const table = document.createElement('table');
    table.className = 'table';
    if (result.Item.PictureURL[0]) {
      const photoLink = result.Item.PictureURL[0];

      const row = document.createElement('tr');

      const nameCell = document.createElement('td');
      const contentCell = document.createElement('td');

      nameCell.textContent = 'Photo';

      const imgElement = document.createElement('img');
      imgElement.className = 'itemPhoto';
      imgElement.src = photoLink;
      imgElement.alt = 'Item Photo';

      contentCell.appendChild(imgElement);

      row.appendChild(nameCell);
      row.appendChild(contentCell);

      table.appendChild(row);
    }

    if (result.Item.ViewItemURLForNaturalSearch) {
      const link = result.Item.ViewItemURLForNaturalSearch;
      const row = document.createElement('tr');
      const nameCell = document.createElement('td');
      const contentCell = document.createElement('td');
      nameCell.textContent = 'eBay Link';
      const linkElement = document.createElement('a');
      linkElement.href = link;
      linkElement.target = '_blank';
      linkElement.textContent = 'eBay Product Link';
      contentCell.appendChild(linkElement);

      row.appendChild(nameCell);
      row.appendChild(contentCell);

      table.appendChild(row);
    }

    if (result.Item.Title) {
      const row = document.createElement('tr');
      const nameCell = document.createElement('td');
      const contentCell = document.createElement('td');
      nameCell.textContent = 'Title';
      contentCell.textContent = result.Item.Title;
      row.appendChild(nameCell);
      row.appendChild(contentCell);

      table.appendChild(row);
    }

    if (result.Item.SubTitle) {
      const row = document.createElement('tr');
      const nameCell = document.createElement('td');
      const contentCell = document.createElement('td');
      nameCell.textContent = 'SubTitle';
      contentCell.textContent = result.Item.SubTitle;
      row.appendChild(nameCell);
      row.appendChild(contentCell);

      table.appendChild(row);
    }

    if (result.Item.CurrentPrice) {
      const row = document.createElement('tr');
      const nameCell = document.createElement('td');
      const contentCell = document.createElement('td');
      nameCell.textContent = 'Price';
      contentCell.textContent =
        result.Item.CurrentPrice.Value +
        ' ' +
        result.Item.CurrentPrice.CurrencyID;
      row.appendChild(nameCell);
      row.appendChild(contentCell);

      table.appendChild(row);
    }

    if (result.Item.Location) {
      const row = document.createElement('tr');
      const nameCell = document.createElement('td');
      const contentCell = document.createElement('td');
      nameCell.textContent = 'Location';
      if (result.Item.PostalCode) {
        contentCell.textContent = `${result.Item.Location}, ${result.Item.PostalCode}`;
      } else {
        contentCell.textContent = `${result.Item.Location}`;
      }
      row.appendChild(nameCell);
      row.appendChild(contentCell);

      table.appendChild(row);
    }

    if (result.Item.Seller) {
      const row = document.createElement('tr');
      const nameCell = document.createElement('td');
      const contentCell = document.createElement('td');
      nameCell.textContent = 'Seller';
      contentCell.textContent = result.Item.Seller.UserID;
      row.appendChild(nameCell);
      row.appendChild(contentCell);

      table.appendChild(row);
    }

    if (result.Item.ReturnPolicy) {
      const row = document.createElement('tr');
      const nameCell = document.createElement('td');
      const contentCell = document.createElement('td');
      nameCell.textContent = 'Return Policy(US)';
      if (result.Item.ReturnPolicy.ReturnsAccepted == 'ReturnsNotAccepted') {
        contentCell.textContent = result.Item.ReturnPolicy.ReturnsAccepted;
      } else {
        contentCell.textContent =
          result.Item.ReturnPolicy.ReturnsAccepted +
          ' within ' +
          result.Item.ReturnPolicy.ReturnsWithin;
      }
      row.appendChild(nameCell);
      row.appendChild(contentCell);

      table.appendChild(row);
    }

    if (result.Item.ItemSpecifics) {
      const rowsData = result.Item.ItemSpecifics.NameValueList;
      for (const rowData of rowsData) {
        const row = document.createElement('tr');
        const nameCell = document.createElement('td');
        const contentCell = document.createElement('td');

        nameCell.textContent = rowData.Name;
        contentCell.textContent = rowData.Value;

        row.appendChild(nameCell);
        row.appendChild(contentCell);

        table.appendChild(row);
      }
    }
    resultsContainer.appendChild(table);
  }).fail(function () {
    alert('Error fetching data from the server.');
  });
}

function searchEbay(maxResults = 3) {
  if (validateForm()) {
    const form = document.querySelector('form');
    const formdata = new FormData(form);
    const formDataObject = {};

    // Convert FormData to a regular JavaScript object
    for (var pair of formdata.entries()) {
      const key = pair[0];
      const value = pair[1];

      if (key == 'condition') {
        if (formDataObject[key] === undefined) {
          formDataObject[key] = [value];
        } else {
          formDataObject[key].push(value);
        }
      } else {
        formDataObject[pair[0]] = pair[1];
      }
    }

    $.get('/search', formDataObject, function (results) {
      displayResults(results, maxResults);
    }).fail(function () {
      alert('Error fetching data from the server.');
    });
  }
}

function displayResults(results, maxResults) {
  const resultsContainer = document.getElementById('results');
  resultsContainer.innerHTML = '';

  var totalEntries =
    results.findItemsAdvancedResponse[0].paginationOutput[0].totalEntries[0];
  var items = results.findItemsAdvancedResponse[0].searchResult[0].item;

  if (totalEntries == 0) {
    const headline = document.createElement('div');
    headline.classList.add('results-headline');
    headline.innerHTML = `<h1>No Results found</h1>`;
    resultsContainer.appendChild(headline);
    return;
  }

  const headline = document.createElement('div');
  headline.classList.add('results-headline');
  headline.innerHTML = `<h2> ${totalEntries} Results found for <span style="font-style: italic;">${
    document.getElementById('keywords').value
  }</span> </h2>`;
  resultsContainer.appendChild(headline);
  const hr = document.createElement('hr');
  hr.className = 'headlineHr';
  resultsContainer.appendChild(hr);
  // Display results

  for (var i = 0; i < Math.min(items.length, maxResults); i++) {
    var item = items[i];
    var resultCard = document.createElement('div');
    resultCard.className = 'result-card';
    resultCard.setAttribute('itemId', item.itemId);
    resultCard.setAttribute('max', maxResults);

    resultCard.addEventListener('click', function (event) {
      var itemId = event.currentTarget.getAttribute('itemId');
      var max = event.currentTarget.getAttribute('max');
      searchItem({ itemId: itemId, max: max });
    });

    if (item.galleryURL) {
      var resultImage = document.createElement('div');
      resultImage.className = 'result-image';
      var image = document.createElement('img');
      image.src =
        item.galleryURL ||
        'https://liftlearning.com/wp-content/uploads/2020/09/default-image.png';
      resultImage.appendChild(image);
      resultCard.appendChild(resultImage);
    }

    var resultContent = document.createElement('div');
    resultContent.className = 'result-content';

    // Item title
    if (item.title) {
      var title = document.createElement('h2');
      title.innerText = item.title;
      resultContent.appendChild(title);
    }

    // Item category

    if (item.primaryCategory) {
      const category = document.createElement('div');
      category.innerHTML = `Category: <span style="font-style: italic;">${item.primaryCategory[0].categoryName}</span>`;
      if (item.viewItemURL) {
        var redirectIcon = document.createElement('a');
        redirectIcon.href = item.viewItemURL;
        redirectIcon.target = '_blank';
        var iconImage = document.createElement('img');
        iconImage.src = 'https://csci571.com/hw/hw6/images/redirect.png';
        iconImage.className = 'redirect';
        iconImage.style.width = '12px';
        iconImage.style.margin = '3px';
        redirectIcon.addEventListener('click', function (event) {
          event.stopPropagation();
        });
        redirectIcon.appendChild(iconImage);
        category.appendChild(redirectIcon);
      }
      resultContent.appendChild(category);
    }

    // Item condition
    if (item.condition) {
      var condition = document.createElement('p');
      condition.innerText = `Condition: ${item.condition[0].conditionDisplayName}`;

      if (item.topRatedListing == 'true') {
        var topRatedImage = document.createElement('img');
        topRatedImage.src =
          'https://csci571.com/hw/hw6/images/topRatedImage.png';
        topRatedImage.style.width = '16px';
        topRatedImage.style.marginLeft = '5px';
        topRatedImage.style.verticalAlign = 'middle';
        topRatedImage.className = 'top-rated';
        condition.appendChild(topRatedImage);
      }

      resultContent.appendChild(condition);
    }

    // Item price

    if (item.sellingStatus) {
      var price = document.createElement('p');
      var priceText =
        'Price: $' + item.sellingStatus[0].convertedCurrentPrice[0].__value__;
      if (
        item.shippingInfo &&
        item.shippingInfo[0].shippingServiceCost &&
        item.shippingInfo[0].shippingServiceCost[0].__value__ !== '0.0'
      ) {
        var shipping = item.shippingInfo[0].shippingServiceCost[0].__value__;
        priceText += ` ( + $${item.shippingInfo[0].shippingServiceCost[0].__value__} for shipping)`;
      }
      price.innerText = priceText;
      price.style.fontWeight = 'bold';
      resultContent.appendChild(price);
      resultCard.appendChild(resultContent);
    }
    resultsContainer.appendChild(resultCard);
  }

  // Display "Show More" button if there are more results
  if (maxResults == 3) {
    var showMoreButton = document.createElement('button');
    showMoreButton.innerText = 'Show More';
    showMoreButton.className = 'show-more-button';
    showMoreButton.onclick = function () {
      displayResults(results, 10);
      window.scrollTo(0, document.body.scrollHeight); // Scroll to the bottom
    };
    resultsContainer.appendChild(showMoreButton);
  }

  // Display "Show Less" button if more results are displayed
  if (maxResults == 10) {
    var showLessButton = document.createElement('button');
    showLessButton.innerText = 'Show Less';
    showLessButton.className = 'show-less-button';
    showLessButton.onclick = function () {
      displayResults(results, 3);
      window.scrollTo(0, 0);
    };
    resultsContainer.appendChild(showLessButton);
  }
}

function clearForm() {
  $('#search-form')[0].reset();
  $('input[name="condition"]').prop('checked', false);
  $('#returns_accepted, #free_shipping, #expedited_shipping').prop(
    'checked',
    false
  );
  $('#sort_order').val('BestMatch');
  $('#results').empty();
  $('#tooltip').css('visibility', 'hidden').css('opacity', 0);
}
