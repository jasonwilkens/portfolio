// Vue Routes

var home = { template: '#home' },
    work = { template: '#work' },
    process = { template: '#process' },
    about = { template: '#about' },
    leadAccelerator = { template: '#lead-accelerator' }
    routes = [
      { path: '/', component: home, meta: { project: false } },
      { path: '/work', component: work, meta: { project: false } },
      { path: '/process', component: process, meta: { project: false } },
      { path: '/about', component: about, meta: { project: false } },
      { path: '/work/lead-accelerator', component: leadAccelerator, meta: { project: true }}
    ],
    router = new VueRouter({
      routes
    });

router.afterEach(function () {
  scroll(0,0);
});

// Nav

var isProjectVariable,
    projectTitle
    projectTitleMap = {
      leadAccelerator: 'Lead Accelerator'
    };

router.beforeEach(function (to, from, next) {
  isProjectVariable = to.meta.project;
  next();
});

Vue.component('nav-bar', {
  props: ['isProjectProp'],
  template: '#nav'
});

// Greeting

var date = new Date(),
    hour = date.getHours(),
    greeting = function () {
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

var app = new Vue({ router, data: { isProjectRoot: isProjectVariable }, }).$mount('#app');

// Headroom JS

var navElement = document.querySelector('.nav-bar'),
    headroom = new Headroom(navElement);

headroom.init();