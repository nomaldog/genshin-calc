document.addEventListener('DOMContentLoaded', function(event) {
  var app = new Vue({
    el: '#app',
    data: {
      exp_table:null,
      rarity_list:[1,2,3,4,5],
      level_list:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
      input: {
        rarity:5,
        before:0,
        after:20
      },
      result: {
        artifacts:[0,0,0,0,0],
        mora:0,
        message:'',
        message_style:''
      }
    },
    computed: {
      calcCost: function(){
        this.result.message = '';
        this.result.message_style = '';
        if(!this.exp_table){
          return;
        }else if(this.input.before > this.input.after){
          this.result.message = 'エラー：目標レベルは現在のレベル以下で設定してください';
          this.result.message_style = 'alert alert-danger';
        }
        if(this.result.message_style === 'alert alert-danger')return;

        const max_level = [0,4,4,12,16,20];
        this.input.after = max_level[this.input.rarity] < this.input.after ? max_level[this.input.rarity] : this.input.after;

        const before_exp = this.exp_table.find((v) => v.level == this.input.before && v.rarity == this.input.rarity).total_exp;
        const after_exp  = this.exp_table.find((v) => v.level == this.input.after  && v.rarity == this.input.rarity).total_exp;
        const need_exp = after_exp - before_exp;
        const get_exp = [3780,2520,1260,840,420];
        
        this.result.artifacts.forEach(function(artifact,index){
          this.result.artifacts[index] = Math.ceil(need_exp / get_exp[index]);
        },this);
        this.result.mora = need_exp.toLocaleString('ja-JP');
      }
    },
    mounted: function () {
      axios.get('./json/exp_table_artifact.json?timestamp=${new Date().getTime()}').then(response => (this.exp_table = response.data));
    }
  })
})