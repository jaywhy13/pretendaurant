function getRandomInt(max){
    var randomNum = 1 + parseInt(Math.floor(Math.random() * max));
    return randomNum;
}

function getRandomIntBetween(min, max){
    var randomNum = min + getRandomInt(max);
    return randomNum;
}

Vue.component('customer', {
    props: ['customer'],
    template: `
        <div class="customer" v-bind:class="{impatient: customer.impatient }">
                <img v-bind:src="customer.url" width="64px"/>
        </div>
    `,
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
        setup: function(){
            this.addStartingStaff();
            setInterval(this.addCustomers, this.periodLengthMs);
        },

        addCustomerToQueue: function(){
            var randomNum = getRandomInt(27);
            var customer = {
                'url': '/static/img/' + randomNum + '.svg',
            };
            // console.log("Adding customer", customer);
            this.customerQueue.push(customer);
        },

        addCustomers: function(){
            var numCustomers = getRandomInt(this.maxNewCustomersPerPeriod);
            for(var i = 0; i < numCustomers; i++){
                this.addCustomerToQueue();
            }
        },

        addStartingStaff: function(){
            var numStaff = getRandomInt(3);
            console.log("Adding", numStaff, "starting staff");
            for(var i = 0; i < numStaff; i++){
                this.addStaff();
            }

            var workingStaff = getRandomInt(numStaff);
            for(var i = 0; i < numStaff; i++){
                this.addWorkingStaff();
            }
        },

        addStaff: function(){
            this.availableStaff.push({
                'url': '/static/img/staff' + getRandomInt(9) + '.svg',
                'customer': null,
            });
        },


        addWorkingStaff: function(){
            if(this.availableStaff.length > 0){
                var staff = this.availableStaff.shift();
                this.workingStaff.push(staff);
            }
        },

        serveCustomer: function(){
            if(this.customerQueue.length > 0){
                console.log("Going to try and serve a customer, we have", this.customerQueue.length, "waiting customers and", this.workingStaff.length, "working staff");
                for(var i = 0; i < this.workingStaff.length; i++){
                    var staff = this.workingStaff[i];
                    if(staff.customer == null){
                        var customer = this.customerQueue.shift();
                        console.log("Assigning", customer, "to", staff);
                        staff.customer = customer;
                        setTimeout(function(){
                            staff.customer = null;
                            app.$emit("customer-served");
                        }, app.timeToServe * app.periodLengthMs);
                        break;
                    } else {
                    }
                }
            }
        },
    },
    watch: {
        customerQueue: function(){
            this.serveCustomer();
        }
    }
});

