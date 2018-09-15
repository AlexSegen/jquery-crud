//var apiURL = "https://jsonplaceholder.typicode.com";

var DEBUG = false;

var apiURL = "http://localhost:3001";

var users = [];

//var user = {};

$.fn.fetchData = function() {
  $.get(apiURL + "/users", data => {

    $.fn.listUsers(data);

  }).done( function(){

    if(DEBUG){console.log('Connected to database!');}

  }).catch(function(){
    $("#userList").append(`
    <tr>
        <td colspan="4">
            <div class="alert alert-danger text-center">Error trying to connect to database!</div>
        </td>
    </tr>
    `);
  });
};

$.fn.listUsers = function(data) {
  
  users = data;

  let userList = $("#userList");

  userList.empty();

  $.each(users, function(index, value) {
    userList.append(`
        <tr id="row-${value.id}">
            <td data-field="id">${value.id}</td>
            <td data-field="name">${value.name}</td>
            <td data-field="email">${value.email}</td>
            <td data-field="status">${value.status ? '<span class="label label-success">Active</span>' : '<span class="label label-danger">Inactive</span>'}</td>
            <td>
            <div class="btn-group">
                <button class="btn btn-default --btn-save" id="btn-save-${value.id}" data-userid="${value.id}" style="display:none;"><i class="fa fa-save"></i></button>
                <button class="btn btn-default --btn-edit" id="btn-edit-${value.id}" data-userid="${value.id}"><i class="fa fa-edit"></i></button>
                <button class="btn btn-default --btn-delete"  data-userid="${value.id}"><i class="fa fa-times text-danger"></i></button>
                <button class="btn btn-${value.status ? 'default':'danger' } --btn-status" data-status="${value.status ? 'active':'inactive' }"  data-userid="${value.id}"><i class="fa fa-${value.status ? 'unlock-alt':'lock' }"></i></button>
		    </div>
            </td>
        </tr
        `);
  });
};

$.fn.getForm = function() {
    let formData = {};
    let inputs = $(".--userform").serializeArray();
    $.each(inputs, function(i, input) {
        formData[input.name] = input.value;
    });
    return formData;
};


$.fn.addUser = function (){

    let user = $.fn.getForm();

    let header = {
        type: "POST",
        url: apiURL + "/users",
        data: JSON.stringify(user),
        //success: success,
        contentType: "application/json; charset=utf-8",
        dataType: "json"
    }
    
    $.ajax(header).done(function() {
        if(DEBUG){console.log('User added!');}
        $('.--userform').trigger("reset");

        //users.push(user);
        //$.fn.listUsers(users);
        $.fn.fetchData();
    });
}


$.fn.deleteUser = function (id){

    let header = {
        type: "DELETE",
        url: apiURL + "/users/" + id,
        //success: success
    }
    
    $.ajax(header).done(function() {
        if(DEBUG){console.log('User deleted :(');}
        $('#row-' + id).fadeOut('fast');
    });
}

$.fn.editUser = function (id){

    $('#btn-save-' + id).fadeIn('fast');
    $('.--btn-edit').attr('disabled','disabled');

    $('td').removeAttr('contenteditable');
    //$('#row-' + id).find('[data-field="id"]').attr("contenteditable",true);
    $('#row-' + id).find('[data-field="name"]').attr("contenteditable",true);
    $('#row-' + id).find('[data-field="email"]').attr("contenteditable",true);
    
}

$.fn.updateUser = function (id){
    
    let fieldId = $('#row-' + id).find('[data-field="id"]');
    let fieldName = $('#row-' + id).find('[data-field="name"]');
    let fieldEmail = $('#row-' + id).find('[data-field="email"]');
    let fieldStatus = $('#row-' + id).find('[data-field="status"]');

    let status;

    if (fieldStatus.text() == 'Active'){
        status = 1;
    } else if (fieldStatus.text() == 'Inactive'){
        status = 0;
    }
    
    var user = {
        id: id,
        name: fieldName.text(),
        email: fieldEmail.text(),
        status: status
    };

    let header = {
        type: "PUT",
        url: apiURL + "/users/" + id,
        data: JSON.stringify(user),
        contentType: "application/json; charset=utf-8",
        dataType: "json"
    }   

    $.ajax(header).done(function() {
        $('#btn-save-' + id).fadeOut('fast');
        $('.--btn-edit').removeAttr('disabled');
        $('td').removeAttr('contenteditable');
        //$.fn.fetchData();
        $('#row-' + id).addClass('success');
        if(DEBUG){console.log('Status updated!');}
    });

}

$.fn.getUser = function(id){
    $.get(apiURL + "/users/" + id, data => {

        let user = data;

        if(DEBUG){console.log('User retrieved.')}

        return user; 

    }).catch(function(){
        if(DEBUG){console.log('Error trying to retrieve user.');}
    });
}

$.fn.changeStatus = function(id,status) {

    var user = new Object();

    $.get(apiURL + "/users/" + id, data => {
        user = data
    }).then(function(){
        
        if(status == 'active'){
            user.status = 0;
        } else if (status == 'inactive') {
            user.status = 1;
        } else {
            if(DEBUG){console.log('Error updating user status');}
        }

        let header = {
            type: "PUT",
            url: apiURL + "/users/" + id,
            data: JSON.stringify(user),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }   
    
        $.ajax(header).done(function() {
            /* users.push(user);
            $.fn.listUsers(users); */
            $.fn.fetchData();
            $('#row-' + id).addClass('info');
            if(DEBUG){console.log('Status updated!');}
        });
    
    });
    
}


$(document).ready(function() {

    $(document).on('submit','.--userform', function(){
        event.preventDefault();
        $.fn.addUser();
    });

    $(document).on('click','.--btn-delete', function(){

        let id = $(this)[0].dataset['userid'];

        
       
        if(confirm('Please, confirm this action.')){

            $(this).button('loading');

            $('#row-' + id).addClass('danger');

            $.fn.deleteUser(id);
        }
        
    });

    $(document).on('click','.--btn-edit', function(){

        let id = $(this)[0].dataset['userid'];

        //let editMode = $(this)[0].dataset['edit'];

        $.fn.editUser(id);

    });

    $(document).on('click','.--btn-save', function(){

        let id = $(this)[0].dataset['userid'];

        $.fn.updateUser(id);

    });

    $(document).on('click','.--btn-status', function(){

        let id = $(this)[0].dataset['userid'];

        let status = $(this)[0].dataset['status'];
        
        if(confirm('Please, confirm this action.')){
            $.fn.changeStatus(id,status);
        }

    });

  $.fn.fetchData();

});
