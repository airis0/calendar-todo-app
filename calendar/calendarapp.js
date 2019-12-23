//スケジュール編集変数
var target_cell_no;   //クリックしたセルのNumber(日にちの数字)
var day_of_the_week;  //曜日識別(元の色に戻すため)

//年・月
var tyear;
var tmonth;


var now = new Date();//現在日時を取得
var nowmonth = now.getMonth();


//スケジュール格納配列
var schedule = [];
//休日設定格納配列
var holiday_schedule = [];

var target_year;
var target_month;
var target_date;
var target_week;


var target_sc_no;

//処理対象の配列ナンバー格納変数
var target_hash_no = 0;


//月の最終日
var day_of_month = [31,28,31,30,31,30,31,31,30,31,30,31];
var lastDay = day_of_month[tmonth - 1];


//ローカルストレージ読み込み
var get_schedule = localStorage.getItem('calen_schedule');
var get_holiday_schedule = localStorage.getItem('holiday_calen_schedule');


//ローカルストレージの中身がある時のみ配列を再現
if( get_schedule != null){

  schedule = JSON.parse(get_schedule);

}

if( get_holiday_schedule != null){

  holiday_schedule = JSON.parse(get_holiday_schedule);

}




/////////////////////////////////
//前月、翌月ボタン

var now_month = 0;
var create_month = 0;

document.getElementById('back').onclick=function(){
  target_cell_no = undefined;
  $('#schedulelist').empty();
  create_month =--now_month;
  calendar(create_month);
}

document.getElementById('next').onclick=function(){  
  target_cell_no = undefined;
  $('#schedulelist').empty();
  create_month =++now_month;
  calendar(create_month);
}


/////////////////////////////////////ファンクション（カレンダー作成）(戻る,次へ)ボタン可変型
var calendar = function(next){

var youbi = ['日','月','火','水','木','金','土']


var now = new Date();//現在日時を取得
var year = now.getFullYear();
var month = now.getMonth();
var mymonth = parseInt(month+next);


var date = now.getDate();
now.setFullYear(year);
now.setMonth(mymonth);
now.setDate(1);//目的の月の1日を指定
var day = now.getDay();//目的の月の初日（1日）の曜日数（火曜日なら2）を取得


var now2 = new Date();
var mymonth2 = parseInt(month+1+next);
now2.setMonth(mymonth2);
now2.setDate(0);//Date(0)で前の月の最終日を取得
var Date2 = now2.getDate(mymonth2);//目的の月の最終日
var week = Math.ceil(((Date2+day)/7)+1);


//monthが12（13月）で年を切り上げ、monthが0未満（０月）で年を切り下げ。その際、monthを0（１月）、11(12月)にする。//


var tbody = document.getElementById('tbody');

if(tbody.childElementCount > 0) {

  tbody.innerHTML = '';

}

var trget=document.getElementsByTagName('tr');
var a = 1;
var v = 0;

var tbody = document.getElementById('tbody');//tbodyのIDを取得(この中で処理します)

for (j = 0; j < week; j++){
    var tr = document.createElement('tr'); //trエレメントを新規作成(ただ生成するだけ)
    for (i = 0; i < 7; i++){ 
      var td = document.createElement('td');//tdエレメントをを生成
      if(j<1){
        var w = v++;
        td.textContent = youbi[w];
        tbody.appendChild(td);
      

      }else if(j<2 && i<day){//「1週目」かつ「iが1日の曜日数（火曜日なら2）より小さい」場合。
        td.textContent = '';
        tbody.appendChild(td);
    
      }else if(a<=Date2){//aがその月の最終日数(8月が31日までなら31)以下の場合。
        td.id = a; 
        td.className = "date_cell";
        td.textContent = a++;
	      tbody.appendChild(td);

   		}else{//上記以外の場合。最終日数(8月が31日までなら31)を超え、枠が余っている場合。
		    td.textContent = '';
        tbody.appendChild(td);
      }


      switch (i)
      {
        case 0:
          td.style.background='pink';
          td.setAttribute("name","sunday");
          break;
        case 1:
          td.setAttribute("name","monday");
          break;
        case 2:
          td.setAttribute("name","tuesday");
          break;
        case 3:
          td.setAttribute("name","wednesday");
          break;
        case 4:
          td.setAttribute("name","thursday");
          break;
        case 5:
          td.setAttribute("name","friday");
          break;              
        case 6:
          td.style.background='lightblue'
          td.setAttribute("name","saturday");
          break;
        default:
          break;
     }

  
   }//列用のループ閉じ
    tbody.appendChild(tr);//tr エレメントをtbody内に追加(ここではじめて表示される)
}//行用のループ閉じ



//カレンダーのタイトル////////

tyear = year;
tmonth = month;
tmonth = tmonth + next;


for(var q=0; q<=10000; q++){
  if(tmonth>11){
    tyear = tyear+1;
    tmonth = tmonth-12;
  }else if(tmonth<0){
    tyear = tyear-1;
    tmonth = tmonth+12;
  }
}

holiday_color_func();
schedule_mark();

var output = tyear + '年' + (tmonth+1) + '月'  ;
document.getElementById('time').textContent = output;

return false;
}
  
///////ファンクション（カレンダー作成）(戻る,次へ)ボタン可変型　終了


calendar(0);



//↑カレンダー作成部分
//////////////////////////////////////////////////////////////////////////////////////
//↓スケジュール編集部分


function schedule_save(){

  //ローカルストレージ保存
  var set_schedule = JSON.stringify(schedule);
  localStorage.setItem('calen_schedule', set_schedule);

}


function holiday_schedule_save(){

  //ローカルストレージ保存
  var set_holiday_schedule = JSON.stringify(holiday_schedule);
  localStorage.setItem('holiday_calen_schedule', set_holiday_schedule);

}


function schedule_list_refresh(){
    //配列を検索し、ターゲット日の予定をリスト表示する。
    var schedule_true_flag = 0;
    schedule.forEach( function( value ){
  
      if( value.s_year==target_year && value.s_month==target_month && value.s_date==target_date ){
        
        //予定を登録している日にちをクリックした時
        schedule_true_flag += 1;
      
      }
  
    });
  
  
    //ul以下li全削除
    $('#schedulelist').empty();
    
    
    if(schedule_true_flag > 0){
      var append_sc_list="";
      var ai = 0;
      //予定あり
      schedule.forEach( function( value ){
        if( value.s_year==target_year ){
          if( value.s_month==target_month ){
            if( value.s_date==target_date ){
              
              //todoリスト更新
      
              append_sc_list += "<li class='list_sc_item' id='list_sc_"+ai+"'>" + value.s_text + "</li>";
              ai =+1;

      
            }
          }
        }
      });
      
      $('#schedulelist').html(append_sc_list);


  
    }else{
      //予定なし
    }


    //年/月/日/曜日を出力
    
    
    var target_week2;

    switch (target_week)
    {
      case 'sunday':
        target_week2 = "(日)";
        break;
      case 'monday':
        target_week2 = "(月)";
        break;
      case 'tuesday':
        target_week2 = "(火)";
        break;
      case 'wednesday':
        target_week2 = "(水)";
        break;
      case 'thursday':
        target_week2 = "(木)";
        break;
      case 'friday':
        target_week2 = "(金)";
        break;              
      case 'saturday':
        target_week2 = "(土)"; 
        break;
      default:
        break;
    }
    
    holiday_schedule_list_refresh();
    schedule_mark();
    document.getElementById('time').textContent = tyear + '年' + (tmonth+1) + '月' + target_date + "日" + target_week2;

}



$(document).on("click", ".date_cell", function () {
  
  //背景色を消し、土日は青・赤にする。
  if( day_of_the_week == "saturday" ){
    $('#' + target_cell_no).css('background-color','lightblue');
  }else if( day_of_the_week == "sunday" ){
    $('#' + target_cell_no).css('background-color','pink');
  }else if( day_of_the_week == undefined || day_of_the_week == "monday" || day_of_the_week == "tuesday" || day_of_the_week == "wednesday" || day_of_the_week == "thursday" || day_of_the_week == "friday" ){
    $('#' + target_cell_no).css('background-color','');
  }
  holiday_color_func();

  target_year = tyear;
  target_month = tmonth+1;
  target_date = $(this).attr('id');
  target_week = $(this).attr('name');
  
  //ターゲットのセルの背景色を変える。
  target_cell_no = target_date;
  $('#' + target_cell_no).css('background-color','yellow');

  day_of_the_week = $(this).attr('name');

  schedule_list_refresh();
  

})



//追加
$('#schedule-submit').on('click',function(){
  if(target_cell_no == undefined ){
    //日にちを選択していない場合
    alert("スケジュールを追加する日を選択して下さい。");
 
  }else{
    //日にちを選択している場合
    //予定の入力、変数への格納を行う。
    var target_text = window.prompt(target_year+'年' + target_month + '月' + target_date + '日\n\n' + '予定を記入して下さい。');
    if(target_text == null){
      //キャンセルを押した場合
    
    }else if( !target_text.match(/\S/g) ){
    
      //入力欄がスペースの場合
      alert("入力欄に予定を記入して下さい。");
    
    }else{
      
      //予定が入力された場合
      
      //配列へ格納
      schedule.push( { s_year : target_year , s_month : target_month , s_date : target_date , s_text : target_text } );
      schedule_save();  
      
      //リスト更新
      schedule_list_refresh();


    }
    

  }
});


//処理対象選択
$(document).on("click", ".list_sc_item", function () {

  $('#list_sc_' + target_sc_no).css('background-color','');
  var sc_index = $(this).index();
  target_sc_no = sc_index;
  $('#list_sc_' + target_sc_no).css('background-color','skyblue');

});




//削除
$('#schedule-delete').on('click',function(){

  if(target_sc_no != undefined){
    
    var target_sc_text = $('#list_sc_' + target_sc_no).text();

    //削除対象を選んでいる場合
    var delete_sc_confirm = window.confirm( target_year+"/"+target_month+"/"+target_date+"\n"+target_sc_text+ "\n\n上記の内容を削除します。\nよろしいですか？");
    
    schedule.forEach( function( value ){
      if( value.s_year == target_year ){
        if( value.s_month == target_month ){
          if( value.s_date == target_date ){
            if( value.s_text == target_sc_text ){
              //配列削除処理
              //配列の数だけ繰り返し、配列を照合。配列の添え字を抽出。
              for ( var i = 0; i < schedule.length; i++ ) {
             
                if(value == schedule[i]){
                  target_hash_no = i;
                }
             
              } 

            }
          }
        }
      }
    })


    if(delete_sc_confirm == true){
    
      alert("削除しました。");
      //削除処理
      schedule.splice( target_hash_no , 1 );
      //結果を保存の上、リストを更新
      schedule_save();
      schedule_list_refresh();
      calendar(create_month);
    
    }else{
    
      $('#list_sc_' + target_sc_no).css('background-color','');
    
    }

  }else{
    
    //いきなり削除を押した場合
    alert("日にちをクリックし、削除したい予定をリストから選択してください。");
  
  }

  target_sc_no = undefined;

})




//変更
$('#schedule-change').on('click',function(){

  if(target_sc_no != undefined){
    
    var target_sc_text = $('#list_sc_' + target_sc_no).text();

    //削除対象を選んでいる場合
    var change_sc_prompt = window.prompt( "変更内容を入力してください。\n"+target_year+"/"+target_month+"/"+target_date , target_sc_text );
    
    if(change_sc_prompt != null){
    
      if( !change_sc_prompt.match(/\S/g) ){
      
        //空白の場合
        alert("テキストを入力して下さい。");
      
      }else{
      
        //変更対象の配列の添え字を特定
        schedule.forEach( function( value ){
          if( value.s_year == target_year ){
            if( value.s_month == target_month ){
              if( value.s_date == target_date ){
                if( value.s_text == target_sc_text ){
                  //配列削除処理
                  //配列の数だけ繰り返し、配列を照合。配列の添え字を抽出。
                  for ( var i = 0; i < schedule.length; i++ ) {
                 
                    if(value == schedule[i]){
                      target_hash_no = i;
                    }
                 
                  } 
    
                }
              }
            }
          }
        })
    
        //変更処理
        schedule[target_hash_no].s_text = change_sc_prompt;
        alert("変更しました。");
        //結果を保存の上、リストを更新
        schedule_save();
        schedule_list_refresh();

      }

    }

    $('#list_sc_' + target_sc_no).css('background-color','');    
    

  }else{
    
    //いきなり変更を押した場合
    alert("日にちをクリックし、変更したい予定をリストから選択してください。");
  
  }

  target_sc_no = undefined;

})



//予定がある日付にマーキング
function schedule_mark(){

  if((tyear % 4 === 0 && (tyear % 100 !== 0 || tyear % 400 === 0)) && tmonth === 2){
    lastDay = 29;
  }  

  for( var i = 0; i <= lastDay; i++ ){
    $("#"+i).html(i);
  }

  schedule.forEach( function( value ){
    if( value.s_year == tyear ){
      if( value.s_month == tmonth+1 ){
        $("#"+value.s_date).html(value.s_date+"<br>●");
      }
    }
  })

}



// 休日設定追加
$('#holiday-plus').on('click',function(){
  var holiday_plus_flag = 0;
  if(target_cell_no == undefined ){
    //日にちを選択していない場合
    alert("休日設定する日を選択して下さい。");
  
  }else{
    //日にちを選択している場合

    //休日設定が0の場合のみ登録、それ以外(休日設定ありの場合)は弾く。
    //配列を回し、選択年月日に該当するかチェック。
    holiday_schedule.forEach( function( value ){
      if( value.h_year == target_year ){
        if( value.h_month == target_month ){
          if( value.h_date == target_date ){
            holiday_plus_flag += 1;
          }
        }
      }
    })

    if( holiday_plus_flag > 0){
      alert("既に休日設定しています。(設定できるのは1件のみ)");
    }else if( holiday_plus_flag == 0){

      //休日予定の入力、変数への格納を行う。
      var target_text = window.prompt(target_year+'年' + target_month + '月' + target_date + '日\n\n' + '予定を記入して下さい。');
      if(target_text == null){
        //キャンセルを押した場合
      
      }else if( !target_text.match(/\S/g) ){
      
        //入力欄がスペースの場合
        alert("入力欄に予定を記入して下さい。");
      
      }else{
        
        //予定が入力された場合
        //配列へ格納
        holiday_schedule.push( { h_year : target_year , h_month : target_month , h_date : target_date , h_text : target_text } );
        holiday_schedule_save();  
        
        //カレンダー更新
        calendar(create_month);      
    
      }
    }
  
  }

});


function holiday_schedule_list_refresh(){
  //配列を検索し、ターゲット日の予定をリスト表示する。
  var holiday_schedule_true_flag = 0;
  holiday_schedule.forEach( function( value ){

    if( value.h_year==target_year && value.h_month==target_month && value.h_date==target_date ){
      
      //予定を登録している日にちをクリックした時
      holiday_schedule_true_flag += 1;
    
    }

  });


  //ul以下li全削除
  $('#holiday_schedulelist').empty();
  
  
  if(holiday_schedule_true_flag > 0){
    holiday_schedule.forEach( function( value ){
      if( value.h_year==target_year ){
        if( value.h_month==target_month ){
          if( value.h_date==target_date ){
            $('#holiday_schedulelist').html("<li class='list_h_item' style='background-color:pink;'>" + value.h_text + "</li>");
          }
        }
      }
    });

  }else{
    //予定なし
  }

}


//配列を回し、現在月の休日設定を取得。
//それをもとに、色分け。
function holiday_color_func(){
  holiday_schedule.forEach( function( value ){
    if( value.h_year==tyear ){
      if( value.h_month==tmonth+1 ){
        $("#"+value.h_date).css('background-color','pink');
      }
    }
  });
}


// 休日設定削除
$('#holiday-delete').on('click',function(){
  var holiday_delete_flag = 0;
  if(target_cell_no == undefined ){
    //日にちを選択していない場合
    alert("休日設定を削除する日を選択して下さい。");
  
  }else{

    holiday_schedule.forEach( function( value ){
      if( value.h_year == target_year ){
        if( value.h_month == target_month ){
          if( value.h_date == target_date ){
            holiday_delete_flag += 1;

            var delete_h_confirm = window.confirm(value.h_year+"/"+value.h_month+"/"+value.h_date+"\n"+value.h_text+ "\n\n上記の休日設定を削除します。\nよろしいですか？");
            if( delete_h_confirm == true){
              //配列削除処理
              //配列の数だけ繰り返し、配列を照合。配列の添え字を抽出。
              for ( var i = 0; i < holiday_schedule.length; i++ ) {
             
                if(value == holiday_schedule[i]){
                  target_hash_no = i;
                  alert("削除しました。");
                  //削除実行
                  holiday_schedule.splice( target_hash_no , 1 );
                  //結果を保存の上、更新
                  holiday_schedule_save();
                  schedule_list_refresh();
                  calendar(create_month);
                }
             
              }

            }

          }
        }
      }
    })
  
    if( holiday_delete_flag == 0 ){
      alert("削除する休日設定がありません。");
    }


  }

})



// 休日設定変更
$('#holiday-change').on('click',function(){
  var holiday_change_flag = 0;
  if(target_cell_no == undefined ){
    //日にちを選択していない場合
    alert("休日設定を変更する日を選択して下さい。");
  
  }else{
    holiday_schedule.forEach( function( value ){
      if( value.h_year == target_year ){
        if( value.h_month == target_month ){
          if( value.h_date == target_date ){
            holiday_change_flag += 1;

            var change_h_prompt = window.prompt("変更内容を入力してください。\n"+value.h_year+"/"+value.h_month+"/"+value.h_date+"\n"+value.h_text);
            if(change_h_prompt != null){
    
              if( !change_h_prompt.match(/\S/g) ){
              
                //空白の場合
                alert("テキストを入力して下さい。");
              
              }else{
                
                //変更対象の配列の添え字を特定
                holiday_schedule.forEach( function( value ){
                  if( value.h_year == target_year ){
                    if( value.h_month == target_month ){
                      if( value.h_date == target_date ){
                        //配列削除処理
                        //配列の数だけ繰り返し、配列を照合。配列の添え字を抽出。
                        for ( var i = 0; i < holiday_schedule.length; i++ ) {
                      
                          if(value == holiday_schedule[i]){
                            target_hash_no = i;
                          }
          
                        } 
            
                      }
                    }
                  }
                })
    
                //変更処理
                holiday_schedule[target_hash_no].h_text = change_h_prompt;
                alert("変更しました。");
                //結果を保存の上、リストを更新
                holiday_schedule_save();
                schedule_list_refresh();

              }
            }        


          }
        }
      }
    })

  if( holiday_change_flag == 0 ){
    alert("変更する休日設定がありません。");
  }

  }

});