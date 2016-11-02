// Vue Routes

var Home = { template: '#home' };
var Work = { template: '#work' };
var Process = { template: '#process' };
var About = { template: '#about' };

var routes = [
  { path: '/', component: Home },
  { path: '/work', component: Work },
  { path: '/process', component: Process },
  { path: '/about', component: About }
];

var router = new VueRouter({
  routes
});

router.afterEach(function () {
  scroll(0,0);
});

// Greeting

var date = new Date();
var hour = date.getHours();
var greeting = function () {
  if (hour < 12) {
    return 'Good morning';
  } else if (hour < 18) {
    return 'Good afternoon';
  } else {
    return 'Good evening';
  }
};

Vue.component('greeting', {
  template: '<h2>{{ message }}</h2>',
  data: function () {
    return {
      message: greeting()
    };
  }
});

// Create Vue App

var app = new Vue({ router }).$mount('#app');

// Headroom JS

var navElement = document.querySelector('.nav-bar');
var headroom = new Headroom(navElement);
headroom.init();