/**
 * Loads data from the storage.
 * Retrieves users, contacts, and tasks from the storage.
 * @returns {Promise<void>} - A promise that resolves once the data is loaded.
 */
async function loadData() {
  try {
    users = JSON.parse(await getItem('users'));
    // users = await getItem('users');
} catch (error) {
    console.info('could not load users', error);
  }
  try {
    contacts = await getItemBE('contacts');
  } catch (error) {
    console.info('could not load contacts', error);
  }
  try {
    tasks = await getItemBE('tasks');
  } catch (error) {
    console.info('could not load tasks', error);
  }
}

/**
 * Sets an item in the storage.
 * @param {string} key - The key of the item to set.
 * @param {any} value - The value of the item to set.
 * @returns {Promise<any>} - A promise that resolves with the result of the operation.
 */
async function setItem(path = '', value = {}) {
  let response = await fetch(STORAGE_URL + path + '.json', {
    method: 'PUT',
    header: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(value),
  });
}




async function setItemWithAuth(path = '', value = {}) {
  const token = localStorage.getItem('authToken');  // Token aus localStorage abrufen

  const response = await fetch(`http://localhost:8000/${path}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`,  // Token im Authorization-Header
    },
    body: JSON.stringify(value),
  });
  console.log('setItemWithAuth response:', response)

  if (!response.ok) {
    const errorResponse = await response.json();
    console.error('setTask error response:', errorResponse);
  } else {
    const data = await response.json();
    localStorage.setItem('authToken', data.token);  // Token speichern
  }
}

async function setItemNoAuth(path = '', value = {}) {
  const response = await fetch(`http://localhost:8000/${path}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(value),
  });
  if (!response.ok) {
    const errorResponse = await response.json();
    console.error('setItemNoAuth error response:', errorResponse);
  } else {
    const data = await response.json();
    console.log('Item successfully created:', data);
  }
}
  
  

/**
 * Retrieves an item from the storage.
 * @param {string} path - The key path the item to retrieve.
 * @returns {Promise<any>} - A promise that resolves with the retrieved item.
 */
async function getItem(path = '') {
  let response = await fetch(STORAGE_URL + path + '.json'); // wichtig!!
  let responseAsJson = await response.json();

  return responseAsJson;
}

// TOKEN???
// headers: {
//   'Authorization': 'Token YOUR_API_TOKEN',  // Ersetze YOUR_API_TOKEN mit deinem tatsächlichen Token
// },
async function getItemBE(path = '') {
  try {
    let response = await fetch(`http://localhost:8000/${path}/`, {
    });
    if (!response.ok) {
      console.error('HTTP error:', response.status, response.statusText);
      return [];
    }
    let responseAsJson = await response.json();
    return responseAsJson;
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
}

/**
 * Loads user data from local storage.
 * Retrieves the user object from local storage if available.
 * @returns {void}
 */
function loadUser() {
  let userAsText = localStorage.getItem('user');
  if (userAsText) {
    user = JSON.parse(userAsText);
  }
}
