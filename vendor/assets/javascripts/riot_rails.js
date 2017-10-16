;(function($) {

  var riotRails = {
    componentSelector: '[data-riot]',
    mounted: [],
    mount: function(component) {
      var mounted, id, generated;
      var opts = component.data('opts');
      var id = component.attr('id') || 'riot-' + Math.floor((Math.random() * 10000000));

      component.attr('id', id);

      component.removeAttr('data-opts');
      component.removeAttr('data-riot');

      mounted = riot.mount('#' + id, opts);
      this.mounted.concat(mounted);
    },
    unmountAll: function () {
      $.each(this.mounted, function(index, component) {
        component.unmount();
      });
      this.mounted = [];
    },
    mountAll: function() {
      var self = this;
      $(self.componentSelector).each(function(){
        self.mount($(this));
      });
    }
  };

  var handleNativePageLoad = function () {
    $(function() {
      riotRails.mountAll();
    });
  };

  var handleTurbolinksPageLoad = function () {
    var unmountEvent;
    var mountEvent;

    if (typeof Turbolinks.EVENTS !== 'undefined') {
      // Turbolinks.EVENTS is in classic version 2.4.0+
      mountEvent = 'page:change';
      unmountEvent = Turbolinks.EVENTS.BEFORE_UNLOAD;
    } else if (typeof Turbolinks.controller !== "undefined") {
      // Turbolinks.controller is in version 5+
      mountEvent = "turbolinks:load";
      unmountEvent = "turbolinks:before-cache";
    } else {
      mountEvent = 'page:change';
      unmountEvent = 'page:receive';
      Turbolinks.pagesCached(0);
      if (window.ReactRailsUJS.RAILS_ENV_DEVELOPMENT) {
        console.warn('The Turbolinks cache has been disabled (Turbolinks >= 2.4.0 is recommended).');
      }
    }

    $(document).on(mountEvent, function(){
      riotRails.mountAll();
    });

    $(document).on(unmountEvent, function(){
      riotRails.unmountAll();
    });

  };

  if (typeof Turbolinks !== 'undefined' && Turbolinks.supported) {
    handleTurbolinksPageLoad();
  } else {
    handleNativePageLoad();
  }

})(jQuery);
