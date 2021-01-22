document.addEventListener('DOMContentLoaded', function(event) {
  var app = new Vue({
    el: '#app',
    data: {
      characters:null,
      exp_table:null,
      talent_table:null,
      talent_list:[1,2,3,4,5,6,7,8,9,10],
      input:{
        character:'なし',
        org:1,
        nxt:80,
        break_org:false,
        break_nxt:false,
        talents:[{before:1, after:1, name:'天賦1'},{before:1, after:1, name:'天賦2'},{before:1, after:1, name:'天賦3'}]
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
              elem5_material:0,
              talent2_material:0,
              talent3_material:0,
              talent4_material:0,
              weekly_material:0,
              crown_material:0,
              message:'',
              message_style:''
            }
    },
    computed: {
      selected_character: function () {
        return this.characters ? this.characters.find((v) => v.name === this.input.character) 
                               : {'name': 'なし',
                                  'element': 'なし',
                                  'local_material': '特産品',
                                  'star1_material': '魔物素材(★1)',
                                  'star2_material': '魔物素材(★2)',
                                  'star3_material': '魔物素材(★3)',
                                   'talent': '天賦専用素',
                                   'weekly': '週次限定BOSS素材'
                                };
      },
      calcCost: function(){
        // pre error check
        this.result.message = '';
        this.result.message_style = '';
        if(!this.exp_table || !this.characters || !this.talent_table){
          return;
        }else if(this.input.org === '' || this.input.nxt === ''){
          this.result.message = 'エラー：レベルを設定してください';
          this.result.message_style = 'alert alert-danger';
        }else if(this.input.org < 0 || this.input.org > 90 || this.input.nxt < 0 || this.input.nxt > 90 ){
          this.result.message = 'エラー：レベルは1から90の範囲で設定してください';
          this.result.message_style = 'alert alert-danger';
        }else if(this.input.org > this.input.nxt){
          this.result.message = 'エラー：目標レベルは現在のレベル以下で設定してください';
          this.result.message_style = 'alert alert-danger';
        }else if((this.input.org == 90 && this.input.break_org) || (this.input.nxt == 90 && this.input.break_nxt)){
          this.result.message = 'エラー：90レベルの突破はできません';
          this.result.message_style = 'alert alert-danger';
        }

        this.input.talents.forEach(function(talent,index){
          if(talent.after < talent.before){
            this.result.message = 'エラー：目標レベルは現在のレベル以下で設定してください';
            this.result.message_style = 'alert alert-danger';
          }
        },this);

        if(this.result.message_style === 'alert alert-danger')return;

        // calc exp and mora
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
        
        // calc material
        const nxt_row_brk = this.exp_table.find((v) => v.level == Number(this.input.nxt) + this.input.break_nxt ? 1 : 0);
        const org_row_brk = this.exp_table.find((v) => v.level == Number(this.input.org) + this.input.break_org ? 1 : 0);
        this.result.local_material  = nxt_row_brk.local  - org_row_brk.local;
        this.result.demon1_material = nxt_row_brk.demon1 - org_row_brk.demon1;
        this.result.demon2_material = nxt_row_brk.demon2 - org_row_brk.demon2;
        this.result.demon3_material = nxt_row_brk.demon3 - org_row_brk.demon3;
        this.result.elite_material = this.selected_character.name.match("主人公") ? 0 : nxt_row_brk.elite - org_row_brk.elite;
        this.result.elem2_material = nxt_row_brk.elem2 - org_row_brk.elem2;
        this.result.elem3_material = nxt_row_brk.elem3 - org_row_brk.elem3;
        this.result.elem4_material = nxt_row_brk.elem4 - org_row_brk.elem4;
        this.result.elem5_material = nxt_row_brk.elem5 - org_row_brk.elem5;
        
        // calc talent
        this.result.talent2_material = 0;
        this.result.talent3_material = 0;
        this.result.talent4_material = 0;
        this.result.weekly_material = 0;
        this.result.crown_material = 0;
        this.input.talents.forEach(function(talent,index){
          const talent_material_bef = this.talent_table.find((v) => v.level == Number(talent.before));
          const talent_material_aft = this.talent_table.find((v) => v.level == Number(talent.after));
          this.result.talent2_material += talent_material_aft.talent2 - talent_material_bef.talent2;
          this.result.talent3_material += talent_material_aft.talent3 - talent_material_bef.talent3;
          this.result.talent4_material += talent_material_aft.talent4 - talent_material_bef.talent4;
          this.result.weekly_material += talent_material_aft.weekly - talent_material_bef.weekly;
          this.result.crown_material += talent_material_aft.crown - talent_material_bef.crown;
          this.result.demon1_material += talent_material_aft.demon1 - talent_material_bef.demon1;
          this.result.demon2_material += talent_material_aft.demon2 - talent_material_bef.demon2;
          this.result.demon3_material += talent_material_aft.demon3 - talent_material_bef.demon3;
          result_mora += talent_material_aft.mora - talent_material_bef.mora;
        },this);
        
        this.result.mora = result_mora.toLocaleString('ja-JP');
        return;
      }
    },
    mounted: function () {
      axios.get('./json/characters.json').then(response => (this.characters = response.data));
      axios.get('./json/exp_table.json').then(response => (this.exp_table = response.data));
      axios.get('./json/talent_table.json').then(response => (this.talent_table = response.data));
    }
  })
})