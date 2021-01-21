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
      input_break_org:false,
      input_break_nxt:false,
      // result
      exp_star4:0 ,
      exp_star3:0 ,
      exp_star2:0 ,
      mora:0,
      local_material:0,
      star1_material:0,
      star2_material:0,
      star3_material:0
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
            if(this.input_break_nxt && bp == this.input_nxt) result_mora += 20000 * (index + 1);
            if(this.input_break_org && bp == this.input_org) result_mora -= 20000 * (index + 1);
          }, this);
          this.mora = result_mora.toLocaleString('ja-JP');
        }
        return null;
      },
      calc_material: function(){
        // 必要素材カウント(0:特産, 1:魔物星1, 2:魔物星2, 3:魔物星3, 4:精鋭, 5:属性星2, 6:属性星3, 7:属性星4, 8:属性星5) * 現在値・目標値
        let need_mat = [[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]];
        for (let i = 0; i < 2; i++) {
          let tgt_lv = (i==0 ? this.input_org + (this.input_break_org ? 1 : 0) : this.input_nxt + (this.input_break_nxt ? 1 : 0));
          if(tgt_lv > 20){
            need_mat[0][i] += 3;
            need_mat[1][i] += 3;
            need_mat[5][i] += 1;
          }
          if(tgt_lv > 40){
            need_mat[0][i] += 10;
            need_mat[1][i] += 15;
            need_mat[4][i] += 2;
            need_mat[6][i] += 3;
          }
          if(tgt_lv > 50){
            need_mat[0][i] += 20;
            need_mat[2][i] += 12;
            need_mat[4][i] += 4;
            need_mat[6][i] += 6;
          }
          if(tgt_lv > 60){
            need_mat[0][i] += 30;
            need_mat[2][i] += 18;
            need_mat[4][i] += 8;
            need_mat[7][i] += 3;
          }
          if(tgt_lv > 70){
            need_mat[0][i] += 45;
            need_mat[3][i] += 12;
            need_mat[4][i] += 12;
            need_mat[7][i] += 6;
          }
          if(tgt_lv > 80){
            need_mat[0][i] += 60;
            need_mat[3][i] += 24;
            need_mat[4][i] += 20;
            need_mat[8][i] += 6;
          }
        }
        this.local_material = need_mat[0][1] - need_mat[0][0];
        this.star1_material = need_mat[1][1] - need_mat[1][0];
        this.star2_material = need_mat[2][1] - need_mat[2][0];
        this.star3_material = need_mat[3][1] - need_mat[3][0];
        return null;
      }
    },
    mounted: function () {
      axios.get("./characters.json").then(response => (this.characters = response.data));
      axios.get("./exp_table.json").then(response => (this.exp_table = response.data));
    }
  })
})