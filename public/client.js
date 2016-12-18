$(document).ready(function(){
  getTasks();
  $(document).on('click', '.deleteButton', deleteTask);
  $(document).on('click', '.completeButton', completeTask);


  $('#submitTask').on('click', function(){
    var taskToSend = {
      task: $('#taskInput').val(),
      status: false
    };// end taskToSend
    $.ajax({
      type: 'POST',
      url: '/addtask',
      data: taskToSend,
      success: function(response){
        console.log('Received: ', response);
        getTasks();
      }// end success
    });//end ajax post
    $('#taskInput').val('');
  });// end submitTask on click function


  function deleteTask(){
    var id = $(this).attr('data');
   $.ajax({
       url: '/deletetask',
       type: 'POST',
       data: {
           id: id
       },
       success: function(response) {
           console.log(response);
           getTasks();
       },
       error: function(error) {
           console.log("AJAX error:", error);
       }
   });
  }// end deleteTask

  function completeTask(){

  }// end completeTask

  function getTasks(){
    $.ajax({
      type: 'GET',
      url: '/getTasks',
      success: function(response){
        console.log('Back from get: ', response);
        $('#listTasks').html('');
        var outputText= '';
        for (var i = 0; i < response.length; i++) {
          outputText += '<p>' + response[i].name + '</p><button class="deleteButton" data="' + response[i].id + '">Delete Task</button><button class="completeButton">Completed Task</button>';
        }// end for loop
        $('#listTasks').html(outputText);
      }// end success
    });// end ajax get call
  }// end getTasks


});// end document ready
