// Vue Routes

var home = { template: '#home' },
    work = { template: '#work' },
    process = { template: '#process' },
    about = { template: '#about' },
    contact = { template: '#contact' },
    leadAccelerator = { template: '#lead-accelerator' },
    madRiver = { template: '#mad-river' },
    leadAds = { template: '#lead-ads' },
    multichannelNurturing = { template: '#multichannel-nurturing' },
    analytics = { template: '#analytics' },
    buildingProducts = { template: '#building-products' },
    coverageCounselor = { template: '#coverage-counselor' },
    quickCompare = { template: '#quick-compare' },
    customerFlow = { template: '#customer-flow' },
    routes = [
      { path: '/', component: home, meta: { project: false } },
      { path: '/work', component: work, meta: { project: false } },
      { path: '/process', component: process, meta: { project: false } },
      { path: '/about', component: about, meta: { project: false } },
      { path: '/contact', component: contact, meta: { project: false } },
      { path: '/work/lead-accelerator', component: leadAccelerator, meta: { project: true, title: 'LinkedIn: Lead Accelerator' }},
      { path: '/work/mad-river', component: madRiver, meta: { project: true, title: 'LinkedIn: Mad River' }},
      { path: '/work/lead-ads', component: leadAds, meta: { project: true, title: 'LinkedIn: Lead Ads' }},
      { path: '/work/multichannel-nurturing', component: multichannelNurturing, meta: { project: true, title: 'Bizo: Multichannel Nurturing' }},
      { path: '/work/analytics', component: analytics, meta: { project: true, title: 'Bizo: Analytics' }},
      { path: '/work/building-products', component: buildingProducts, meta: { project: true, title: 'Bizo: Building Products' }},
      { path: '/work/coverage-counselor', component: coverageCounselor, meta: { project: true, title: 'Esurance: Coverage Counselor' }},
      { path: '/work/quick-compare', component: quickCompare, meta: { project: true, title: 'Esurance: Quick Compare' }},
      { path: '/work/customer-flow', component: customerFlow, meta: { project: true, title: 'Esurance: Customer Flow' }}
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