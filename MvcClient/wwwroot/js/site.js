﻿// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
$(document).ready(function(){
    $('#formLogin').submit(function(e){
        e.preventDefault();
    })
    $(document).on('click','#loginSubmit',function(){
        var token = $('input[name="__RequestVerificationToken"]').val();
        var username = $('#userNameLogin').val();
        var pw = $('#pwLogin').val();
        if(username==null || pw == null || username.trim() == ""  || pw.trim() == ""){
            $('#err_login').text('Username and password not empty');
            $('#err_login').css("display","block");
        }
        else{
            $('#err_login').css('display','none');
            $.ajax({
                type:"POST",
                url: $(this).data('request-url'),
                data:{
                    __RequestVerificationToken: token,
                    model:{
                        Username: username,
                        Password: pw,
                        Message: ""
                    }
                },
                success: function(result){
                    if(result.Message != null){
                        $('#err_login').text(result.Message);
                        $('#err_login').css("display","block");
                    }
                    else{
                        $('#account_partial').html(result);
                        $('#loginModal').modal('hide');
                        $('#partial').load(location.href + ' #partial');
                    }
                },
                complete: function(){
                    
                },
                error: function(){
                   
                }
            })
        }
        
    })
    $(document).on('click','.addCart',function(){
        var url = $('#addToCart').val();
        var id = $(this).attr('id');
        var name = $('#name_'+id).text();
        var price = $('#price_' +id).val();
        var type = $('#type_' + id).val();
        $.ajax({
            type:'POST',
            url: url,
            data:{
                item:{
                    Id:id,
                    Price:price,
                    Name:name,
                    Type:type
                },
                Quantity: 1
            },
            success:function(data){
                $('#totalPrice').text('$'+data.TotalPrice);
                $('#totalItem').text(data.TotalItem);
                alert('Add to cart successfully');
            },
            error:function(){
                alert("Add to cart failed");
            }
        })
    })
    $(document).on('click','.value-minus,.value-plus,.close1',function(){
        var temp = $(this).attr('id');
        var id = temp.slice(6);
        var action = temp.slice(0,5);
        UpdateCart(action,id);
    })
    function UpdateCart(action,ItemId){
        var url = $('#UrlUpdateCart').val();
        $.ajax({
            type:'POST',
            url:'/Cart/UpdateCart',
            data:{
                action:action,
                ItemId:ItemId
            },
            success: function(data){
                $("#partial").html(data);
            },
            
        })
    }
    $(document).on('click','#navigate',function(){
        $.ajax({
            type:"GET",
            url:'/Cart/GetInfor',
            success:function(data){
                $('#partial').html(data);
            },
            complete:function(){
                $(this).css('display','none');
            }
        })
    })
    $(document).on('click','#back',function(){
        $.ajax({
            type:"POST",
            url:'/Cart/UpdateCart',
            success:function(data){
                $('#partial').html(data);
            },
            
        })
    })
    $('#formRegister').submit(function(e){
        e.preventDefault();
    })
    $(document).on('click','#registerSubmit',function(){
        var token = $('input[name="__RequestVerificationToken"]').val();
        var ischeck = true;
        var listpart = ['name', 'phone','username','password','confirmPassword','address','gender'];
        var listerrorString = ['Invalid name', 'Invalid phone','Invalid username','Invalid password','Invalid password'];
        var listregex = [/[^a-z0-9A-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]/u, /^[0-9]{10,11}$/, /^[a-zA-Z0-9]+@[a-zA-Z]+.[a-zA-Z]+$/, /\w{5,30}/, /\w{5,30}/];
        var listdata = [];
        // get data
        for (var i =0;i<listpart.length;++i ) {
            var str = '#'+ listpart[i] +'Register';
            if(listpart[i]!='gender')
                listdata.push($(str).val().trim());
            else listdata.push( parseInt($(str).val()) );
        }
        //check data
        for (var i =0;i<listdata.length-2;++i ) {
            var str = '#error_'+ listpart[i];
            if( listregex[i].test(listdata[i]) == false){
                $(str).text(listerrorString[i]);
                $(str).css("display","block");
                ischeck = false;
            }
            else{
                $(str).css("display","none");
            }
        }
        if(listdata[3].localeCompare(listdata[4]) !=0 ){
            $('#error_'+ listpart[4]).text("Confirm password doesn't match password.");
            $('#error_'+ listpart[4]).css("display","block");
            ischeck = false;
        }else{
            $('#error_'+ listpart[4]).css("display","none");
        }
        
        if(ischeck == true){
            $.ajax({
                type:"POST",
                url: $(this).data('request-url'),
                data:{
                    __RequestVerificationToken: token,
                    name: listdata[0],
                    phone: listdata[1],
                    address: listdata[5],
                    sex: listdata[6],
                    username: listdata[2],
                    password: listdata[3]
                },
                success: function(result){
                    if(result.Message != null){
                        alert(result.Message);
                    }
                    else{
                        alert("Register success!");
                        $('#account_partial').html(result);
                        $('#registerModal').modal('hide');
                    }
                },
                complete: function(){
                    
                },
                error: function(){
                   
                }
            })
        }
    })

});