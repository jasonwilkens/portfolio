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

const app = new Vue({
  router
}).$mount('#app');