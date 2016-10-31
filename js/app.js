// Vue Routes

const Home = { template: '#home' };
const Work = { template: '#work' };
const Process = { template: '#process' };
const About = { template: '#about' };

const routes = [
  { path: '/', component: Home },
  { path: '/work', component: Work },
  { path: '/process', component: Process },
  { path: '/about', component: About }
];

const router = new VueRouter({
  routes
})

router.afterEach(() => {
  scroll(0,0);
})

// Create Vue App

const app = new Vue({
  router
}).$mount('#app');

const navElement = document.querySelector(".nav-bar");
const headroom = new Headroom(navElement);
headroom.init();