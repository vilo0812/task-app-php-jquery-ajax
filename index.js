$(document).ready(function(){
	let editing = false;
	$('#task-result').hide();
	fetchTasks(); 
	$('#search').keyup(function () {
		if($('#search').val()){
			let search = $('#search').val();
		$.ajax({
			url: 'task-search.php',
			type: 'POST',
			data: {search},
			success: function(response){
				var tasks = JSON.parse(response);
				var template = '';
				tasks.forEach(task => {
					template += `<li>
						${task.name}
					</li>`
				})
				$('#container').html(template);
				$('#task-result').show();
			}
		})
		}else{
		$('#task-result').hide();
		}
	})
	$('#task-form').submit(function(e){
		const postData = {
		name: $('#name').val(),
		description: $('#description').val(),
		id:$('#taskId').val()
		};
		let url = editing === false ? 'task-add.php' : 'task-update.php'
		$.post(url,postData,function(response){
			console.log(response)
			fetchTasks();
			$('#task-form').trigger('reset');
		})
		e.preventDefault();
	});
	function fetchTasks(){	
	$.ajax({
		url:'task-list.php',
		type:'GET',
		success:function(response){
			var tasks = JSON.parse(response);
			let template = '';
			tasks.forEach( function(task, index) {
				template += `
				<tr taskId="${task.id}">
					<td >${task.id}</td>
					<td>
						<a href="#" class="task-item">${task.name}</a>
					</td>
					<td>${task.description}</td>
					<td>
						<button class="task-delete btn btn-danger">
						Delete
						</button>
					</td>
				</tr>`
			});
			$('#tasks').html(template);
		}
	})
	}
	$(document).on('click','.task-delete',function(){
		if(confirm('Are you sure you want to delete?')){
		let element = $(this)[0].parentElement.parentElement;
		let id = $(element).attr('taskId');
		console.log(id);
		$.post('task-delete.php',{id},function(res){
			fetchTasks();
		})
		}
	})
	$(document).on('click','.task-item', function(){
		let element = $(this)[0].parentElement.parentElement;
		let id = $(element).attr('taskId');
		$.post('task-edit.php',{id},function(res){
		const task = JSON.parse(res);
		$('#name').val(task.name);
		$('#description').val(task.description);
		$('#taskId').val(task.id);
		editing = true;
		})
	})
});