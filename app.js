document.addEventListener("DOMContentLoaded", function(event) {
    var app = new Vue({
    el: '#app',
    data: {
       items:null
    },
    mounted: function () {
      axios.get("./character.json").then(response => (this.items = response.data))
    }
  })
})