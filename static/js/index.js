function getRandomInt(max){
    var randomNum = 1 + parseInt(Math.floor(Math.random() * max));
    return randomNum;
}
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