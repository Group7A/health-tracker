(function () {
  'use strict';

  describe('Search controller Tests', function () {
    var search;

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
      //creating a stub and assigning an event (item view)
      this.clickableOrNot = sinon.stub(this, 'clickItemView');
      this.clickComparison = sinon.stub(this, 'clickComparisonView');
      this.clickimg = sinon.stub(this, 'clickImg');
    });

    //restoring to original state
    afterEach(function () {
      this.clickItemView.restore();
      this.clickComparisonView.restore();
      this.clickImg.restore();
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function (_search_) {
      search = _search_;

       // Spy on Notification
      spyOn(clickableOrNot, 'success');
      spyOn(clickComparison, 'success');
      spyOn(clickImg, 'success');
    }));

    describe('Users', function(){
      it('should able to click on item view', inject(function (){
        //trigger the event to see if it was called
        this.elem.trigger('clicked');
        expect(this.clickableOrNot.success).toHaveBeenCalled();
      }));
      it('should able to click on comparison view', inject(function (){
        this.elem.trigger('clicked');
        expect(this.clickComparison.success).toHaveBeenCalled();
      }));
      it('should able to click on the picture', inject(function (){
        this.elem.trigger('clicked');
        expect(this.clickimg.success).toHaveBeenCalled();
      }));
    });

    });
}());