document.addEventListener("DOMContentLoaded", function(event) {
    var app = new Vue({
    el: '#app',
    data: {
       characters:null,
       selected:"なし"
    },
    computed: {
      selected_character: function () {
        return this.characters.find((v) => v.name === this.selected);
      }
    },
    mounted: function () {
      axios.get("./character.json").then(response => (this.characters = response.data))
    }
  })
})