document.addEventListener("DOMContentLoaded", function(event) {
  var app = new Vue({
    el: '#app',
    data: {
      // json
      characters:null,
      exp_table:null,

      // input
      selected:"なし",
      input_org:1,
      input_nxt:80,
      input_break_org:"0",
      input_break_nxt:"1",
      // result
      exp_star4:0 ,
      exp_star3:0 ,
      exp_star2:0 ,
      mora:0
    },
    computed: {
      selected_character: function () {
        return this.characters ? this.characters.find((v) => v.name === this.selected) : {"name": "なし",  "element": "なし",  "local_material": "特産品",  "star1_material": "通常素材(★1)",  "star2_material": "通常素材(★2)",  "star3_material": "通常素材(★3)"};
      },
      calc_exp: function(){
        if(this.exp_table && this.characters){
          // 経験値テーブルの検索
          const nxt_row = this.exp_table.find((v) => v.level == Number(this.input_nxt));
          const org_row = this.exp_table.find((v) => v.level == Number(this.input_org));

          // 経験値本の計算
          const result_exp = nxt_row.total_exp - org_row.total_exp;
          this.exp_star4 = Math.ceil(result_exp / 20000); // 星4経験値本：必要数
          this.exp_star3 = Math.ceil(result_exp /  5000); // 星3経験値本：必要数
          this.exp_star2 = Math.ceil(result_exp /  1000); // 星2経験値本：必要数

          // モラの計算
          const break_point = [20,40,50,60,70,80];
          let result_mora = nxt_row.total_mora - org_row.total_mora;
          break_point.forEach(function(bp,index){
            if(this.input_break_nxt==="1" && bp == this.input_nxt) result_mora += 20000 * (index + 1);
            if(this.input_break_org==="1" && bp == this.input_org) result_mora -= 20000 * (index + 1);
          }, this);
          this.mora = result_mora.toLocaleString('ja-JP');
        }
        return null;
      }
    },
    mounted: function () {
      axios.get("./characters.json").then(response => (this.characters = response.data));
      axios.get("./exp_table.json").then(response => (this.exp_table = response.data));
    }
  })
})