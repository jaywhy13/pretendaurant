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
        workers: [],
        customers: [],
        interviewees: [],
        rejectedInterviewees: [],
    },
    methods: {

    }
});