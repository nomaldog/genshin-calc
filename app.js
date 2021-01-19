document.addEventListener("DOMContentLoaded", function(event) {
    var app = new Vue({
    el: '#app',
    data: {
       characters:null,
       selected:"なし"
    },
    mounted: function () {
      axios.get("./character.json").then(response => (this.characters = response.data))
    }
  })
})