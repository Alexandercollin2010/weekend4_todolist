$(document).ready(function(){
  getTasks();
  $(document).on('click', '.deleteButton', deleteTask);
  $(document).on('click', '.completeButton', completeTask);

  // allows you to submit form when you hit enter
  $('#form').keydown(function(e) {
    if (e.keyCode == 13) {
      $('#form').submit();
    }// end if statement
  });// end form function

  // submits task to /addtask post on the server
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

  // function on my delete button that deletes the task
  function deleteTask(){
    if(confirm("Are you sure you want to delete this task?")) {
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
          console.log(error);
        }
      });// end ajax call
    }// end if statement
  }// end deleteTask

  // function on my complete task button that completes the task
  function completeTask(){
    var objectToSend = {
      id: $(this).attr('data')
    };
    $.ajax({
      type:'PUT',
      url:'/completedTasks',
      data: objectToSend,
      success:function(response){
        console.log(response, 'yo');
      }
    });//end ajax
    getTasks();
  }// end completeTask

  // gets all the tasks from the database and displays them on the DOM
  function getTasks(){
    $.ajax({
      type: 'GET',
      url: '/getTasks',
      success: function(response){
        console.log('Back from get: ', response);
        $('#listTasks').html('');
        var outputText= '';
        for (var i = 0; i < response.length; i++) {
          if(response[i].status === true){
            outputText += '<p class="complete">' + response[i].name + '</p><button class="deleteButton" data="' + response[i].id + '">Delete Task</button>';
          }else {
            outputText += '<p>' + response[i].name + '</p><button class="deleteButton" data="' + response[i].id + '">Delete Task</button><button class="completeButton" data="' + response[i].id + '">Completed Task</button>';
          }
        }// end for loop
        $('#listTasks').html(outputText);
      }// end success
    });// end ajax get call
  }// end getTasks


});// end document ready
