//配列
var todolist = [];

//入力内容取得用の変数
var memolist;

//ローカルストレージ読み込み
var get_todolist = localStorage.getItem('todo');

//ローカルストレージの中身がある時のみ配列を再現
if( get_todolist != null){

  todolist = JSON.parse(get_todolist);

}


//todoリスト更新
function todolist_refresh(){

  //ul以下li全削除
  $('#todolist').empty();

  var append_list="";
  //todoリスト更新
  for ( var i = 0; i < todolist.length; i++ ) {

    append_list += "<li class='list_item' id='list_"+i+"'>" + todolist[i] + "</li>";

  }

  $('#todolist').html(append_list);

}



function todolist_save(){

  //ローカルストレージ保存
  var set_todolist = JSON.stringify(todolist);
  localStorage.setItem('todo', set_todolist);

}



//保存内容がある時todolistを表示。
if( todolist != null　){

  todolist_refresh();

}



//追加
$('#todo-submit').on('click',function(){

  //テキストエリアの中身取得
  memolist = $('textarea[name="text2"]').val();

  if( !memolist.match(/\S/g) ){
    
    //何も入力されていない(空白の場合)  
    alert("テキストを入力してから追加ボタンを押して下さい。");
  
  }else{
    
    //何かしら入力されている場合
    
    //配列に追加。
    todolist.unshift(memolist);

    todolist_save();
    todolist_refresh();

    //テキストエリアを初期化。
    $('textarea[name="text2"]').val("");

  }

})




var target_no;

//処理対象選択
$(document).on("click", ".list_item", function () {
  
  $('#list_' + target_no).css('background-color','');
  var index = $(this).index();
  target_no = index;
  $('#list_' + target_no).css('background-color','skyblue');

});



//削除
$('#todo-delete').on('click',function(){
  
  if(target_no != undefined){
    
    //削除対象を選んでいる場合
    var delete_confirm = window.confirm( todolist[target_no] + "\n\n上記の内容を削除します。\nよろしいですか？");
    
    if(delete_confirm == true){
    
      alert("削除しました。");
      //削除処理
      todolist.splice( target_no , 1 );
      //結果を保存の上、リストを更新
      todolist_save();
      todolist_refresh();
    
    }else{
    
      $('#list_' + target_no).css('background-color','');
    
    }

  }else{
    
    //いきなり削除を押した場合
    alert("削除したいtodoをリストから選択してください。");
  
  }

  target_no = undefined;

})




//変更
$('#todo-change').on('click',function(){
  
  if(target_no != undefined){
    
    //変更対象を選んでいる場合
    var change_prompt = window.prompt( "変更内容を入力してください。" , todolist[target_no] );
    
    if(change_prompt != null){

      if( !change_prompt.match(/\S/g)){
      
        //空白の場合
        alert("テキストを入力して下さい。");
      
      }else{
      
        //変更処理
        todolist[target_no] = change_prompt;
        //結果を保存の上、リストを更新
        todolist_save();
        todolist_refresh();
        alert("変更しました。");

      }

    }
    
    $('#list_' + target_no).css('background-color','');    
  

  }else{
    
    //いきなり変更を押した場合
    alert("変更したいtodoをリストから選択してください。");
  
  }

  target_no = undefined;

})




//全件削除
$('#todo-alldelete').on('click',function(){
  if(todolist.length > 0 ){

    var alldelete_confirm = window.confirm("すべてのtodoを削除します。\nよろしいですか？");
    if(alldelete_confirm == true){
      localStorage.removeItem('todo');
      todolist.length = 0;
      alert("全件削除しました。");
      todolist_save();
      todolist_refresh();
    }

  }else{

    alert("削除項目がありません。");

  }
});
