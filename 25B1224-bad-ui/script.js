  const STORAGE_KEY = 'volumeSliderUser';

      function getStoredUser() {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
      }

      function saveUser(username, password) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ username, password }));
      }

      function clearPage() {
        document.getElementById('page-content').innerHTML = '';
      }

      function showMainPage(message = '') {
        const content = document.getElementById('page-content');
        const stored = getStoredUser();
        const status = message ? `<div class="message">${message}</div>` : '';

        content.innerHTML = `
          <div class="button-container">
            <button class="signin" onclick="showSignInPage()">Sign In</button>
            <button class="create-account" onclick="showCreateAccountPage()">Create Account</button>
          </div>
          ${status}
        `;
      }

      function showCreateAccountPage() {
        const content = document.getElementById('page-content');
        content.innerHTML = `
          <div class="form-container">
            <p class="title">Create Account</p>
            <input id="new-username" class="form-field" type="text" placeholder="Username" />
            <input id="new-password" class="form-field" type="password" placeholder="Password" />
            <button class="submit-button" onclick="handleCreateAccount()">Create Account</button>
            <button class="back-button" onclick="showMainPage()">Back</button>
          </div>
        `;
      }

      function showSignInPage() {
        const content = document.getElementById('page-content');
        content.innerHTML = `
          <div class="form-container">
            <p class="title">Sign In</p>
            <input id="sign-username" class="form-field" type="text" placeholder="Username" />
            <input id="sign-password" class="form-field" type="password" placeholder="Password" />
            <button class="submit-button" onclick="handleSignIn()">Sign In</button>
            <button class="back-button" onclick="showMainPage()">Back</button>
          </div>
        `;
      }

      function handleCreateAccount() {
        const username = document.getElementById('new-username').value.trim();
        const password = document.getElementById('new-password').value.trim();

        if (!username || !password) {
          alert('Please enter both username and password.');
          return;
        }

        saveUser(username, password);
        showMainPage('Account created! You can now sign in.');
      }

      function handleSignIn() {
        const storedUser = getStoredUser();
        if (!storedUser) {
          alert('No account found. Please create an account first.');
          showCreateAccountPage();
          return;
        }

        const username = document.getElementById('sign-username')?.value?.trim();
        const password = document.getElementById('sign-password')?.value?.trim();

        if (!username || !password) {
          alert('Please enter both username and password.');
          return;
        }

        if (username === storedUser.username && password === storedUser.password) {
          if (storedUser.subscribed) {
            showVolumePage();
          } else {
            showPaymentPage();
          }
        } else {
          alert('Incorrect username or password. Please try again or create an account.');
          showSignInPage();
        }
      }

      function showPaymentPage() {
        const content = document.getElementById('page-content');
        const amount = 10000000;

        content.innerHTML = `
          <div class="form-container">
            <p class="title">Subscription Payment</p>
            <p>Pay $${amount} to subscribe and unlock volume control.</p>
            <input id="bank-name" class="form-field" type="text" placeholder="Bank Account Name" />
            <input id="bank-pin" class="form-field" type="password" placeholder="PIN Number" />
            <button class="submit-button" onclick="handlePayment()">Pay $${amount}</button>
            <button class="back-button" onclick="showMainPage()">Cancel</button>
          </div>
        `;
      }

      function handlePayment() {
        const bankName = document.getElementById('bank-name').value.trim();
        const bankPin = document.getElementById('bank-pin').value.trim();

        if (!bankName || !bankPin) {
          alert('Please enter your bank account name and PIN.');
          return;
        }

        const storedUser = getStoredUser();
        if (!storedUser) {
          alert('No account found. Please create an account first.');
          showCreateAccountPage();
          return;
        }

        storedUser.subscribed = true;
        storedUser.bankName = bankName;
        storedUser.bankPin = bankPin;
        saveUser(storedUser.username, storedUser.password, storedUser);
        showVolumePage('Payment successful! Adjust your volume below.');
      }

      function showVolumePage(message = '') {
        const content = document.getElementById('page-content');
        const storedUser = getStoredUser();
        const volume = storedUser?.volume ?? 50;
        const status = message ? `<div class="message">${message}</div>` : '';

        content.innerHTML = `
          <div class="form-container">
            <p class="title">Volume Slider</p>
            <input id="volume-slider" class="form-field" type="range" min="0" max="100" value="${volume}" oninput="updateVolumeValue(this.value)" />
            <div id="volume-value">Current volume: ${volume}</div>
            <button class="submit-button" onclick="handleSaveVolume()">Save Volume</button>
            <button class="back-button" onclick="showMainPage()">Back to Main Page</button>
            ${status}
          </div>
        `;
      }

      function updateVolumeValue(value) {
        const display = document.getElementById('volume-value');
        if (display) display.textContent = `Current volume: ${value}`;
      }

      function handleSaveVolume() {
        const slider = document.getElementById('volume-slider');
        const volume = slider ? parseInt(slider.value, 10) : 50;
        const storedUser = getStoredUser();

        if (!storedUser) {
          alert('No account found. Please create an account first.');
          showCreateAccountPage();
          return;
        }

        storedUser.volume = volume;
        saveUser(storedUser.username, storedUser.password, storedUser);
        showVolumePage(`Volume saved at ${volume}. You can go back to the main page now.`);
      }

      function saveUser(username, password, extras = {}) {
        const user = { username, password, ...extras };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      }

      showMainPage();