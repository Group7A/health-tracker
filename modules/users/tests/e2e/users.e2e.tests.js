'use strict';

describe('Users E2E Tests:', function () {
  var user1 = {
    firstName: 'test',
    lastName: 'user',
    email: 'test.user@meanjs.com',
    username: 'testUser',
    password: 'P@$$w0rd!!'
  };

  var user2 = {
    firstName: 'test',
    lastName: 'user2',
    email: 'test.user2@meanjs.com',
    username: 'testUser2',
    password: 'P@$$w0rd!!'
  };

  var recipe = {
    enterRecipeName: 'pizza',
    method: 'baked',
    prepTime: 30,
    diet: 'none',
    rate: 5,
    ingredientName: 'tomatoSauce',
    quantity: 3,
    units: 'ounces',
    steps: 'make dough in a pie shape'
  }

  var signout = function () {
    // Make sure user is signed out first
    browser.get('http://localhost:3001/authentication/signout');
    // Delete all cookies
    browser.driver.manage().deleteAllCookies();
  };

  describe('Signup Validation', function () {
    it('Should report missing first name', function () {
      browser.get('http://localhost:3001/authentication/signup');
      // Enter Last Name
      element(by.model('vm.credentials.lastName')).sendKeys(user1.lastName);
      // Enter Email
      element(by.model('vm.credentials.email')).sendKeys(user1.email);
      // Enter Username
      element(by.model('vm.credentials.username')).sendKeys(user1.username);
      // Enter Password
      element(by.model('vm.credentials.password')).sendKeys(user1.password);
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // First Name Error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('First name is required.');
    });

    it('Should report missing last name', function () {
      browser.get('http://localhost:3001/authentication/signup');
      // Enter First Name
      element(by.model('vm.credentials.firstName')).sendKeys(user1.firstName);
      // Enter Email
      element(by.model('vm.credentials.email')).sendKeys(user1.email);
      // Enter Username
      element(by.model('vm.credentials.username')).sendKeys(user1.username);
      // Enter Password
      element(by.model('vm.credentials.password')).sendKeys(user1.password);
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Last Name Error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('Last name is required.');
    });

    it('Should report missing email address', function () {
      browser.get('http://localhost:3001/authentication/signup');
      // Enter First Name
      element(by.model('vm.credentials.firstName')).sendKeys(user1.firstName);
      // Enter Last Name
      element(by.model('vm.credentials.lastName')).sendKeys(user1.lastName);
      // Enter Username
      element(by.model('vm.credentials.username')).sendKeys(user1.username);
      // Enter Password
      element(by.model('vm.credentials.password')).sendKeys(user1.password);
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Email address error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('Email address is required.');
    });

    it('Should report invalid email address - "123"', function () {
      browser.get('http://localhost:3001/authentication/signup');
      // Enter First Name
      element(by.model('vm.credentials.firstName')).sendKeys(user1.firstName);
      // Enter Last Name
      element(by.model('vm.credentials.lastName')).sendKeys(user1.lastName);
      // Enter Email
      element(by.model('vm.credentials.email')).sendKeys('123');
      // Enter Username
      element(by.model('vm.credentials.username')).sendKeys(user1.username);
      // Enter Password
      element(by.model('vm.credentials.password')).sendKeys(user1.password);
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Email address error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('Email address is invalid.');
    });

    /**
     * Note: 123@123 is a valid email adress according to HTML5.
     * However, 123@123@123 is an invalid email address.
     */
    it('Should report invalid email address - "123@123@123"', function () {
      browser.get('http://localhost:3001/authentication/signup');
      // Enter First Name
      element(by.model('vm.credentials.firstName')).sendKeys(user1.firstName);
      // Enter Last Name
      element(by.model('vm.credentials.lastName')).sendKeys(user1.lastName);
      // Enter Email
      element(by.model('vm.credentials.email')).sendKeys('123@123@123');
      // Enter Username
      element(by.model('vm.credentials.username')).sendKeys(user1.username);
      // Enter Password
      element(by.model('vm.credentials.password')).sendKeys(user1.password);
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Email address error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('Email address is invalid.');
    });

    it('Should report invalid username - ".login"', function () {
      browser.get('http://localhost:3001/authentication/signup');
      // Enter First Name
      element(by.model('vm.credentials.firstName')).sendKeys(user1.firstName);
      // Enter Last Name
      element(by.model('vm.credentials.lastName')).sendKeys(user1.lastName);
      // Enter Email
      element(by.model('vm.credentials.email')).sendKeys(user1.email);
      // Enter Username
      element(by.model('vm.credentials.username')).sendKeys('.login');
      // Enter Password
      element(by.model('vm.credentials.password')).sendKeys(user1.password);
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Email address error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('Please enter a valid username: 3+ characters long, non restricted word, characters "_-.", no consecutive dots, does not begin or end with dots, letters a-z and numbers 0-9.');
    });

    it('Should report invalid username - "login."', function () {
      browser.get('http://localhost:3001/authentication/signup');
      // Enter First Name
      element(by.model('vm.credentials.firstName')).sendKeys(user1.firstName);
      // Enter Last Name
      element(by.model('vm.credentials.lastName')).sendKeys(user1.lastName);
      // Enter Email
      element(by.model('vm.credentials.email')).sendKeys(user1.email);
      // Enter Username
      element(by.model('vm.credentials.username')).sendKeys('login.');
      // Enter Password
      element(by.model('vm.credentials.password')).sendKeys(user1.password);
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Email address error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('Please enter a valid username: 3+ characters long, non restricted word, characters "_-.", no consecutive dots, does not begin or end with dots, letters a-z and numbers 0-9.');
    });

    it('Should report invalid username - "log..in"', function () {
      browser.get('http://localhost:3001/authentication/signup');
      // Enter First Name
      element(by.model('vm.credentials.firstName')).sendKeys(user1.firstName);
      // Enter Last Name
      element(by.model('vm.credentials.lastName')).sendKeys(user1.lastName);
      // Enter Email
      element(by.model('vm.credentials.email')).sendKeys(user1.email);
      // Enter Username
      element(by.model('vm.credentials.username')).sendKeys('log..in');
      // Enter Password
      element(by.model('vm.credentials.password')).sendKeys(user1.password);
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Email address error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('Please enter a valid username: 3+ characters long, non restricted word, characters "_-.", no consecutive dots, does not begin or end with dots, letters a-z and numbers 0-9.');
    });

    it('Should report invalid username - "lo"', function () {
      browser.get('http://localhost:3001/authentication/signup');
      // Enter First Name
      element(by.model('vm.credentials.firstName')).sendKeys(user1.firstName);
      // Enter Last Name
      element(by.model('vm.credentials.lastName')).sendKeys(user1.lastName);
      // Enter Email
      element(by.model('vm.credentials.email')).sendKeys(user1.email);
      // Enter Username
      element(by.model('vm.credentials.username')).sendKeys('lo');
      // Enter Password
      element(by.model('vm.credentials.password')).sendKeys(user1.password);
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Email address error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('Please enter a valid username: 3+ characters long, non restricted word, characters "_-.", no consecutive dots, does not begin or end with dots, letters a-z and numbers 0-9.');
    });

    it('Should report invalid username - "log$in"', function () {
      browser.get('http://localhost:3001/authentication/signup');
      // Enter First Name
      element(by.model('vm.credentials.firstName')).sendKeys(user1.firstName);
      // Enter Last Name
      element(by.model('vm.credentials.lastName')).sendKeys(user1.lastName);
      // Enter Email
      element(by.model('vm.credentials.email')).sendKeys(user1.email);
      // Enter Username
      element(by.model('vm.credentials.username')).sendKeys('log$in');
      // Enter Password
      element(by.model('vm.credentials.password')).sendKeys(user1.password);
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Email address error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('Please enter a valid username: 3+ characters long, non restricted word, characters "_-.", no consecutive dots, does not begin or end with dots, letters a-z and numbers 0-9.');
    });

    it('Should signup username with . - "log.in"', function () {
      browser.get('http://localhost:3001/authentication/signup');
      // Enter First Name
      element(by.model('vm.credentials.firstName')).sendKeys(user2.firstName);
      // Enter Last Name
      element(by.model('vm.credentials.lastName')).sendKeys(user2.lastName);
      // Enter Email
      element(by.model('vm.credentials.email')).sendKeys('someemail@meanjs.com');
      // Enter Username
      element(by.model('vm.credentials.username')).sendKeys('log.in');
      // Enter Password
      element(by.model('vm.credentials.password')).sendKeys(user2.password);
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Signup successful with username having .
      expect(browser.getCurrentUrl()).toEqual('http://localhost:3001/');

      signout();
    });

    it('Should report missing username', function () {
      browser.get('http://localhost:3001/authentication/signup');
      // Enter First Name
      element(by.model('vm.credentials.firstName')).sendKeys(user1.firstName);
      // Enter Last Name
      element(by.model('vm.credentials.lastName')).sendKeys(user1.lastName);
      // Enter Email
      element(by.model('vm.credentials.email')).sendKeys(user1.email);
      // Enter Password
      element(by.model('vm.credentials.password')).sendKeys(user1.password);
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Username Error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('Username is required.');
    });

    it('Should report a password with less than 10 characters long - "P@$$w0rd!"', function () {
      browser.get('http://localhost:3001/authentication/signup');
      // Enter First Name
      element(by.model('vm.credentials.firstName')).sendKeys(user1.firstName);
      // Enter Last Name
      element(by.model('vm.credentials.lastName')).sendKeys(user1.lastName);
      // Enter Email
      element(by.model('vm.credentials.email')).sendKeys(user1.email);
      // Enter Username
      element(by.model('vm.credentials.username')).sendKeys(user1.username);
      // Enter Invalid Password
      element(by.model('vm.credentials.password')).sendKeys('P@$$w0rd!');
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Password Error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('The password must be at least 10 characters long.');
    });

    it('Should report a password with greater than 128 characters long.', function () {
      browser.get('http://localhost:3001/authentication/signup');
      // Enter First Name
      element(by.model('vm.credentials.firstName')).sendKeys(user1.firstName);
      // Enter Last Name
      element(by.model('vm.credentials.lastName')).sendKeys(user1.lastName);
      // Enter Email
      element(by.model('vm.credentials.email')).sendKeys(user1.email);
      // Enter Username
      element(by.model('vm.credentials.username')).sendKeys(user1.username);
      // Enter Invalid Password
      element(by.model('vm.credentials.password')).sendKeys(')!/uLT="lh&:`6X!]|15o!$!TJf,.13l?vG].-j],lFPe/QhwN#{Z<[*1nX@n1^?WW-%_.*D)m$toB+N7z}kcN#B_d(f41h%w@0F!]igtSQ1gl~6sEV&r~}~1ub>If1c+');
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Password Error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('The password must be fewer than 128 characters.');
    });

    it('Should report a password with more than 3 or more repeating characters - "P@$$w0rd!!!"', function () {
      browser.get('http://localhost:3001/authentication/signup');
      // Enter First Name
      element(by.model('vm.credentials.firstName')).sendKeys(user1.firstName);
      // Enter Last Name
      element(by.model('vm.credentials.lastName')).sendKeys(user1.lastName);
      // Enter Email
      element(by.model('vm.credentials.email')).sendKeys(user1.email);
      // Enter Username
      element(by.model('vm.credentials.username')).sendKeys(user1.username);
      // Enter Invalid Password
      element(by.model('vm.credentials.password')).sendKeys('P@$$w0rd!!!');
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Password Error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('The password may not contain sequences of three or more repeated characters.');
    });

    it('Should report a password with no uppercase letters - "p@$$w0rd!!"', function () {
      browser.get('http://localhost:3001/authentication/signup');
      // Enter First Name
      element(by.model('vm.credentials.firstName')).sendKeys(user1.firstName);
      // Enter Last Name
      element(by.model('vm.credentials.lastName')).sendKeys(user1.lastName);
      // Enter Email
      element(by.model('vm.credentials.email')).sendKeys(user1.email);
      // Enter Username
      element(by.model('vm.credentials.username')).sendKeys(user1.username);
      // Enter Invalid Password
      element(by.model('vm.credentials.password')).sendKeys('p@$$w0rd!!');
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Password Error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('The password must contain at least one uppercase letter.');
    });

    it('Should report a password with less than one number - "P@$$word!!"', function () {
      browser.get('http://localhost:3001/authentication/signup');
      // Enter First Name
      element(by.model('vm.credentials.firstName')).sendKeys(user1.firstName);
      // Enter Last Name
      element(by.model('vm.credentials.lastName')).sendKeys(user1.lastName);
      // Enter Email
      element(by.model('vm.credentials.email')).sendKeys(user1.email);
      // Enter Username
      element(by.model('vm.credentials.username')).sendKeys(user1.username);
      // Enter Invalid Password
      element(by.model('vm.credentials.password')).sendKeys('P@$$word!!');
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Password Error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('The password must contain at least one number.');
    });

    it('Should report a password with less than one special character - "Passw0rdss"', function () {
      browser.get('http://localhost:3001/authentication/signup');
      // Enter First Name
      element(by.model('vm.credentials.firstName')).sendKeys(user1.firstName);
      // Enter Last Name
      element(by.model('vm.credentials.lastName')).sendKeys(user1.lastName);
      // Enter Email
      element(by.model('vm.credentials.email')).sendKeys(user1.email);
      // Enter Username
      element(by.model('vm.credentials.username')).sendKeys(user1.username);
      // Enter Invalid Password
      element(by.model('vm.credentials.password')).sendKeys('Passw0rdss');
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Password Error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('The password must contain at least one special character.');
    });

    it('Should Successfully register new user', function () {
      browser.get('http://localhost:3001/authentication/signup');
      // Enter FirstName
      element(by.model('vm.credentials.firstName')).sendKeys(user1.firstName);
      // Enter LastName
      element(by.model('vm.credentials.lastName')).sendKeys(user1.lastName);
      // Enter Email
      element(by.model('vm.credentials.email')).sendKeys(user1.email);
      // Enter UserName
      element(by.model('vm.credentials.username')).sendKeys(user1.username);
      // Enter Password
      element(by.model('vm.credentials.password')).sendKeys(user1.password);
      // Click Submit button
      element(by.css('button[type="submit"]')).click();
      expect(browser.getCurrentUrl()).toEqual('http://localhost:3001/');
    });

    it('Should report Email already exists', function () {
      // Make sure user is signed out first
      signout();
      // Signup
      browser.get('http://localhost:3001/authentication/signup');
      // Enter First Name
      element(by.model('vm.credentials.firstName')).sendKeys(user2.firstName);
      // Enter Last Name
      element(by.model('vm.credentials.lastName')).sendKeys(user2.lastName);
      // Enter Email
      element(by.model('vm.credentials.email')).sendKeys(user1.email);
      // Enter Username
      element(by.model('vm.credentials.username')).sendKeys(user2.username);
      // Enter Invalid Password
      element(by.model('vm.credentials.password')).sendKeys(user2.password);
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Password Error
      expect(element.all(by.css('.message')).get(0).getText()).toBe('Email already exists');
    });

    it('Should report Username already exists', function () {
      // Signup
      browser.get('http://localhost:3001/authentication/signup');
      // Enter First Name
      element(by.model('vm.credentials.firstName')).sendKeys(user2.firstName);
      // Enter Last Name
      element(by.model('vm.credentials.lastName')).sendKeys(user2.lastName);
      // Enter Email
      element(by.model('vm.credentials.email')).sendKeys(user2.email);
      // Enter Username
      element(by.model('vm.credentials.username')).sendKeys(user1.username);
      // Enter Invalid Password
      element(by.model('vm.credentials.password')).sendKeys(user2.password);
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Password Error
      expect(element.all(by.css('.message')).get(0).getText()).toBe('Username already exists');
    });

  });

  describe('Signin Validation', function () {

    it('Should report missing credentials', function () {
      // Make sure user is signed out first
      signout();
      // Sign in
      browser.get('http://localhost:3001/authentication/signin');
      // Click Submit button
      element(by.css('button[type="submit"]')).click();
      // Username Error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('Username or Email is required.');
      // Password Error
      expect(element.all(by.css('.error-text')).get(1).getText()).toBe('Password is required.');
    });

    it('Verify that the user is logged in', function () {
      // Make sure user is signed out first
      signout();
      // Sign in
      browser.get('http://localhost:3001/authentication/signin');
      // Enter UserName
      element(by.model('vm.credentials.usernameOrEmail')).sendKeys(user1.username);
      // Enter Password
      element(by.model('vm.credentials.password')).sendKeys(user1.password);
      // Click Submit button
      element(by.css('button[type="submit"]')).click();
      expect(browser.getCurrentUrl()).toEqual('http://localhost:3001/');
    });

  });

  describe('Change Password Settings Validation', function () {

    it('Should report missing passwords', function () {
      browser.get('http://localhost:3001/settings/password');
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Password Errors
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('Your current password is required.');
      expect(element.all(by.css('.error-text')).get(1).getText()).toBe('Enter a new password.');
      expect(element.all(by.css('.error-text')).get(2).getText()).toBe('Verify your new password.');
    });

    it('Should report a password with less than 10 characters long - "P@$$w0rd!"', function () {
      browser.get('http://localhost:3001/settings/password');
      // Enter Current Password
      element(by.model('vm.passwordDetails.currentPassword')).sendKeys(user1.password);
      // Enter Invalid Password
      element(by.model('vm.passwordDetails.newPassword')).sendKeys('P@$$w0rd!');
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Password Error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('The password must be at least 10 characters long.');
    });

    it('Should report a password with greater than 128 characters long.', function () {
      browser.get('http://localhost:3001/settings/password');
      // Enter Current Password
      element(by.model('vm.passwordDetails.currentPassword')).sendKeys(user1.password);
      // Enter Invalid Password
      element(by.model('vm.passwordDetails.newPassword')).sendKeys(')!/uLT="lh&:`6X!]|15o!$!TJf,.13l?vG].-j],lFPe/QhwN#{Z<[*1nX@n1^?WW-%_.*D)m$toB+N7z}kcN#B_d(f41h%w@0F!]igtSQ1gl~6sEV&r~}~1ub>If1c+');
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Password Error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('The password must be fewer than 128 characters.');
    });

    it('Should report a password with more than 3 or more repeating characters - "P@$$w0rd!!!"', function () {
      browser.get('http://localhost:3001/settings/password');
      // Enter Current Password
      element(by.model('vm.passwordDetails.currentPassword')).sendKeys(user1.password);
      // Enter Invalid Password
      element(by.model('vm.passwordDetails.newPassword')).sendKeys('P@$$w0rd!!!');
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Password Error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('The password may not contain sequences of three or more repeated characters.');
    });

    it('Should report a password with no uppercase letters - "p@$$w0rd!!"', function () {
      browser.get('http://localhost:3001/settings/password');
      // Enter Current Password
      element(by.model('vm.passwordDetails.currentPassword')).sendKeys(user1.password);
      // Enter Invalid Password
      element(by.model('vm.passwordDetails.newPassword')).sendKeys('p@$$w0rd!!');
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Password Error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('The password must contain at least one uppercase letter.');
    });

    it('Should report a password with less than one number - "P@$$word!!"', function () {
      browser.get('http://localhost:3001/settings/password');
      // Enter Current Password
      element(by.model('vm.passwordDetails.currentPassword')).sendKeys(user1.password);
      // Enter Invalid Password
      element(by.model('vm.passwordDetails.newPassword')).sendKeys('P@$$word!!');
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Password Error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('The password must contain at least one number.');
    });

    it('Should report a password with less than one special character - "Passw0rdss"', function () {
      browser.get('http://localhost:3001/settings/password');
      // Enter Current Password
      element(by.model('vm.passwordDetails.currentPassword')).sendKeys(user1.password);
      // Enter Invalid Password
      element(by.model('vm.passwordDetails.newPassword')).sendKeys('Passw0rdss');
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Password Error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('The password must contain at least one special character.');
    });

    it('Should report passwords do not match', function () {
      browser.get('http://localhost:3001/settings/password');
      // Enter Current Password
      element(by.model('vm.passwordDetails.currentPassword')).sendKeys(user1.password);
      // Enter New Password
      element(by.model('vm.passwordDetails.newPassword')).sendKeys('P@$$w0rds!!');
      // Verify New Password
      element(by.model('vm.passwordDetails.verifyPassword')).sendKeys(user1.password);
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Password Errors
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('Passwords do not match.');
    });

    it('Should change the password to - "P@$$w0rds!!"', function () {
      browser.get('http://localhost:3001/settings/password');
      // Enter Current Password
      element(by.model('vm.passwordDetails.currentPassword')).sendKeys(user1.password);
      // Enter New Password
      element(by.model('vm.passwordDetails.newPassword')).sendKeys('P@$$w0rds!!');
      // Verify New Password
      element(by.model('vm.passwordDetails.verifyPassword')).sendKeys('P@$$w0rds!!');
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Password Changed
      expect(element.all(by.css('.ui-notification')).get(0).getText()).toBe('Password Changed Successfully');
    });
  });

  describe('Add recipe page', function () {

    it('must have enter recipe name', function () {
      browser.get('http://localhost:3001/add-recipe');
      // Enter cooking style
      element(by.model('recipe.cookingStyle')).sendKeys(recipe.method);
      // Enter preparation time
      element(by.model('recipe.time')).sendKeys(recipe.prepTime);
      // Select diet preference
      element(by.model('recipe.healthClassifications.glutenFree')).sendKeys(recipe.diet);
      element(by.model('recipe.healthClassifications.noSugar')).sendKeys(recipe.diet);
      element(by.model('recipe.healthClassifications.lowFat')).sendKeys(recipe.diet);
      element(by.model('recipe.healthClassifications.vegan')).sendKeys(recipe.diet);
      element(by.model('recipe.healthClassifications.lowCalorie')).sendKeys(recipe.diet);
      // Rate the recipe
      element(by.click('getStars(5)')).sendKeys(recipe.rate);
      // Enter ingredient(s) for the recipe
      element(by.model('recipe.ingredients[$index].name')).sendKeys(recipe.ingredientName);
      // Enter quantities for the ingredients
      element(by.model('recipe.ingredients[$index].quantity')).sendKeys(recipe.quantity);
      // Enter units of the quantities
      element(by.model('recipe.ingredients[$index].units')).sendKeys(recipe.units);
      // Enter steps for the recipe
      element(by.model('recipe.directionsList[$index].directions')).sendKeys(recipe.steps);
      // Click Healthify button
      element(by.css('button[type=submit]')).click();
      // Recipe name is entered
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('You must enter recipe name');
    });

    it('must have cooking style', function () {
      browser.get('http://localhost:3001/add-recipe');
      // Enter name of the recipe
      element(by.model('recipe.name')).sendKeys(recipe.enterRecipeName);
      // Enter preparation time
      element(by.model('recipe.time')).sendKeys(recipe.prepTime);
      // Select diet preference
      element(by.model('recipe.healthClassifications.glutenFree')).sendKeys(recipe.diet);
      // Rate the recipe
      element(by.click('getStars(5)')).sendKeys(recipe.rate);
      // Enter ingredient(s) for the recipe
      element(by.model('recipe.ingredients[$index].name')).sendKeys(recipe.ingredientName);
      // Enter quantities for the ingredients
      element(by.model('recipe.ingredients[$index].quantity')).sendKeys(recipe.quantity);
      // Enter units of the quantities
      element(by.model('recipe.ingredients[$index].units')).sendKeys(recipe.units);
      // Enter steps for the recipe
      element(by.model('recipe.directionsList[$index].directions')).sendKeys(recipe.steps);
      // Click Healthify button
      element(by.css('button[type=submit]')).click();
      // Cooking method is selected
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('You must select cooking style');
    });

    it('must have preparation time', function () {
      browser.get('http://localhost:3001/add-recipe');
      // Enter name of the recipe
      element(by.model('recipe.name')).sendKeys(recipe.enterRecipeName);
      // Enter cooking style
      element(by.model('recipe.cookingStyle')).sendKeys(recipe.method);
      // Select diet preference
      element(by.model('recipe.healthClassifications.glutenFree')).sendKeys(recipe.diet);
      // Rate the recipe
      element(by.click('getStars(5)')).sendKeys(recipe.rate);
      // Enter ingredient(s) for the recipe
      element(by.model('recipe.ingredients[$index].name')).sendKeys(recipe.ingredientName);
      // Enter quantities for the ingredients
      element(by.model('recipe.ingredients[$index].quantity')).sendKeys(recipe.quantity);
      // Enter units of the quantities
      element(by.model('recipe.ingredients[$index].units')).sendKeys(recipe.units);
      // Enter steps for the recipe
      element(by.model('recipe.directionsList[$index].directions')).sendKeys(recipe.steps);
      // Click Healthify button
      element(by.css('button[type=submit]')).click();
      // Cooking method is selected
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('You must enter preparation time');
    });

    it('must have health classification', function () {
      browser.get('http://localhost:3001/add-recipe');
      // Enter name of the recipe
      element(by.model('recipe.name')).sendKeys(recipe.enterRecipeName);
      // Enter cooking style
      element(by.model('recipe.cookingStyle')).sendKeys(recipe.method);
      // Enter preparation time
      element(by.model('recipe.time')).sendKeys(recipe.prepTime);
      // Rate the recipe
      element(by.click('getStars(5)')).sendKeys(recipe.rate);
      // Enter ingredient(s) for the recipe
      element(by.model('recipe.ingredients[$index].name')).sendKeys(recipe.ingredientName);
      // Enter quantities for the ingredients
      element(by.model('recipe.ingredients[$index].quantity')).sendKeys(recipe.quantity);
      // Enter units of the quantities
      element(by.model('recipe.ingredients[$index].units')).sendKeys(recipe.units);
      // Enter steps for the recipe
      element(by.model('recipe.directionsList[$index].directions')).sendKeys(recipe.steps);
      // Click Healthify button
      element(by.css('button[type=submit]')).click();
      // Cooking method is selected
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('You must select diet preferences');
    });

    it('must rate the recipe', function () {
      browser.get('http://localhost:3001/add-recipe');
      // Enter name of the recipe
      element(by.model('recipe.name')).sendKeys(recipe.enterRecipeName);
      // Enter cooking style
      element(by.model('recipe.cookingStyle')).sendKeys(recipe.method);
      // Enter preparation time
      element(by.model('recipe.time')).sendKeys(recipe.prepTime);
      // Select diet preference
      element(by.model('recipe.healthClassifications.glutenFree')).sendKeys(recipe.diet);
      // Enter ingredient(s) for the recipe
      element(by.model('recipe.ingredients[$index].name')).sendKeys(recipe.ingredientName);
      // Enter quantities for the ingredients
      element(by.model('recipe.ingredients[$index].quantity')).sendKeys(recipe.quantity);
      // Enter units of the quantities
      element(by.model('recipe.ingredients[$index].units')).sendKeys(recipe.units);
      // Enter steps for the recipe
      element(by.model('recipe.directionsList[$index].directions')).sendKeys(recipe.steps);
      // Click Healthify button
      element(by.css('button[type=submit]')).click();
      // Cooking method is selected
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('You must rate the recipe');
    });

    it('must enter ingredient name', function () {
      browser.get('http://localhost:3001/add-recipe');
      // Enter name of the recipe
      element(by.model('recipe.name')).sendKeys(recipe.enterRecipeName);
      // Enter cooking style
      element(by.model('recipe.cookingStyle')).sendKeys(recipe.method);
      // Enter preparation time
      element(by.model('recipe.time')).sendKeys(recipe.prepTime);
      // Select diet preference
      element(by.model('recipe.healthClassifications.glutenFree')).sendKeys(recipe.diet);
      // Rate the recipe
      element(by.click('getStars(5)')).sendKeys(recipe.rate);
      // Enter quantities for the ingredients
      element(by.model('recipe.ingredients[$index].quantity')).sendKeys(recipe.quantity);
      // Enter units of the quantities
      element(by.model('recipe.ingredients[$index].units')).sendKeys(recipe.units);
      // Enter steps for the recipe
      element(by.model('recipe.directionsList[$index].directions')).sendKeys(recipe.steps);
      // Click Healthify button
      element(by.css('button[type=submit]')).click();
      // Cooking method is selected
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('You must enter ingredient(s) name');
    });

    it('must enter quantity of the ingredient', function () {
      browser.get('http://localhost:3001/add-recipe');
      // Enter name of the recipe
      element(by.model('recipe.name')).sendKeys(recipe.enterRecipeName);
      // Enter cooking style
      element(by.model('recipe.cookingStyle')).sendKeys(recipe.method);
      // Enter preparation time
      element(by.model('recipe.time')).sendKeys(recipe.prepTime);
      // Select diet preference
      element(by.model('recipe.healthClassifications.glutenFree')).sendKeys(recipe.diet);
      // Rate the recipe
      element(by.click('getStars(5)')).sendKeys(recipe.rate);
      // Enter ingredient(s) for the recipe
      element(by.model('recipe.ingredients[$index].name')).sendKeys(recipe.ingredientName);
      // Enter units of the quantities
      element(by.model('recipe.ingredients[$index].units')).sendKeys(recipe.units);
      // Enter steps for the recipe
      element(by.model('recipe.directionsList[$index].directions')).sendKeys(recipe.steps);
      // Click Healthify button
      element(by.css('button[type=submit]')).click();
      // Cooking method is selected
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('You must enter a quantity');
    });

    it('must enter units of the ingredient', function () {
      browser.get('http://localhost:3001/add-recipe');
      // Enter name of the recipe
      element(by.model('recipe.name')).sendKeys(recipe.enterRecipeName);
      // Enter cooking style
      element(by.model('recipe.cookingStyle')).sendKeys(recipe.method);
      // Enter preparation time
      element(by.model('recipe.time')).sendKeys(recipe.prepTime);
      // Select diet preference
      element(by.model('recipe.healthClassifications.glutenFree')).sendKeys(recipe.diet);
      // Rate the recipe
      element(by.click('getStars(5)')).sendKeys(recipe.rate);
      // Enter ingredient(s) for the recipe
      element(by.model('recipe.ingredients[$index].name')).sendKeys(recipe.ingredientName);
      // Enter quantities for the ingredients
      element(by.model('recipe.ingredients[$index].quantity')).sendKeys(recipe.quantity);
      // Enter steps for the recipe
      element(by.model('recipe.directionsList[$index].directions')).sendKeys(recipe.steps);
      // Click Healthify button
      element(by.css('button[type=submit]')).click();
      // Cooking method is selected
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('You must select a unit');
    });

    it('must enter steps on how to make the recipe', function () {
      browser.get('http://localhost:3001/add-recipe');
      // Enter name of the recipe
      element(by.model('recipe.name')).sendKeys(recipe.enterRecipeName);
      // Enter cooking style
      element(by.model('recipe.cookingStyle')).sendKeys(recipe.method);
      // Enter preparation time
      element(by.model('recipe.time')).sendKeys(recipe.prepTime);
      // Select diet preference
      element(by.model('recipe.healthClassifications.glutenFree')).sendKeys(recipe.diet);
      // Rate the recipe
      element(by.click('getStars(5)')).sendKeys(recipe.rate);
      // Enter ingredient(s) for the recipe
      element(by.model('recipe.ingredients[$index].name')).sendKeys(recipe.ingredientName);
      // Enter quantities for the ingredients
      element(by.model('recipe.ingredients[$index].quantity')).sendKeys(recipe.quantity);
      // Enter units of the quantities
      element(by.model('recipe.ingredients[$index].units')).sendKeys(recipe.units);
      // Click Healthify button
      element(by.css('button[type=submit]')).click();
      // Cooking method is selected
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('You must enter direction on how to make the recipe');
    });
  });

});
