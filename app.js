document.addEventListener('DOMContentLoaded', function(event) {
  var app = new Vue({
    el: '#app',
    data: {
      characters:null,
      exp_table:null,
      input:{
        selected:'なし',
        org:1,
        nxt:80,
        break_org:false,
        break_nxt:false
      },
      result:{exp_book4:0 ,
              exp_book3:0 ,
              exp_book:0 ,
              mora:0,
              local_material:0,
              demon1_material:0,  
              demon2_material:0,
              demon3_material:0,
              elite_material:0,
              elem2_material:0,
              elem3_material:0,
              elem4_material:0,
              elem5_material:0}
    },
    computed: {
      selected_character: function () {
        return this.characters ? this.characters.find((v) => v.name === this.input.selected) : {'name': 'なし',  'element': 'なし',  'local_material': '特産品',  'star1_material': '魔物素材(★1)',  'star2_material': '魔物素材(★2)',  'star3_material': '魔物素材(★3)'};
      },
      calc_exp: function(){
        if(this.exp_table && this.characters && this.input.org && this.input.nxt){
          const nxt_row = this.exp_table.find((v) => v.level == Number(this.input.nxt));
          const org_row = this.exp_table.find((v) => v.level == Number(this.input.org));
          
          const result_exp = nxt_row.total_exp - org_row.total_exp;
          this.result.exp_book4 = Math.ceil(result_exp / 20000);
          this.result.exp_book3 = Math.ceil(result_exp /  5000);
          this.result.exp_book2 = Math.ceil(result_exp /  1000);

          const break_point = [20,40,50,60,70,80];
          let result_mora = nxt_row.total_mora - org_row.total_mora;
          break_point.forEach(function(bp,index){
            if(this.input.break_nxt && bp == Number(this.input.nxt)) result_mora += 20000 * (index + 1);
            if(this.input.break_org && bp == Number(this.input.org)) result_mora -= 20000 * (index + 1);
          }, this);
          this.result.mora = result_mora.toLocaleString('ja-JP');
        }
        return null;
      },
      calc_material: function(){
        const nxt_row = this.exp_table.find((v) => v.level == Number(this.input.nxt) + this.input.break_nxt ? 1 : 0);
        const org_row = this.exp_table.find((v) => v.level == Number(this.input.org) + this.input.break_org ? 1 : 0);
        this.result.local_material = nxt_row.local - org_row.local;
        this.result.demon1_material = nxt_row.demon1 - org_row.demon1;
        this.result.demon2_material = nxt_row.demon2 - org_row.demon2;
        this.result.demon3_material = nxt_row.demon3 - org_row.demon3;
        this.result.elite_material = this.selected_character.name === "主人公" ? 0 : nxt_row.elite - org_row.elite;
        this.result.elem2_material = nxt_row.elem2 - org_row.elem2;
        this.result.elem3_material = nxt_row.elem3 - org_row.elem3;
        this.result.elem4_material = nxt_row.elem4 - org_row.elem4;
        this.result.elem5_material = nxt_row.elem5 - org_row.elem5;
        return null;
      }
    },
    mounted: function () {
      axios.get('./characters.json').then(response => (this.characters = response.data));
      axios.get('./exp_table.json').then(response => (this.exp_table = response.data));
    }
  })
})