(function () {
  'use strict';

  describe('addRecipe Controller Tests', function () {
    var addRecipe;
    var zero = 0;
    var lessThanZero = ['-1', '-2', '-3', '-4', '-5', '-6', '-7', '-8', '-9', '-10', '-11', '-12', '-13', '-14', '-15', '-16', '-17', '-18', '-19', '-20',
                       '-21', '-22', '-23', '-24', '-25'];

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    beforeEach(function () {
      //stub - implementation of an interface that exists to provide data or a response 
      //creating a stub and assigning an event (healthify)
      this.clickableOrNot = sinon.stub(this, 'clickHealthify');
    });

    //restoring to original state
    afterEach(function () {
      this.clickHealthify.restore();
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function (_addRecipe_) {
      addRecipe = _addRecipe_;

       // Spy on Notification
      spyOn(clickableOrNot, 'success');
    }));

  //  console.log("Hello");
    describe('addRecipe page', function(){
      it('should not allow a negative values for quantity', inject(function (){
        expect(lessThanZero.all()).toBeLessThan(zero);
        expect(zero).not.toBeLessThan(lessThanZero.all());
      }));

      it('should able to click on Healthify', inject(function (){
        //trigger the event to see if it was called
        this.elem.trigger('clicked');
        expect(this.clickableOrNot.success).toHaveBeenCalled();
      }));
    });



      // Ignore parent template gets on state transition
      // $httpBackend.whenGET('/modules/core/client/views/home.client.view.html').respond(200);
      // $httpBackend.whenGET('/modules/core/client/views/400.client.view.html').respond(200);

    });
}());