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

Vue.component('cashier', {
    props: ['staff'],
    template: `
            <div class="cashier">
                <img v-bind:src="staff.url" width="128px"/>
                <div class='staff-statistics'>
                    <div class="staff-statistic accuracy">
                        <span>Accuracy</span>
                        <div class="progress">
                            <div class="progress-bar" role="progressbar"
                                v-bind:aria-valuenow="staff.accuracy"
                                v-bind:aria-valuemin="0"
                                v-bind:aria-valuemax="10"
                                v-bind:style="{width: (10 * staff.accuracy) + '%'}"
                                >
                            </div>
                        </div>
                    </div>        

                    <div class="staff-statistic speed">
                        <span>Speed</span>
                        <div class="progress">
                            <div class="progress-bar" role="progressbar"
                                v-bind:aria-valuenow="staff.speed"
                                v-bind:aria-valuemin="0"
                                v-bind:aria-valuemax="10"
                                v-bind:style="{width: (10 * staff.speed) + '%'}"
                                >
                            </div>
                        </div>
                    </div>        

                    <div class="staff-statistic staff-orders">
                        <span>Orders Served: </span>
                        <span v-text="staff.ordersServed">None</span>
                    </div>        


                </div>
                <div v-if="staff.customer">
                    <transition name="fade" enter-active-class="animated pulse" leave-active-class="animated fadeOutRight">
                        <img v-bind:src="staff.customer.url" width="56px" />
                    </transition>
                </div>
            </div>
    `,
    data: function(){
        return {
            'customer': null,
        }
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

var HOUR_ELAPSED = "hour-elapsed";

var app = new Vue({
    el: '#app',
    data: {
        created: new Date().getTime(),

        // Staff
        cashiers: [],
        staff: [],

        // Customers
        customerQueue: [],
        dissatisfiedCustomers: [],
        servedCustomers: [],

        // Management
        interviewees: [],
        rejectedInterviewees: [],
        income: 0,

        // Rates and metrics
        oneMinuteInMilliSeconds: 3000,
        maxNewCustomersPerPeriod: 3,
        minimumTimePerOrder: 3,
        maxHourlyRate: 50,
        minHourlyRate: 8,
        minOrders: 1,
        maxOrders: 5,
        minOrderCost: 1,
        maxOrderCost: 4,
        totalOrdersServed: 0,
        totalCustomerWaitTimeInMinutes: 0,


        minutesBeforeCustomerUpset: 10,
        minutesBeforeCustomerLeaves: 20,
        minutesElapsed: 0,
    },

    computed: {
        hoursElapsed: function(){
            return parseInt(this.minutesElapsed / 60);
        },

        currentTime: function(){
            var hours = parseInt(this.hoursElapsed % 12);
            var minutes = (this.minutesElapsed - (this.hoursElapsed * 60));
            if(hours < 10){
                hours = "0" + hours;
            }
            if(minutes < 10){
                minutes = "0" + minutes;
            }
            return hours + ":" + minutes;
        },

        totalCustomers: function(){
            return this.servedCustomers.length + this.dissatisfiedCustomers.length + this.customerQueue.length;
        },

        averageWaitTimeInMinutes: function(){
            return this.totalCustomers > 0 ? parseInt(this.totalCustomerWaitTimeInMinutes / this.totalCustomers) : 0;
        },

        efficiency: function(){
            return this.totalCustomers <= 0 ? 0 : parseInt((this.servedCustomers.length / this.totalCustomers) * 100);
        },

        expense: function(){
            var totalWages = 0;
            var minutes = this.minutesElapsed;
            for (var i = this.cashiers.length - 1; i >= 0; i--) {
                var cashier = this.cashiers[i];
                totalWages += ((minutes / 60) * cashier.hourlyRate);
            }
            return totalWages;
        },

        profit: function(){
            return this.income - this.expense;
        },
    },

    mounted: function(){
        this.setup();
    },
    events: {
        customerServed: function(){
            console.log("A customer was just served");
        },
    },
    methods: {
        setup: function(){
            this.addStartingStaff();
            this.addStartingCashiers();
            this.play();
        },

        /**
         * Starts the simulation
         * @return {[type]} [description]
         */
        play: function(){
            this.newCustomerInterval = setInterval(this.addCustomers, this.oneMinuteInMilliSeconds);
            this.clockInterval = setInterval(function(){
                app.minutesElapsed++;
                if(app.minutesElapsed % 60 == 0){
                    app.$emit(HOUR_ELAPSED);
                }
            }, this.oneMinuteInMilliSeconds);
        },

        /**
         * Pauses the simulation
         * @return {[type]} [description]
         */
        stop: function(){
            this.clearIntervals([
                this.clockInterval,
                this.newCustomerInterval,
            ]);
        },

        clearIntervals: function(intervals){
            for (var i = intervals.length - 1; i >= 0; i--) {
                if(interval){
                    var interval = intervals[i];
                    clearInterval(interval);
                }
            }
        },

        addCustomerToQueue: function(){
            var randomNum = getRandomInt(27);
            var customer = {
                'id': 'cust' + randomNum + '-' + new Date().getTime() + '-' + getRandomIntBetween(1, 1000),
                'url': '/static/img/' + randomNum + '.svg',
                'numOrders': getRandomIntBetween(this.minOrders, this.maxOrders),
                'orderCost': getRandomIntBetween(this.minOrderCost, this.maxOrderCost),
                'created': new Date().getTime(),
                'served': false,
                'staff': null,
                'patienceInSeconds': getRandomIntBetween(1, this.minutesBeforeCustomerUpset),
                'impatient': false,
                'timeServed': null,
                'minutesBeforeServed': 0,
            };
            // console.log("Adding customer", customer);
            this.customerQueue.push(customer);
            setTimeout(function(){
                var secondsWaiting = (new Date().getTime() - customer.created) / this.oneMinuteInMilliSeconds;
                if(!customer.served && !customer.staff){
                    customer.impatient = true;
                    setTimeout(function(){
                        var index = app.customerQueue.indexOf(customer);
                        if(index > -1){
                            app.customerQueue.splice(index, 1);
                            app.dissatisfiedCustomers.push(customer);
                        }
                    }, getRandomIntBetween(1, app.minutesBeforeCustomerLeaves - app.minutesBeforeCustomerUpset) * app.oneMinuteInMilliSeconds)
                }

            }, customer.patienceInSeconds * this.oneMinuteInMilliSeconds);
        },

        addCustomers: function(){
            var numCustomers = getRandomInt(this.maxNewCustomersPerPeriod);
            for(var i = 0; i < numCustomers; i++){
                this.addCustomerToQueue();
            }
        },

        /**
         * Adds some random staff to add to the restaraunt
         */
        addStartingStaff: function(){
            var numStaff = getRandomInt(3);
            console.log("Adding", numStaff, "starting staff");
            for(var i = 0; i < numStaff; i++){
                this.addStaff();
            }
        },

        /**
         * Randomly pick a number of staff to start working as cashiers
         */
        addStartingCashiers: function(){
            var numStaff = this.staff.length;
            var numCashiers = getRandomInt(numStaff);
            for(var i = 0; i < numCashiers; i++){
                this.addCashiers();
            }
        },

        /**
         * Create random attributes for a staff member
         */
        addStaff: function(){
            this.staff.push({
                'url': '/static/img/staff' + getRandomInt(9) + '.svg',
                'customer': null,
                'ordersServed': 0,

                // raw metrics
                'speed': getRandomIntBetween(1, 10),
                'accuracy': getRandomIntBetween(1, 10),
                'hourlyRate': getRandomIntBetween(this.minHourlyRate, this.maxHourlyRate),

                // generated metrics
                'daysHired': 0,
            });
        },


        addCashiers: function(){
            if(this.staff.length > 0){
                var staff = this.staff.shift();
                this.cashiers.push(staff);
            }
        },

        serveCustomer: function(){
            if(this.customerQueue.length > 0){
                for(var i = 0; i < this.cashiers.length; i++){
                    var staff = this.cashiers[i];
                    if(staff.customer == null){
                        var customer = this.customerQueue.shift();
                        customer.staff = staff;
                        customer.timeServed = new Date().getTime();
                        customer.minutesBeforeServed = (customer.timeServed - customer.created) / this.oneMinuteInMilliSeconds;
                        this.totalCustomerWaitTimeInMinutes += customer.minutesBeforeServed;
                        staff.customer = customer;
                        var timeToServe = app.getTimeToServe(staff, customer.numOrders);
                        setTimeout(function(){
                            app.servedCustomers.push(staff.customer);
                            app.income += staff.customer.orderCost;
                            staff.ordersServed += customer.numOrders;
                            app.totalOrdersServed += staff.customer.numOrders;
                            staff.customer.served = true;
                            staff.customer = null;
                            app.$emit("customer-served");
                        }, timeToServe);
                        break;
                    } else {
                    }
                }
            }
        },


        /**
         * Caclulates how long it will take a given staff member to serve
         * an order. It takes into consideration their accuracy and speed
         */
        getTimeToServe: function(staff, numOrders){
            var timeToServe = 0;
            var ordersServed = staff.ordersServed;
            for (var i = numOrders - 1; i >= 0; i--) {
                var timeForOrder = this.minimumTimePerOrder;
                // We're using a simple model here... 
                // If the accuracy is 6 / 10, then the first 6 orders
                // will be served flawlessly, then the next 4 inaccurately.
                // It takes double time the cashier serves the order incorrectly
                if(((ordersServed + i) % 10) > staff.accuracy){
                    timeForOrder *= 3;
                }
                timeToServe += timeForOrder;
            }
            // Divide by their speed
            timeToServe /= staff.speed;
            return timeToServe * this.oneMinuteInMilliSeconds;
        },

    },


    watch: {
        customerQueue: function(){
            this.serveCustomer();
        }
    }
});

