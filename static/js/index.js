function getRandomInt(max){
    var randomNum = 1 + parseInt(Math.floor(Math.random() * max));
    return randomNum;
}

Vue.component('customer', {
    props: ['customer'],
    template: '\
            \
            <div>\
                Customer\
                    <img v-bind:src="customer.url" width="64px"/>\
            </div>\
    ',
    data: function(){
        return {}
    }
});

Vue.component('staff-member', {
    props: ['staff'],
    template: '\
            <div>\
                Staff\
                <img v-bind:src="staff.url" width="128px"/>\
                <div v-if="staff.customer">\
                    <img v-bind:src="staff.customer.url" width="56px" />\
                </div>\
            </div>\
    ',
    data: function(){
        return {
            'customer': null,
        }
    }
});

var app = new Vue({
    el: '#app',
    data: {
        // Staff
        workingStaff: [],
        availableStaff: [],

        // Customers
        customerQueue: [],
        dissatisfiedCustomers: [],

        // Management
        interviewees: [],
        rejectedInterviewees: [],

        // Rates and metrics
        periodLengthMs: 3000,
        maxNewCustomersPerPeriod: 3,
        timeToServe: 3,

    },
    mounted: function(){
        this.setup();
    },
    },
    methods: {

    }
});