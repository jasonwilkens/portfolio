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
    rows = generateRows();


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
        if (this.rows.find(function (row) {
          return row.id === rowObj.campaignId;
        }).display === "collapsed") {
          return false;
        } else {
          return true;
        }
      } else if (rowObj.level === 'creative') {
        if (this.rows.find(function (row) {
            return row.id === rowObj.messageId;
          }).display === "collapsed" ||
          this.rows.find(function (row) {
            return row.id === rowObj.campaignId;
          }).display === "collapsed") {
            return false;
        } else {
          return true;
        }
      }
    },
    toggleRow: function(e) {
      var targetRow = this.rows.findIndex(function (row) {
        return row.id === e.target.closest("a.row-toggle").dataset.id;
      });
      this.rows[targetRow].display === 'expanded' ?
        this.rows[targetRow].display = 'collapsed' :
        this.rows[targetRow].display = 'expanded';
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