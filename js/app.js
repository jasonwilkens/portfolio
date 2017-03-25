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
      { name: 'home', path: '/', component: home, meta: { project: false } },
      { name: 'work', path: '/work', component: work, meta: { project: false, visited: false } },
      { name: 'process', path: '/process', component: process, meta: { project: false, visited: false } },
      { name: 'about', path: '/about', component: about, meta: { project: false, visited: false } },
      { name: 'contact', path: '/contact', component: contact, meta: { project: false, visited: false } },
      { name: 'leadAccelerator', path: '/work/lead-accelerator', component: leadAccelerator, meta: { project: true, title: 'LinkedIn: Lead Accelerator' }},
      { name: 'madRiver', path: '/work/mad-river', component: madRiver, meta: { project: true, title: 'LinkedIn: Mad River' }},
      { name: 'leadAds', path: '/work/lead-ads', component: leadAds, meta: { project: true, title: 'LinkedIn: Lead Ads' }},
      { name: 'multichannelNurturing', path: '/work/multichannel-nurturing', component: multichannelNurturing, meta: { project: true, title: 'Bizo: Multichannel Nurturing' }},
      { name: 'analytics', path: '/work/analytics', component: analytics, meta: { project: true, title: 'Bizo: Analytics' }},
      { name: 'buildingProducts', path: '/work/building-products', component: buildingProducts, meta: { project: true, title: 'Bizo: Building Products' }},
      { name: 'coverageCounselor', path: '/work/coverage-counselor', component: coverageCounselor, meta: { project: true, title: 'Esurance: Coverage Counselor' }},
      { name: 'quickCompare', path: '/work/quick-compare', component: quickCompare, meta: { project: true, title: 'Esurance: Quick Compare' }},
      { name: 'customerFlow', path: '/work/customer-flow', component: customerFlow, meta: { project: true, title: 'Esurance: Customer Flow' }}
    ],
    router = new VueRouter({
      routes
    }),
    campaigns = [
      {
        key: "Campaign 1",
        id: "001",
        display: "expanded",
        messages: [
          {
            key: "Message 1",
            id: "001A",
            display: "expanded",
            creatives: [
              {key: "Creative 1", metric1: 1, metric2: 2},
              {key: "Creative 2", metric1: 1, metric2: 2}
            ]
          },
          {
            key: "Message 2",
            id: "001B",
            display: "collapsed",
            creatives: [
              {key: "Creative 3", metric1: 1, metric2: 2}
            ]
          }
        ]
      },
      {
        key: "Campaign 2",
        id: "002",
        display: "collapsed",
        messages: [
          {
            key: "Message 3",
            id: "002A",
            display: "collapsed",
            creatives: [
              {key: "Creative 4", metric1: 1, metric2: 2}
            ]
          }
        ]
      }
    ],
    currentMetric = '',
    generateRows = function() {
      var tableRows = [],
          that = this;
      this.campaigns.forEach(function(campaign) {
        tableRows.push({
          level: 'campaign',
          key: campaign.key,
          id: campaign.id,
          display: campaign.display,
          metric1: that.getCampaignMetrics(campaign.messages, 'metric1'),
          metric2: that.getCampaignMetrics(campaign.messages, 'metric2')
        });
        campaign.messages.forEach(function(message) {
          tableRows.push({
            level: 'message',
            key: message.key,
            id: message.id,
            campaignId: campaign.id,
            display: message.display,
            metric1: that.getMessageMetrics(message.creatives, 'metric1'),
            metric2: that.getMessageMetrics(message.creatives, 'metric2')
          });
          message.creatives.forEach(function(creative) {
            tableRows.push({
              level: 'creative',
              key: creative.key,
              campaignId: campaign.id,
              messageId: message.id,
              metric1: creative.metric1,
              metric2: creative.metric2
            });
          });
        });
      });
      return tableRows;
    },
    getCampaignMetrics = function(messages, metric) {
      var campaignTotal = 0,
          that = this;
      messages.forEach(function(message) {
        campaignTotal += that.getMessageMetrics(message.creatives, metric);
      });
      return campaignTotal;
    },
    getMessageMetrics = function(creatives, metric) {
      var that = this,
          messageTotal;
      that.currentMetric = metric;

      if (creatives.length > 1) {
        messageTotal = creatives.reduce(function(a,b) {
          return a[that.currentMetric] + b[that.currentMetric];
        });
      } else {
        messageTotal = creatives[0][metric];
      }
      return messageTotal;
    },
    rows = generateRows(),
    tracking = JSON.parse(localStorage.getItem('tracking')) || [
      { name: 'work', visited: false },
      { name: 'process', visited: false },
      { name: 'about', visited: false },
      { name: 'contact', visited: false }
    ];


router.afterEach(function() {
  scroll(0,0);
});

router.beforeEach(function(to, from, next) {
  if (to.meta.visited === false) {
    to.meta.visited = true;
    tracking.find(function(page) {
      return page.name === to.name;
    }).visited = true;
    localStorage.setItem('tracking', JSON.stringify(tracking));
  }
  next();
});

// Nav

Vue.component('nav-bar', {
  template: '#nav'
});

// Greeting on About page

Vue.component('greeting', {
  template: '<h2>{{ message() }}</h2>',
  methods: {
    message: function() {
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

// Hierarchical table on Process page

Vue.component('hierarchical-table', {
  data: function() {
    var data = {};
    data.rows = rows;
    return data;
  },
  template: '#hierarchical-table',
  methods: {
    findRowspan: function(rowObj) {
      var rowSpan = 1,
          messageRows = 0,
          creativesVisible = 0,
          campaignMessages,
          expandedMessages,
          that = this;
      if (rowObj.level === 'campaign' && rowObj.display === 'expanded') {
        campaignMessages = this.rows.filter(function(row) {
          return row.campaignId === rowObj.id && row.level === 'message';
        });
        messageRows = campaignMessages.length;
        expandedMessages = campaignMessages.filter(function(message) {
          return message.display === 'expanded';
        });
        expandedMessages.forEach(function(message) {
          creativesVisible += that.rows.filter(function(row) { return row.messageId === message.id }).length;
        });
      } else if (rowObj.level === 'message' && rowObj.display === 'expanded') {
        creativesVisible += this.rows.filter(function(row) { return row.messageId === rowObj.id }).length;
      }
      rowSpan += messageRows + creativesVisible;
      return rowSpan;
    },
    showExpanded: function(rowObj) {
      if (rowObj.level === 'campaign') {
        return true;
      }
      if (rowObj.level === 'message') {
        if (this.rows.find(function(row) {
          return row.id === rowObj.campaignId;
        }).display === "collapsed") {
          return false;
        } else {
          return true;
        }
      } else if (rowObj.level === 'creative') {
        if (this.rows.find(function(row) {
            return row.id === rowObj.messageId;
          }).display === "collapsed" ||
          this.rows.find(function(row) {
            return row.id === rowObj.campaignId;
          }).display === "collapsed") {
            return false;
        } else {
          return true;
        }
      }
    },
    toggleRow: function(e) {
      if (e.target.closest("a.row-toggle")) {
        var targetRow = this.rows.findIndex(function(row) {
          return row.id === e.target.closest("a.row-toggle").dataset.id;
        });
        this.rows[targetRow].display === 'expanded' ?
          this.rows[targetRow].display = 'collapsed' :
          this.rows[targetRow].display = 'expanded';
      }
    }
  }
});

// Contact form

Vue.component('contact-form', {
  data: function() {
    var data = {
      feedback: sessionStorage.getItem('feedback') || 'feedback',
      formToggle: sessionStorage.getItem('formToggle') === 'false' ?
        JSON.parse(sessionStorage.getItem('formToggle')) : true,
      reset: 'Reset',
      requestObj: {
        access_token: '4srogcyl8xak9nd11qmgo6tq',
        subject: '',
        text: ''
      }
    };
    return data;
  },
  template: '#contact-form',
  methods: {
    createParams: function() {
      var formData = [];
      for (var key in this.requestObj) {
        formData.push(encodeURIComponent(key) + '=' + encodeURIComponent(this.requestObj[key]));
      }
      return formData.join('&');
    },
    escape: function(e) {
      e.target.blur();
    },
    toggleForm: function() {
      this.formToggle = !this.formToggle;
      sessionStorage.setItem('formToggle', this.formToggle);
      sessionStorage.setItem('feedback', this.feedback);
    },
    send: function(e) {
      var sendButton = e.target,
          subject = 'New message from ' + document.querySelector('#form-element [name="email"]').value,
          textarea = document.querySelector('#form-element [name="message"]'),
          text = textarea.value,
          params,
          request = new XMLHttpRequest(),
          that = this;
      if (text === '') {
        textarea.setAttribute('placeholder', 'Your message can\'t be empty');
        textarea.className = 'error';
        return;
      }
      sendButton.disabled = true;
      request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
          that.onSuccess(request.response);
        } else if (request.readyState == 4) {
          that.onError(request.response);
        }
      }
      this.requestObj.subject = subject;
      this.requestObj.text = text;
      params = this.createParams();

      request.open('POST', 'https://postmail.invotes.com/send', true);
      request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      request.send(params);
    },
    onError: function(response) {
      this.feedback = 'There\'s a problem: ' + response;
      this.reset = 'Try again';
      this.toggleForm();
    },
    onSuccess: function() {
      this.feedback = 'I\'ve got your message. Thanks for reaching out!';
      this.reset = 'Reset';
      this.toggleForm();
    },
    validateText: function(e) {
      if (e.target.value !== '') {
        e.target.className = '';
        e.target.setAttribute('placeholder', 'Write a message');
      }
    }
  }
});

// Guide

Vue.component('guide', {
  data: function() {
    var data = {},
        content = [
          {
            title: 'Work',
            to: '/work',
            description: 'Check out ',
            link: 'some of my past projects.'
          },
          {
            title: 'Process',
            to: '/process',
            description: 'I wrote down my thoughts on ',
            link: 'building products.'
          },
          {
            title: 'About',
            to: '/about',
            description: 'Designers are different. ',
            link: 'Here\'s what I\'m good at.'
          },
          {
            title: 'Contact',
            to: '/contact',
            description: 'You\'ve seen most of my site. Want to ',
            link: 'get in touch?'
          },
          {
            title: 'Wow',
            to: '/',
            description: 'Thanks for checking everything out!',
            link: ''
          }
        ];
    data.content = content;
    data.routes = routes;
    data.tracking = tracking;
    return data;
  },
  template: '#guide',
  methods: {
    routeVisited: function(trackingIndex) {
      return this.tracking[trackingIndex].visited ? 'visited' : 'unvisited';
    },
    suggested: function(contentType) {
      return this.contentIndex === -1 ?
        this.content[4][contentType] :
        this.content[this.contentIndex][contentType];
    }
  },
  computed: {
    contentIndex: function() {
      return this.tracking.findIndex(function(page) {
        return page.visited === false;
      });
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