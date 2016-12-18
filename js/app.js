// Vue Routes

var home = { template: '#home' },
    work = { template: '#work' },
    process = { template: '#process' },
    about = { template: '#about' },
    leadAccelerator = { template: '#lead-accelerator' },
    routes = [
      { path: '/', component: home, meta: { project: false } },
      { path: '/work', component: work, meta: { project: false } },
      { path: '/process', component: process, meta: { project: false } },
      { path: '/about', component: about, meta: { project: false } },
      { path: '/work/lead-accelerator', component: leadAccelerator, meta: { project: true, title: 'Lead Accelerator' }}
    ],
    router = new VueRouter({
      routes
    });

router.afterEach(function () {
  scroll(0,0);
});

// Nav

Vue.component('nav-bar', {
  template: '#nav'
});

// Greeting on About page

Vue.component('greeting', {
  template: '<h2>{{ message() }}</h2>',
  methods: {
    message: function () {
      var hour = new Date().getHours();
      if (hour < 12) {
        return 'Good morning';
      } else if (hour < 18) {
        return 'Good afternoon';
      } else {
        return 'Good evening';
      }
    }
  }
});

// Create Vue App

var app = new Vue({
  el: '#app',
  router
});

// Headroom JS

var navElement = document.querySelector('.nav-bar'),
    headroom = new Headroom(navElement);

headroom.offset = 56;
headroom.init();